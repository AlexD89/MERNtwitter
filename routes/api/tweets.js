import express from "express";

const tweetsRouter = express.Router();

tweetsRouter.get("/test", (req, res) => res.json({ msg: "This is the tweets route" }));

export default tweetsRouter;