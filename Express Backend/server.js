require("dotenv").config();
const express = require("express");
const { google } = require("googleapis");
const { htmlToText } = require("html-to-text");
const fs = require("fs");
const puppeteer = require("puppeteer");

const app = express();

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

// Create gmail object globally
const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client
});

// Generate Google login URL
app.get("/auth/google", (req, res) => {

    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
            "https://www.googleapis.com/auth/gmail.readonly"
        ]
    });

    res.redirect(url);
});

// Callback after user grants permission
app.get("/auth/google/callback", async (req, res) => {
    const code = req.query.code;

    try {
        // Exchange code for tokens
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Get latest 10 emails
        const response = await gmail.users.messages.list({
            userId: "me",
            maxResults: 10
        });

        const messages = response.data.messages || [];

        let emailList = [];

        // Recursive function to extract visible text
        function extractBody(payload) {

            // Plain text part
            if (
                payload.mimeType === "text/plain" &&
                payload.body &&
                payload.body.data
            ) {
                return Buffer.from(
                    payload.body.data,
                    "base64"
                ).toString("utf8");
            }

            // HTML part
            if (
                payload.mimeType === "text/html" &&
                payload.body &&
                payload.body.data
            ) {
                const html = Buffer.from(
                    payload.body.data,
                    "base64"
                ).toString("utf8");

                return htmlToText(html, {
                    wordwrap: false
                });
            }

            // Search nested parts
            if (payload.parts) {
                for (const part of payload.parts) {
                    const body = extractBody(part);

                    if (body) {
                        return body;
                    }
                }
            }

            return "";
        }

        if (!fs.existsSync("./emails")) {
            fs.mkdirSync("./emails");
        }

        // Fetch complete email data
        for (const msg of messages) {

            const email = await gmail.users.messages.get({
                userId: "me",
                id: msg.id,
                format: "full"
            });

            const headers = email.data.payload.headers;

            const subject =
                headers.find(
                    h => h.name === "Subject"
                )?.value || "";

            const from =
                headers.find(
                    h => h.name === "From"
                )?.value || "";

            const to =
                headers.find(
                    h => h.name === "To"
                )?.value || "";

            const date =
                headers.find(
                    h => h.name === "Date"
                )?.value || "";

            const body = extractBody(email.data.payload);

            emailList.push({
                id: msg.id,
                threadId: email.data.threadId,
                from,
                to,
                subject,
                date,
                body
            });
        }

        res.json(emailList);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});


app.get("/email/:id/pdf", async (req, res) => {
    try {

        const email = await gmail.users.messages.get({
            userId: "me",
            id: req.params.id,
            format: "full"
        });

        const headers = email.data.payload.headers;

        const subject =
            headers.find(h => h.name === "Subject")?.value || "";

        const from =
            headers.find(h => h.name === "From")?.value || "";

        const to =
            headers.find(h => h.name === "To")?.value || "";

        const date =
            headers.find(h => h.name === "Date")?.value || "";

        function getHtml(payload) {

            if (
                payload.mimeType === "text/html" &&
                payload.body?.data
            ) {
                return Buffer.from(
                    payload.body.data,
                    "base64"
                ).toString("utf8");
            }

            if (payload.parts) {
                for (const part of payload.parts) {
                    const html = getHtml(part);
                    if (html) return html;
                }
            }

            return "";
        }

        const emailHtml = getHtml(email.data.payload);

        const html = `
        <html>
        <body>
            <h2>${subject}</h2>
            <hr>
            <p><b>From:</b> ${from}</p>
            <p><b>To:</b> ${to}</p>
            <p><b>Date:</b> ${date}</p>
            <hr>
            ${emailHtml}
        </body>
        </html>
        `;

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(html, {
            waitUntil: "networkidle0"
        });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true
        });

        await browser.close();

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=email.pdf`
        });

        res.send(pdfBuffer);

    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});

