const express = require('express');
const { createProduct, editProduct, deleteProduct, getAllProducts, getAProduct, getProductsByCategory, getProductsByPrice, getProductsByIngredient } = require('../controllers/product');
const router = express.Router();

// Manage Product
router.post("/create/product", createProduct);
router.put("/edit/product", editProduct);
router.delete("/delete/product", deleteProduct);

// Get Products
router.get("/get/all/products", getAllProducts);
router.get("/get/a/product/:prodId", getAProduct);
router.get("/get/all/products/category/:cateId", getProductsByCategory);
router.get("/get/all/products/by/price", getProductsByPrice);
router.get("/get/all/products/by/ingredient", getProductsByIngredient);




module.exports = router;