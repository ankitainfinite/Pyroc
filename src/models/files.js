const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const fileSchema = new Schema({
    fileId: Schema.Types.ObjectId,
    fileName: String,
    createdDate: {
        type: Date,
        default: new Date()
    },
    directoryId: String | Schema.Types.ObjectId,
    contentType: String
});

const file = mongoose.model('file', fileSchema, 'file')

module.exports = file;