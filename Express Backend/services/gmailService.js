const { google } = require("googleapis");
const { htmlToText } = require("html-to-text");
const Email = require("../models/Email");

function createGmailClient(user) {

    const oauth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
    );

    oauth2Client.setCredentials({
        refresh_token: user.refreshToken
    });

    return google.gmail({
        version: "v1",
        auth: oauth2Client
    });

}

function extractHtml(payload) {

    if (
        payload.mimeType === "text/html" &&
        payload.body &&
        payload.body.data
    ) {

        return Buffer
            .from(payload.body.data, "base64")
            .toString("utf8");

    }

    if (payload.parts) {

        for (const part of payload.parts) {

            const html = extractHtml(part);

            if (html) {
                return html;
            }

        }

    }

    return "";

}

function extractText(payload) {

    const html = extractHtml(payload);

    if (!html) {
        return "";
    }

    return htmlToText(html, {
        wordwrap: false
    });

}

async function fetchNewEmails(user) {

    const gmail = createGmailClient(user);

    const response = await gmail.users.messages.list({
        userId: "me",
        maxResults: 10
    });

    const messages = response.data.messages || [];

    const emails = [];

    for (const msg of messages) {

        const exists = await Email.findOne({
            gmailId: msg.id
        });

        if (exists) continue;

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

        emails.push({
            gmailId: msg.id,
            threadId: email.data.threadId,
            from,
            to,
            subject,
            date,
            html: extractHtml(email.data.payload),
            body: extractText(email.data.payload)
        });

    }

    return emails;

}

module.exports = {
    fetchNewEmails
};