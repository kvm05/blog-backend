const express = require("express");
const router = express.Router();
const {check} = require("express-validator")
const HttpError = require("../models/http-error")
const blogControllers = require("../controllers/blog-controller")

router.get('/', blogControllers.getAllBlogs)

router.post(
	"/",
	[
		check("title").not().isEmpty(),
		check("content").not().isEmpty(),
		check("creator").not().isEmpty(),
	],
	blogControllers.createBlog
);

router.patch('/:blog_id', blogControllers.updateBlog)

router.delete('/:blog_id', blogControllers.deleteBlog)

module.exports = router;