import express from "express";
import ConnectDB from './Config/db.js';
import bodyParser from 'body-parser';
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/PostRoute.js";
import cookieParser from "cookie-parser";

const app = express();

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;
ConnectDB();
app.use(cookieParser());

// Routes
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
