const pigcolor = require('pigcolor');
const Issue = require('../models/issues');

exports.issueProblem = (req, res) => {
    pigcolor.box("Problem: Issue");
    console.log("Problem - ", req.body);
    const newIssue = new Issue();
    newIssue.order = req.body.order;
    newIssue.status = "NEW";
    newIssue.save()
        .then((problm, err) => {
            if (err) {
                return res.json({
                    error: err
                })
            }
            return res.json({
                problm: problm
            })
        }).catch((err) => {
            return res.json({
                error: err
            })
        });
}