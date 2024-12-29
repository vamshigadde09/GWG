const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

//dotenv config
dotenv.config();

//mongodb connection
connectDB();

//rest object
const app = express();

//middlewares
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" })); // Updated payload limit
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from frontend
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

//routes
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/interview", require("./routes/interviewRequestRoutes"));
app.use("/api/v1/teacher", require("./routes/teacherRequestRoutes")); // Added teacher routes

//port
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(
    `Server Running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`
      .bgCyan.white
  );
});
