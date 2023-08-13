const pigcolor = require('pigcolor');
const Blog = require("../models/blogs");
const { v4: uuidv4 } = require('uuid');


exports.createBlogs = (req, res) => {
    pigcolor.box("CREATE: Blog");
    console.log('blog - ', req.body);
    const newBlog = new Blog();
    newBlog.blogsId = uuidv4();
    newBlog.blogTitle = req.body.blogTitle;
    newBlog.blogSubTitle = req.body.blogSubTitle;
    newBlog.blogSubSections = req.body.subContentArray;
    newBlog.blogDescription = req.body.blogDescription;
    newBlog.blogImages = req.body.blogImages;
    newBlog.save().then((blog, err) => {
        console.log('blog - ', blog);
        if (err) {
            return res.json({
                error: err
            })
        }
        return res.json({
            blogs: blog
        })

    }).catch((err) => {
        console.log(err);
        return res.json({
            error: err
        })
    });

}

exports.getAllBlogs = (req, res) => {
    pigcolor.box("GET: All Blogs");
    Blog.find({}).then((blog, err) => {
        if (err) {
            return res.json({
                error: err
            })
        }
        return res.json({
            blog: blog
        })
    }).catch((err) => {
        return res.json({
            error: err
        })
    });
}

exports.getABlog = (req, res) => {
    pigcolor.box("GET A: Blog");
    console.log("Blog ID - ", req.pramas);
    Blog.findById({ _id: req.params.bId })
        .then((blog, err) => {
            if (err) {
                return res.json({
                    error: err
                })
            }
            return res.json({
                blog: blog
            })
        }).catch((err) => {
            return res.json({
                error: err
            })
        })
}