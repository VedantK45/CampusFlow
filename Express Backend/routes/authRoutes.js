const express = require("express");
const { google } = require("googleapis");
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

        const { tokens } = await oauth2Client.getToken(code);

        console.log(tokens);

        oauth2Client.setCredentials(tokens);

        const gmail = google.gmail({
            version: "v1",
            auth: oauth2Client
        });

        // Get user's Gmail address
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
                refreshToken: tokens.refresh_token,
                lastSyncTime: 0
            });

        } else {

            if (tokens.refresh_token) {

                user.refreshToken = tokens.refresh_token;

                await user.save();

            }

        }

        res.json({
            success: true,
            email,
            refreshTokenSaved: !!tokens.refresh_token
        });

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