const Pig = require('pigcolor');
const Category = require('../models/category');



// Get Category
exports.getAllCategory = (req, res) => {
    res.header("Access-Control-Allow-Origin", "https://rococo-banoffee-61f602.netlify.app");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    Pig.box("GET ALL: Category");
    Category.find({})
        .then((allCategory, err) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            if (!allCategory) {
                return res.json({
                    msg: "Category couldn't be created"
                })
            }
            return res.json({
                category: allCategory
            })
        })
        .catch((err) => {
            console.log("Error - ", err);
        });
}

exports.getACategories = (req, res) => {
    Pig.box("GET A: Category");
    const cateId = req.params.cateId;
    Category.findOne({ _id: cateId })
        .then((aCategory, err) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            if (!aCategory) {
                return res.json({
                    msg: "Category couldn't be created"
                })
            }
            return res.json({
                aCategory: aCategory
            })
        })
        .catch((err) => {
            console.log("Error - ", err);
        });;
}



// Manage Category
exports.createCategory = (req, res) => {
    Pig.box("CREATE: Category");
    const name = req.body.name;
    const description = req.body.description;

    const newCategory = new Category();
    newCategory.categoryName = name;
    newCategory.categoryDescription = description;
    newCategory.save()
        .then((cate, err) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            if (!cate) {
                return res.json({
                    msg: "Category couldn't be created"
                })
            }
            return res.json({
                category: cate
            })
        })
        .catch((err) => {
            console.log("Error - ", err);
        })

}

exports.updateCategory = (req, res) => {
    Pig.box("UPDATE: Category");
    const cateId = req.body.cateId;
    Category.findByIdAndUpdate({ _id: cateId }, {
            categoryName: req.body.name,
            categoryDescription: req.body.description
        }, {
            new: true
        })
        .then((cate, err) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            if (!cate) {
                return res.json({
                    msg: "Category couldn't be created"
                })
            }

            return res.json({
                category: cate
            })
        })
        .catch((err) => {
            console.log("Error: ", err);
        });

}

exports.deleteCategory = (req, res) => {
    Pig.box("DELETE: Category");
    const cateId = req.body.cateId;
    Category.findByIdAndDelete({ _id: cateId })
        .then((cate, err) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            if (!cate) {
                return res.json({
                    msg: "Category couldn't be deleted"
                })
            }
            return res.json({
                category: cate
            })
        })
        .catch((err) => {
            console.log("Error: ", err);
        })
}