require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

require("./workers/syncEmails");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes")


const app = express();
app.use(cors());

app.use(express.json());

connectDB();

app.use("/test", testRoutes);
app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});
