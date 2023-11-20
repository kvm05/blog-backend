const User = require("../models/userModel")
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require( "google-auth-library");
const HttpError = require("../models/http-error");
const register = async (req, res) => {
	const { firstname, lastname, email, password } = req.body;
    console.log(email)
	try {
		const existingUser = await User.findOne({ email });
		if (existingUser)
			return res.status(400).json({ error: "User already Exits" });
		const fullname = firstname + " " + lastname;
		const newUser = new User({ email, password, name: fullname });
		const token = await newUser.generateAuthToken();
		await newUser.save();
		res.json({ message: "success", token: token, user: newUser });
	} catch (error) {
		console.log("Error in register " + error);
		res.status(500).send(error);
	}
};
const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const valid = await User.findOne({ email });
		if (!valid) res.status(200).json({ message: "User dont exist" });
		const validPassword = await bcrypt.compare(password, valid.password);
		if (!validPassword) {
			res.status(200).json({ message: "Invalid Credentials" });
		} else {
			const token = await valid.generateAuthToken();
			await valid.save();
			res.cookie("UserToken", token, {
				httpOnly: true,
				maxAge: 24 * 60 * 60 * 1000,
			});
			res.status(200).json({ token: token, status: 200, user: valid });
		}
	} catch (error) {
		res.status(500).json({ error: error });
	}
};
const googleAuth = async (req, res) => {
	try {
		const { tokenId } = req.body;
		const client = new OAuth2Client(process.env.CLIENT_ID);
		const verify = await client.verifyIdToken({
			idToken: tokenId,
			audience: process.env.CLIENT_ID,
		});
		const { email_verified, email, name, picture } = verify.payload;
		if (!email_verified) res.json({ message: "Email Not Verified" });
		const UserExist = await User.findOne({ email }).select("-password");
		if (UserExist) {
			res.cookie("UserToken", tokenId, {
				httpOnly: true,
				maxAge: 24 * 60 * 60 * 1000,
			});
			res.status(200).json({ token: tokenId, User: UserExist });
		} else {
			const password = email + process.env.CLIENT_ID;
			const newUser = await User({
				name: name,
				profilePic: picture,
				password,
				email,
			});
			await newUser.save();
			res.cookie("UserToken", tokenId, {
				httpOnly: true,
				maxAge: 24 * 60 * 60 * 1000,
			});
			res.status(200).json({
				message: "User registered Successfully",
				token: tokenId,
			});
		}
	} catch (error) {
		res.status(500).json({ error: error });
		console.log("error in googleAuth backend" + error);
	}
};

const getUserNameById = async (req, res, next) => {
    try {
        if (req.params.user_id) {
			const user = await User.findById(req.params.user_id);
			res.status(200).json({ name: user.name });
		} else {
			return res.status(400).send({
				message:
					"Params Missing? Please provide a user_id to search user",
			});
		}
    } catch (err) {
        console.log(err);
		const error = new HttpError("Failed to find user. Try again!", 500);
		return next(error);
    }
}

exports.register = register;
exports.login = login;
exports.googleAuth = googleAuth;
exports.getUserNameById = getUserNameById;