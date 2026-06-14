const fs = require("fs");

const {
    S3Client,
    PutObjectCommand
} = require("@aws-sdk/client-s3");

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});


async function uploadPDF(pdfPath, userEmail, gmailId) {

    const key = `${userEmail}/${gmailId}.pdf`;

    // console.log("AWS_BUCKET_NAME =", process.env.AWS_BUCKET_NAME);
    // console.log("AWS_REGION =", process.env.AWS_REGION);
    // console.log("AWS_ACCESS_KEY_ID =", process.env.AWS_ACCESS_KEY_ID);

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: fs.createReadStream(pdfPath),
        ContentType: "application/pdf"
    });

    await s3.send(command);

    return {
        key,
        url:
            `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    };

}

module.exports = {
    uploadPDF
};