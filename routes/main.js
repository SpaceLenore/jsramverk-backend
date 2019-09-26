const express       = require('express');
const bcrypt        = require('bcryptjs');
const jwt           = require('jsonwebtoken');
const dbHandler     = require('../db/handler');
const authenticator = require('../src/authenticator');
const router        = express.Router();
const saltRounds    = 10;

const sendBadRequestError = (message, res) => {
    res.status(400).json({status: "error", code: 400, msg: message});
}

router.get('/', (req, res, next) => {
    const data = {
        data: {
            title: "Introduction",
            text: "Hello, this is me-api"
        }
    };

    res.json(data);
});

router.post('/register', (req, res, next) => {
    let newUser = req.body;

    if (!newUser.name || !newUser.email || !newUser.password || !newUser.gdpr || !newUser.birthday)
    {
        sendBadRequestError("All fields must be filled in", res);
    } else if (!newUser.email.includes('@') || !newUser.email.includes('.') || newUser.email.length <= 5) {
        sendBadRequestError("Email is not valid", res);
    } else if (newUser.password.length < 10) {
        sendBadRequestError("Password must be at least 10 characters", res);
    } else if (
        newUser.birthday.year < 1900 ||
        newUser.birthday.year > new Date().getFullYear() ||
        newUser.birthday.month < 1 ||
        newUser.birthday.month > 12 ||
        newUser.birthday.day < 1 ||
        newUser.birthday.day > 31
    ) {
        sendBadRequestError("Invalid birthday date format", res)
    } else {
        bcrypt.hash(newUser.password, saltRounds, async (err, hash) => {
                if (!err) {
                    try {
                        await dbHandler.exec("INSERT INTO users(name, email, password, birhtday) VALUES (?, ?, ?, DATE(?))",
                        [newUser.name, newUser.email, hash, newUser.year + "-" + newUser.month + "-" + newUser.day]);
                        res.status(200).json({status: "success", code: 200, msg: "New user created"});
                    } catch (e) {
                        res.status(500).json({status: "error", code: 500, msg: "Server failed to create user"});
                    }
                } else {
                    res.status(500).json({status: "error", code: 500, msg: "Server failed to create user"});
                }
        });
    }
});

router.post('/login', async (req, res, next) => {
    let login = req.body;

    if (!login.email || !login.password) {
        sendBadRequestError("All fields must be filled in", res);
    }
    try {
        let user = await dbHandler.fetchOne("SELECT email, password FROM users WHERE email = ?", [login.email]);

        if (user == undefined) {
            throw("No user found")
        }
        let hashComparison = await bcrypt.compare(login.password, user.password);


        if(hashComparison) {
            let authToken = await authenticator.generateToken(login.email);

            res.status(200).json({
                status: "success",
                code:200,
                msg: "logged in, you can find your JWT in the 'token' string",
                token: authToken
            });
        } else {
            throw("Password missmatch");
        }
    } catch (e) {
        res.status(400).json({status: "error", code: 400, msg: "Email or usrname is incorrect"})
    }
});


module.exports = router;
