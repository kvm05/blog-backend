const HttpError = require("../models/http-error");
const uuid = require("uuid");
const { validationResult } = require("express-validator");
const Blog = require("../models/blog-model");

const getAllBlogs = async (req, res, next) => {
	try {
		const blogs = await Blog.find({});
		return res.status(200).send(blogs);
	} catch (err) {
		console.log(err);
		const error = new HttpError("Failed to get Blogs. Try again!", 500);
		return next(error);
	}
};

const createBlog = async (req, res, next) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		throw new HttpError("Invalid input!!", 422);
	}
	const { title, content, creator } = req.body;
	const newBlog = new Blog({
		title,
		content,
		creator,
	});

	try {
		await newBlog.save();
		res.status(201).json({ blog: newBlog });
	} catch (err) {
		console.log(err);
		const error = new HttpError("Failed to add Blog. Try again!", 500);
		return next(error);
	}
	
};

const updateBlog = async (req, res, next) => {
	try {
		if (req.params.blog_id) {
			const updatedBlog = await Blog.findByIdAndUpdate(
				req.params.blog_id,
				req.body
			);
			res.status(204).json({ blog: updatedBlog });
		} else {
			return res.status(400).send({
				message:
					"Params Missing? Please provide a blog_id to search blog", 
			});
		}
	} catch (err) {
		console.log(err);
		const error = new HttpError("Failed to update Blog. Try again!", 500);
		return next(error);
	}
};
const deleteBlog = async (req, res, next) => {
	try {
		if (req.params.blog_id) {
			const deletedBlog = await Blog.findByIdAndDelete(
				req.params.blog_id
			);
			res.status(204).json({ blog: deletedBlog });
		} else {
			return res.status(400).send({
				message:
					"Params Missing? Please provide a blog_id to search an blog", 
			});
		}
	} catch (err) {
		console.log(err);
		const error = new HttpError("Failed to delete Blog. Try again!", 500);
		return next(error);
	}
};

exports.getAllBlogs = getAllBlogs;
exports.createBlog = createBlog;
exports.updateBlog = updateBlog;
exports.deleteBlog = deleteBlog;
