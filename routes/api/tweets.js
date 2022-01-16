import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import Tweet from "../../models/Tweet.js"
import validateTweetInput from "../../validation/tweets.js"

const tweetsRouter = express.Router();

tweetsRouter.get('/', (req, res) => {
    Tweet.find()
        .sort({ date: -1 })
        .then(tweets => res.json(tweets))
        .catch(err => res.status(404).json({ notweetsfound: 'No tweets found'}))
})

tweetsRouter.get('/user/:user_id', (req, res) => {
    Tweet.find({user: req.params.user_id})
        .then(tweets => res.json(tweets))
        .catch(err => 
            res.status(404).json({ notweetsfound: 'No tweets found from that user'}))
})

tweetsRouter.get('/:id', (req, res) => {
    Tweet.findById(req.params.id)
        .then(tweet => res.json(tweet))
        .catch(err =>
            res.status(404).json({notweetsfound: 'No tweet found with that ID'}))
})

tweetsRouter.post('/', passport.authenticate('jwt', { session: false}),
    (req, res) => {
        const { errors, isValid } = validateTweetInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }

        const newTweet = new Tweet({
            text: req.body.text,
            user: req.user.id
        })

        newTweet.save().then(tweet => res.json(tweet));
    }
)

export default tweetsRouter;