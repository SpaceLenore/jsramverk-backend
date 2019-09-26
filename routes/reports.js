const express       = require('express');
const dbHandler     = require('../db/handler');
const authenticator = require('../src/authenticator');
const router        = express.Router();


router.get('/week/:id', async (req, res, next) => {
    try {
        let data = await dbHandler.fetchOne("SELECT * FROM reports WHERE week = ?", [req.params.id]);
        if (data == undefined) {
            throw("404: Not found")
        }
        res.status(200).json({
            status: 'success',
            code: 200,
            msg: 'Report for week ' + req.params.id,
            data: data
        });
    } catch (e) {
        res.status(404).json({status: "error", code: 404, msg: "Report not found"})
    }
});


// Require authentication via JWT
router.use(async (req, res, next) => {
    if (req.headers.authorization) {
        console.log("is auth'd?", await authenticator.validateToken(req.headers.authorization));
        if (await authenticator.validateToken(req.headers.authorization)) {
            next();
            return true;
        }
    }
    res.status(401).json({
        status: 'error',
        code: 401,
        msg: 'To add a new post you need to be logged in and send your JWT in the Authorization header'
    });
});

router.post('/', async (req, res, next) => {
    let post = req.body;

    if (!post.week || !post.title || !post.report) {
        res.status(400).json({
            status: 'error',
            code: 400,
            msg: 'You need to send week, title, and report'
        });
        return false;
    }

    try {
        await dbHandler.exec("INSERT INTO reports (week, title, report) VALUES (?, ?, ?);", [post.week, post.title, post.report]);
        res.status(201).json({
            status: 'success',
            code: 201,
            msg: 'Report has been added'
        });
    } catch (e) {
        res.status(500).json({
            status: 'error',
            code: 500,
            msg: 'Failed to add report to system'
        });
    }
});

router.put('/', async (req, res, next) => {
    let post = req.body;

    if (!post.week || !post.title || !post.report) {
        res.status(400).json({
            status: 'error',
            code: 400,
            msg: 'You need to send week, title, and report'
        });
        return false;
    }

    try {
        await dbHandler.exec("UPDATE reports SET title=?, report=? WHERE week = ?;", [post.title, post.report, post.week]);
        res.status(201).json({
            status: 'success',
            code: 201,
            msg: 'Report has been updated'
        });
    } catch (e) {
        res.status(500).json({
            status: 'error',
            code: 500,
            msg: 'Failed to update report in the system'
        });
    }
});

module.exports = router;
