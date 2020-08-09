const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const directorySchema = new Schema({
    directoryName: String,
    createdDate: {
        type: Date,
        default: new Date()
    },
    parentId: String | Schema.Types.ObjectId
});

const Directory = mongoose.model('directory', directorySchema, 'directory')

module.exports = Directory;