const express = require("express");
const { google } = require("googleapis");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

// Login route
router.get("/google", (req, res) => {

    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/gmail.readonly"
        ]
    });

    res.redirect(url);

});


// Callback route
router.get("/google/callback", async (req, res) => {

    try {

        const code = req.query.code;

        const { tokens } =
            await oauth2Client.getToken(code);

        oauth2Client.setCredentials(tokens);

        const gmail = google.gmail({
            version: "v1",
            auth: oauth2Client
        });

        const profile = await gmail.users.getProfile({
            userId: "me"
        });

        const email = profile.data.emailAddress;

        let user = await User.findOne({
            email
        });

        if (!user) {

            user = await User.create({

                email,

                refreshToken:
                    tokens.refresh_token,

                lastSyncTime: 0

            });

        } else {

            if (tokens.refresh_token) {

                user.refreshToken =
                    tokens.refresh_token;

                await user.save();

            }

        }

        const token = jwt.sign(

            {
                id: user._id,
                email: user.email
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "30d"
            }

        );

        res.send(`

        <script>

            window.opener.postMessage(

                {

                    type: "AUTH_SUCCESS",

                    token: "${token}",

                    user: {

                        email: "${user.email}"

                    }

                },

                "*"

            );

            window.close();

        </script>

        `);

    }

    catch (err) {

        console.log(err);

        res.send("Authentication Failed");

    }

});

module.exports = router;