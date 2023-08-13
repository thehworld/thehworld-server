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



            }).catch((err) => {

            });
        }).catch((err) => {

        });


    }).catch((err) => {
        console.log("Error - ", err);
    });






}


exports.viewStatusMake = (req, res) => {
    const newView = new View();
    newView.totalWebsiteViews = 0;
    newView.totalProductViews = 0;
    newView.save((view, error) => {
        if (error) {
            return res.json({
                error: error
            })
        }
        console.log("View - ", view);
    });
}