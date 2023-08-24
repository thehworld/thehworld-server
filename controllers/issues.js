const pigcolor = require('pigcolor');


exports.issueProblem = (req, res) => {
    pigcolor.box("Problem: Issue");
    console.log("Problem - ", req.body);
}