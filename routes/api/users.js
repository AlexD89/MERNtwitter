import express from "express";
import bcrypt from "bcryptjs";
import { User } from "../../models/User.js";
import keys from "../../config/keys.js"
import jwt from 'jsonwebtoken'
import passport from "passport";
import validateRegisterInput from "../../validation/register.js";
import validateLoginInput from "../../validation/login.js";

const usersRouter = express.Router();

// usersRouter.get("/test", (req, res) => res.json({ msg: "This is the users route" }));

// Registe Route

usersRouter.post("/register", (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
        .then(user => {
            if  (user) {
                errors.email = 'Email already exists';
                return res.status(400).json(errors)
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
                            .then(user => {
                                const payload = { id: user.id, handle: user.handle };

                                jwt.sign(
                                    payload,
                                    keys.secretOrKey,
                                    { expiresIn: 3600 },
                                    (err, token) => {
                                        res.json({
                                            success: true,
                                            token: 'Bearer ' + token
                                        })
                                    }
                                )
                            })
                            .catch(err => console.log(err))
                    })
                })
            }
        })
})


// Login route

usersRouter.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
        .then(user => {
            if(!user) {
                errors.email = 'User not found';
                return res.status(404).json(errors)
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
                        errors.password = 'Incorrect password'
                        return res.status(400).json(errors)
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