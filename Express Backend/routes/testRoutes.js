const express = require("express");
const User = require("../models/User");
const { fetchNewEmails } = require("../services/gmailService");
const { generatePDF } = require("../services/pdfService");
const Email = require("../models/Email");
const { uploadPDF } = require("../services/s3Service");
const { publishEmail } = require("../services/redisPublisher");

const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

router.get("/sync/:email", authMiddleware, async (req, res) => {

    try {
        // console.log(req.user);
        /*
            {
              id: '6a2e7b77aa34216ecf145f1e',
              email: 'kallolk.ic.23@nitj.ac.in',
              iat: 1781431159,
              exp: 1784023159
            }
        */

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

            console.log(
                `${email.subject} uploaded to S3`
            );

            // save metadata
            const savedEmail = await Email.create({

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

            console.log(
                `${email.subject} saved`
            );

            // publish to redis
            await publishEmail({

                emailId:
                    savedEmail._id,

                userId:
                    user._id,

                gmailId:
                    email.gmailId,

                subject:
                    email.subject,

                from:
                    email.from,

                to:
                    email.to,

                body:
                    email.body,

                html:
                    email.html,

                date:
                    email.date,

                pdfUrl:
                    uploaded.url,

            });

            console.log(
                `${email.subject} published`
            );

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