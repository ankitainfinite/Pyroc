var express = require('express');
const Directory = require('../models/directory');
const File = require('../models/files');
var router = express.Router();

router.get('/list/:directoryId', async function (req, res) {
    try {
        // get all files inside a directory.
        const id = req.params.directoryId;
        const allDirectories = await Directory.find({ parentId: id });
        const dirPathName = await Directory.find({ _id: id });
        let dupError = req.session && req.session["error"] ? req.session["error"][id] : false;
        if (dupError) {
            delete req.session["error"][id];
        }
        const allFiles = await File.find({ directoryId: id });
        res.render("pages/files", { title: "Files", id, ...{ directories: allDirectories, files: allFiles, dirPathName: dirPathName }, dupFile: dupError })

    } catch (error) {
        res.status(400).send(error);
    }
});



module.exports = router;
