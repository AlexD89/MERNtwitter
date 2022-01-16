import express from "express";
import bcrypt from "bcryptjs";
import { User } from "../../models/User.js";
import keys from "../../config/keys.js"
import jwt from 'jsonwebtoken'
import passport from "passport";

const usersRouter = express.Router();

usersRouter.get("/test", (req, res) => res.json({ msg: "This is the users route" }));
usersRouter.post("/register", (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if  (user) {
                return res.status(400).json({email: "A user has already with this address"})
            } else {
                const newUser = new User({
                    handle: req.body.handle,
                    email: req.body.email,
                    password: req.body.password
                })

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    })
                })
            }
        })
})
usersRouter.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
        .then(user => {
            if(!user) {
                return res.status(404).json({email: "This user doesnt exist"})
            }

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const payload = {id: user.id, handle: user.handle};

                        jwt.sign(
                            payload,
                            keys.secretOrKey,
                            {expiresIn: 3600},
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                })
                            }
                        )
                    } else {
                        return res.status(400).json({password: 'Incorrect password'})
                    }
                })
        })
})


// Private Auth Route

usersRouter.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({
        id: req.user.id,
        handle: req.user.handle,
        email: req.user.email
    });
})

export default usersRouter;