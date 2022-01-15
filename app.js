import express from "express";
import mongoose from "mongoose";
import { mongoURI } from "./config/keys.js";
import tweetsRouter from "./routes/api/tweets.js"
import usersRouter from "./routes/api/users.js";
import bodyParser from "body-parser";

const app = express();
const db = mongoURI;
mongoose
    .connect(db, { useNewUrlParser: true})
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch(err => console.log(err));
app.get("/", (req, res) => res.send("Hello+World"));
app.use("/api/users", usersRouter);
app.use("/api/tweets", tweetsRouter);
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server is running on port ${port}`))
