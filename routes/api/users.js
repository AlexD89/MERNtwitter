import express from "express";

const usersRouter = express.Router();

usersRouter.get("/test", (req, res) => res.json({ msg: "This is the users route" }));

export default usersRouter;