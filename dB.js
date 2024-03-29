const { MongoClient } = require('mongodb');
let dbConnection;

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect('mongodb://localhost:27017/bookstore')
            .then((client) => {
                dbConnection = client.db();
                return cb(null);
            })
            .catch((err) => {
                console.error(err);
                return cb(err);
            });
    },
    getDb: () => {
        return dbConnection
    },
};
