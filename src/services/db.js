const mongoose = require("mongoose");

let gridFsInstance;
let dbInstance;

function getMongoDbInstances() {
    return new Promise(async (resolve, reject) => {
        const mongoURI = process.env["mongoUri"];
        try {
            // connection
            const dbCon = await mongoose.connect(mongoURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });

            const gfs = new mongoose.mongo.GridFSBucket(dbCon.connection.db, {
                bucketName: "uploads"
            });

            gridFsInstance = gfs;

            dbInstance = dbCon;

            console.log("mongo connected and intilized bucket");
            resolve({ dbCon, gfs });
        } catch (error) {
            console.log("mongo Error", error);
            reject(error);
        };
    });
}

function getGfsInstance() {
    return gridFsInstance;
}

function getDbInstance() {
    return dbInstance;
}

module.exports = { getMongoDbInstances, getGfsInstance, getDbInstance };