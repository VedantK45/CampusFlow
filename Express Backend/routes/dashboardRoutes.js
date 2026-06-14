const express = require("express");
const User = require("../models/User");
const Email = require("../models/Email");
const mongoose = require("mongoose");

const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
    try {

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        const emailsByDay = await Email.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(req.user.id),
                    createdAt: {
                        $gte: startDate
                    }
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    count: {
                        $sum: 1
                    },
                    emails: {
                        $push: {
                            _id: "$_id",
                            from: "$from",
                            subject: "$subject",
                            pdfUrl: "$pdfUrl",
                            createdAt: "$createdAt"
                        }
                    }
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]);

        const today = new Date();

        const result = emailsByDay.map(day => {

            const date = new Date(day._id);

            const diffDays = Math.floor(
                (today - date) / (1000 * 60 * 60 * 24)
            );

            let label;

            if (diffDays === 0)
                label = "Today";
            else if (diffDays === 1)
                label = "Yesterday";
            else
                label = day._id;

            return {
                day: day._id,
                label,
                count: day.count,
                emails: day.emails
            };
        });

        const totalEmails = result.reduce(
            (sum, day) => sum + day.count,
            0
        );

        res.json({
            totalEmails,
            totalDays: result.length,
            data: result
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message
        });

    }
});

module.exports = router;