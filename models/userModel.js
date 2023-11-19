const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		profilePic: {
			type: String,
			default:
				"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
		},
	},
	{
		timestamps: true,
	}
);
userSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 12);
	}
	next();
});
userSchema.methods.generateAuthToken = async function () {
	try {
		const token = jwt.sign(
			{ id: this._id, email: this.email },
			process.env.SECRET,
			{
				expiresIn: "24h",
			}
		);

		return token;
	} catch (error) {
        console.log(error)
		console.log("error while generating token");
	}
};

module.exports = mongoose.model("User", userSchema);
