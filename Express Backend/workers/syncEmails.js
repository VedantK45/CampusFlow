const cron = require("node-cron");

const User = require("../models/User");
const Email = require("../models/Email");

const {
    fetchNewEmails
} = require("../services/gmailService");

const {
    generatePDF
} = require("../services/pdfService");

const {
    uploadPDF
} = require("../services/s3Service");

const {
    publishEmail
} = require("../services/redisPublisher");


cron.schedule(`*/${process.env.SYNC_MIN} * * * *`, async () => {

    console.log("Running Email Sync...");

    try {

        const users = await User.find();

        for (const user of users) {

            console.log(`Syncing ${user.email}`);

            const emails =
                await fetchNewEmails(user);

            for (const email of emails) {

                try {

                    // Duplicate check
                    const exists =
                        await Email.findOne({
                            gmailId: email.gmailId
                        });

                    if (exists) {

                        console.log(
                            `${email.gmailId} already exists`
                        );

                        continue;

                    }

                    // Generate PDF
                    const pdfPath =
                        await generatePDF(
                            email,
                            user
                        );

                    // Upload PDF to S3
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

                        userId:
                            user._id,

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

                }

                catch (err) {

                    console.log(
                        "Email Error:",
                        err.message
                    );

                }

            }

        }

    }

    catch (err) {

        console.log(
            "Sync Error:",
            err.message
        );

    }

});