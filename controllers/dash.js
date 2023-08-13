const pigcolor = require('pigcolor');
const User = require('../models/users');
const Order = require('../models/orders');
const View = require('../models/views');

exports.getAllDashboardDetails = (req, res) => {
    pigcolor.box("Get: Dashboard Details");
    let totalUsersCount = 0;
    let totalOrderCount = 0;
    let totalOrderValue = 0;
    let totalOrderProducts = 0;
    let websiteViews = 0;
    let websiteProductViews = 0;

    User.count({}).then((userTotal, err) => {
        if (err) {
            return res.status.json({
                error: err
            })
        }
        totalUsersCount = userTotal;
        Order.count({}).then((orderTotal, err) => {
            if (err) {
                return res.status.json({
                    error: err
                })
            }
            totalOrderCount = orderTotal;
            Order.find({}).then((orders, err) => {
                if (err) {
                    return res.status.json({
                        error: err
                    })
                }
                orders.map((or, index) => {
                    totalOrderValue = totalOrderValue + Number(or.orderTotal);
                    totalOrderProducts = totalOrderProducts + or.orderProduct[0].qty;

                });
                console.log("Total Users  - ", totalUsersCount);
                console.log("Total Orders - ", totalOrderCount);
                console.log("Total Order Value - ", totalOrderValue);
                console.log("Total Order Products - ", totalOrderProducts);
                return res.json({
                    totalUsersCount,
                    totalOrderCount,
                    totalOrderValue,
                    totalOrderProducts
                })


            }).catch((err) => {

            });
        }).catch((err) => {

        });


    }).catch((err) => {
        console.log("Error - ", err);
    });






}


exports.viewStatusMake = (req, res) => {
    console.log("View Stats - ", req.body);
    View.find({}).then((stats, err) => {
        if (err) {
            return res.json({
                error: err
            })
        }
        console.log("Views - ", stats);
        stats[0].totalWebsiteViews = stats[0].totalWebsiteViews + 1;
        stats[0].totalProductViews = stats[0].totalProductViews + 1;
        stats.save().then((newStats, err) => {
            if (err) {
                return res.json({
                    error: err
                })
            }
            return res.json({
                newStats
            })
        }).catch((err) => {
            return res.json({
                error: err
            })
        })
    }).catch((err) => {
        return res.json({
            error: err
        })
    });
}