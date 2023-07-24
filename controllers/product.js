const Pig = require('pigcolor');
const Product = require('../models/product');
const { v4: uuidv4 } = require('uuid');


exports.getAllProducts = (req, res) => {
    Pig.box("GET ALL: Products");
    Product.find({}).then((prod, err) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            if (!prod) {
                return res.json({
                    msg: "Product couldn't be featched"
                })
            }
            return res.json({
                products: prod
            })
        })
        .catch((err) => {
            console.log("Error - ", err);
        });
}

exports.getAProduct = (req, res) => {
    Pig.box("GET A: Product");
    Product.findOne({ _id: req.params.prodId }).then((prod, err) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            if (!prod) {
                return res.json({
                    msg: "A Product couldn't be featched"
                })
            }
            return res.json({
                product: prod
            })
        })
        .catch((err) => {
            console.log("Error - ", err);
        });;
}

exports.getProductsByCategory = (req, res) => {
    Pig.box("GET A: Product By Category");
    const cateId = req.params.cateId;
    Product.find({ productCategory: cateId }).then((prod, err) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            if (!prod) {
                return res.json({
                    msg: "Product couldn't be featched"
                })
            }
            return res.json({
                product: prod
            })
        })
        .catch((err) => {
            console.log("Error - ", err);
        });;
}

exports.getProductsByPrice = (req, res) => {
    Pig.box("GET ALL: Product by Price");
    console.log("Price - ", req.query);
    Product.find({ productDiscountPrice: { $gte: req.query.priceMin, $lte: req.query.priceMax } }).then((prod, err) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            if (!prod) {
                return res.json({
                    msg: "Product couldn't be featched"
                })
            }
            return res.json({
                product: prod
            })
        })
        .catch((err) => {
            console.log("Error - ", err);
        });;;
}

exports.getProductsByIngredient = (req, res) => {
    Pig.box("GET ALL: Product By Ingredients");
}

exports.createProduct = (req, res) => {
    Pig.box("CREATE: Product");

    const newProduct = new Product();


    console.log(req.body);


    newProduct.productId = uuidv4();
    newProduct.productName = req.body.productName;
    newProduct.productCategory = req.body.productCategory;
    newProduct.productPrice = req.body.productPrice;
    newProduct.productDiscountPrice = req.body.productDiscountPrice;
    newProduct.productDescription = req.body.productDescription;
    newProduct.productIngredient = req.body.productIngredient;
    newProduct.productDetails = req.body.productDetails;
    newProduct.stock = req.body.stock;
    newProduct.productImages = req.body.productImages;
    newProduct.howTo = req.body.howTo;
    newProduct.benifitsSkinType = req.body.benifitsSkinType;
    newProduct.productReview = req.body.productReview;

    newProduct.save()
        .then((prod, err) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            if (!prod) {
                return res.json({
                    msg: "Product couldn't be created"
                })
            }
            return res.json({
                product: prod
            })
        })
        .catch((err) => {
            console.log("Error - ", err);
        })
}

exports.editProduct = (req, res) => {
    Pig.box("EDIT: Product");
    const prodId = req.body.productId;
    Product.findByIdAndUpdate({ _id: prodId }, {
            productId: req.body.productId,
            productName: req.body.productName,
            productCategory: req.body.productCategory,
            productPrice: req.body.productPrice,
            productDiscountPrice: req.body.productDiscountPrice,
            productDescription: req.body.productDescription,
            productIngredient: req.body.productIngredient,
            productDetails: req.body.productDetails,
            stock: req.body.stock,
            productImages: req.body.productImages,
            howTo: req.body.howTo,
            benifitsSkinType: req.body.benifitsSkinType,
            productReview: req.body.productReview
        }, { new: true }).then((prod, err) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            if (!prod) {
                return res.json({
                    msg: "Product couldn't be edited"
                })
            }
            return res.json({
                product: prod
            })
        })
        .catch((err) => {
            console.log("Error - ", err);
        });
}

exports.deleteProduct = (req, res) => {
    Pig.box("DELETE: Product");
    const prodId = req.body.prodId;
    Product.findByIdAndDelete({ _id: prodId }).then((prod, err) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            if (!prod) {
                return res.json({
                    msg: "Product deleted success"
                })
            }

        })
        .catch((err) => {
            console.log("Error - ", err);
        });;
}