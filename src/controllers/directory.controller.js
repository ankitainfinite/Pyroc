var express = require('express');
const Directory = require('../models/directory');
const File = require('../models/files');
const { getDbInstance } = require('../services/db');
var router = express.Router();

router.post('/create', async function (req, res, next) {
    try {
        let { directoryName, parentId } = req.body;
        if (!parentId) {
            parentId = "root";
        }
        const dupDirectory = await Directory.findOne({ directoryName: directoryName, parentId: parentId });
        if (dupDirectory) {
            console.log("Directory already exists");
            req.session["error"] = { [parentId]: true };
            res.redirect(req.headers.referer);
        } else {
            const newDirectory = new Directory({ directoryName, parentId, childElements: [] });
            const result = await newDirectory.save();
            res.redirect(req.headers.referer);
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/rename', async function (req, res) {
    try {
        let { dirId, newDirName } = req.body;
        const result = await Directory.findByIdAndUpdate(dirId,
            { $set: { directoryName: newDirName } });
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});
//getting all the directories
router.get('/list', async function (req, res) {
    try {
        const result = await Directory.find({});
        res.send(result);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/delete', async function (req, res) {
    try {
        const dbCon = getDbInstance();
        let { dirId } = req.body;
        const dir = await Directory.deleteOne({ _id: dirId });
        const dirResult = await Directory.find({ parentId: dirId });
        let delDelQuery = [];
        for (const dir of dirResult) {
            delDelQuery.push({ _id: dir._id });
        }
        if (dirResult.length > 0) {
            const r = await Directory.deleteMany({ $or: delDelQuery });
            console.log(r.n, r.deletedCount);
        }
        const files = await File.find({ directoryId: dirId });
        let delFileQuery = [];
        let delChunkQuery = [];
        let delFileCollQuery = [];
        for (const file of files) {
            delFileQuery.push({ _id: file.fileId });
            delFileCollQuery.push({ _id: file._id });
            delChunkQuery.push({ files_id: file.fileId });
        }
        if (delFileQuery.length > 0) {
            const delFileColl = await File.deleteMany({ $or: delFileCollQuery });
            const delfiles = await dbCon.connection.db.collection("uploads.files").deleteMany({ $or: delFileQuery });
            const delChunks = await dbCon.connection.db.collection("uploads.chunks").deleteMany({ $or: delChunkQuery });
            console.log(delFileColl.deletedCount, delFileColl.n, delfiles.n, delfiles.deletedCount, delChunks.n, delChunks.deletedCount);
        }
        res.send({ dir });
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

module.exports = router;
