const pigcolor = require('pigcolor');
const User = require('../models/users');
const Order = require('../models/orders');
const View = require('../models/views');


exports.getAllDashboardDetails = async (req, res) => {
    try {
        console.log("Get: Dashboard Details");

        const [userTotal, orderTotal, orders, views] = await Promise.all([
            User.countDocuments({}),
            Order.countDocuments({}),
            Order.aggregate([
                {
                    $group: {
                        _id: null,
                        totalOrderValue: { $sum: { $toDouble: "$orderTotal" } },
                        totalOrderProducts: { $sum: "$orderProduct.0.qty" }
                    }
                }
            ]),
            View.find({})
        ]);

        const totalUsersCount = userTotal || 0;
        const totalOrderCount = orderTotal || 0;
        const totalOrderValue = orders.length > 0 ? orders[0].totalOrderValue : 0;
        const totalOrderProducts = orders.length > 0 ? orders[0].totalOrderProducts : 0;

        console.log("Total Users  - ", totalUsersCount);
        console.log("Total Orders - ", totalOrderCount);
        console.log("Total Order Value - ", totalOrderValue);
        console.log("Total Order Products - ", totalOrderProducts);
        console.log("Total Ecommerce Views - ", views);

        return res.json({
            totalUsersCount,
            totalOrderCount,
            totalOrderValue,
            totalOrderProducts,
            views
        });
    } catch (error) {
        console.error("Error - ", error);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
};



exports.viewStatusMake = (req, res) => {
    console.log("View Stats - ", req.body);
    View.find({}).then((stats, err) => {
        if (err) {
            return res.json({
                error: err
            })
        }
        console.log("Views - ", stats);
        console.log("Views Count - ", stats[0]);
        stats[0].totalWebsiteViews = stats[0].totalWebsiteViews + 1;
        stats[0].totalProductViews = stats[0].totalProductViews + 1;
        stats[0].save().then((newStats, err) => {
            console.log("Stats Controls - ", err, newStats);
            if (err) {
                return res.json({
                    error: err
                })
            }
            return res.json({
                newStats
            })
        }).catch((err) => {
            console.log(err);

            return res.json({
                errorNewSave: err
            })
        })
    }).catch((err) => {
        console.log(err);

        return res.json({
            errorOut: err
        })
    });
}


exports.viewStatusMakeProduct = (req, res) => {
    console.log("View Stats - ", req.body);
    View.find({}).then((stats, err) => {
        if (err) {
            return res.json({
                error: err
            })
        }
        console.log("Views - ", stats);
        console.log("Views Count - ", stats[0]);
        stats[0].totalProductViews = stats[0].totalProductViews + 1;
        stats[0].save().then((newStats, err) => {
            console.log("Stats Controls - ", err, newStats);
            if (err) {
                return res.json({
                    error: err
                })
            }
            return res.json({
                newStats
            })
        }).catch((err) => {
            console.log(err);

            return res.json({
                errorNewSave: err
            })
        })
    }).catch((err) => {
        console.log(err);

        return res.json({
            errorOut: err
        })
    });
}