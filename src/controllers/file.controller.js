const express = require('express');
const File = require('../services/crud/file');
const Directory = require('../models/directory');
const router = express.Router();
const upload = require("../services/multer");
const { getGfsInstance } = require('../services/db');


//Create a new file
router.post('/create', upload.single("file"), async function (req, res) {
    try {
        const uplodedData = req.file;
        const { id: fileId, filename, contentType } = uplodedData;
        let { directoryId } = req.body;
        const dupFile = await File.find({ fileName: filename, directoryId: directoryId });
        if (dupFile.length != 0) {
            req.session["error"] = { [directoryId]: true };
            console.log("File already exists");
            res.redirect("/common/list/" + directoryId);
        } else {
            const result = await File.insert([{ contentType, fileId, fileName: filename, directoryId }]);
            res.redirect("/common/list/" + directoryId);
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

//Renaming a file
router.post('/rename', async function (req, res) {
    try {
        let { fileId, newFileName } = req.body;
        const result = await File.findByIdAndUpdate(fileId,
            { $set: { fileName: newFileName } });
        const gfsResult = await File.renameFileGfs(result.fileId, newFileName);
        res.send({ result, gfsResult });
    } catch (error) {
        res.status(400).send(error);
    }
});

//Deleting the file
router.post('/delete', async function (req, res) {
    try {
        let { fileId } = req.body;
        const file = await File.findById(fileId);
        const result = await File.deleteFile({ _id: fileId });
        const gfsResult = await File.deleteFileFromGfs(file.fileId);
        res.send({ result, gfsResult });
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

// fetching all the files
router.get('/list', async function (req, res) {
    try {
        const result = await File.find();
        res.send(result);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Opening a Specific File in the next Page
router.get('/preview/:fileName', (req, res) => {
    const gfs = getGfsInstance();
    const file = gfs
        .find({
            filename: req.params.fileName
        })
        .toArray((err, files) => {
            if (!files || files.length === 0) {
                return res.status(404).json({
                    err: "no files exist"
                });
            }
            gfs.openDownloadStreamByName(req.params.fileName).pipe(res);
        });
})

router.get('/:fileId', async (req, res) => {
    try {
        const result = await File.findById(req.params.fileId);
        res.render('pages/preview', { contentType: result.contentType, fileName: result.fileName });
    } catch (error) {

    }
})



module.exports = router;
