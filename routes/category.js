const express = require("express");
const { createCategory, updateCategory, deleteCategory, getAllCategory, getACategories } = require("../controllers/category");
const route = express.Router();


// ** Control Category
route.post("/create/category", createCategory);

// edit category
// -> PUT
// -> POST
route.put("/edit/category", updateCategory);
route.post("/edit/category", updateCategory);



route.delete("/delete/category", deleteCategory);

// ** Category
route.get("/get/all/categories", getAllCategory);
route.get("/get/a/categories/:cateId", getACategories);

module.exports = route;