const express = require("express");
const User = require("../models/User");
const { fetchNewEmails } = require("../services/gmailService");
const { generatePDF } = require("../services/pdfService");
const Email = require("../models/Email");
const { uploadPDF } = require("../services/s3Service");

const router = express.Router();

router.get("/sync/:email", async (req, res) => {

    try {

        const user = await User.findOne({
            email: req.params.email
        });

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        const emails = await fetchNewEmails(user);

        const results = [];

        for (const email of emails) {

            // create pdf
            const pdfPath =
                await generatePDF(
                    email,
                    user
                );


            // upload to s3
            const uploaded =
                await uploadPDF(
                    pdfPath,
                    user.email,
                    email.gmailId
                );

            // save metadata
            await Email.create({

                userId: user._id,

                gmailId:
                    email.gmailId,

                threadId:
                    email.threadId,

                from:
                    email.from,

                to:
                    email.to,

                subject:
                    email.subject,

                body:
                    email.body,

                html:
                    email.html,

                date:
                    email.date,

                pdfUrl:
                    uploaded.url,

                s3Key:
                    uploaded.key

            });

            results.push({

                gmailId:
                    email.gmailId,

                subject:
                    email.subject,

                pdfUrl:
                    uploaded.url

            });

        }

        res.json(results);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

module.exports = router;