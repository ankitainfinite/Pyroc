const { Types } = require('mongoose');

const File = require('../../models/files');
const { getGfsInstance } = require('../db');

async function insert(fileObjects) {
    return await File.insertMany(fileObjects);
}

async function find(query = {}) {
    return await File.find(query);
}

async function findByIdAndUpdate(id, updateObj) {
    return await File.findByIdAndUpdate(id, updateObj);
}

async function findById(id) {
    return await File.findById(id);
}

async function update(query, updateObj) {
    return await File.updateMany(query, updateObj);
}

async function deleteFile(query) {
    return await File.deleteMany(query);
}

function deleteFileFromGfs(id) {
    return new Promise((resolve, reject) => {
        const gfs = getGfsInstance();
        gfs.delete(new Types.ObjectId(id), (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function renameFileGfs(id, newName) {
    return new Promise((resolve, reject) => {
        const gfs = getGfsInstance();
        gfs.rename(new Types.ObjectId(id), newName, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

module.exports = {
    insert,
    find,
    findByIdAndUpdate,
    findById,
    update,
    deleteFile,
    renameFileGfs,
    deleteFileFromGfs
};
