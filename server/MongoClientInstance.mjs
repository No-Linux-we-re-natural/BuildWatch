import { MongoClient } from 'mongodb';

const mongoUrl = process.env.MONGO_URL;
const mongoDbName = process.env.MONGO_DB_NAME;

/**
 * @type {{
 *      mongo: import('mongodb').Db | null
 * }}
 */
const instance = {
    mongo: null
}

export default async function getMongoDbInstance() {
    if (!instance.mongo) {
        const mongo = new MongoClient(mongoUrl);
        await mongo.connect();
        instance.mongo = mongo.db(mongoDbName);
    }
    
    return instance.mongo;
}