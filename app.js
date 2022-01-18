import express from "express";
import mongoose from "mongoose";
import db from "./config/keys.js";
import tweetsRouter from "./routes/api/tweets.js"
import usersRouter from "./routes/api/users.js";
import bodyParser from "body-parser";
import passport from "passport";
import myFunc from "./config/passport.js"

const app = express();
mongoose
    .connect(db.mongoURI, { useNewUrlParser: true})
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch(err => console.log(err));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(passport.initialize());
myFunc(passport);
const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Server is running on port ${port}`))
app.get("/", (req, res) => {
    res.send("Hello+World")});
app.use("/api/users", usersRouter);
app.use("/api/tweets", tweetsRouter);
