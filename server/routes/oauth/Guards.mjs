import getMongoDbInstance from "../../MongoClientInstance.mjs";
import jwt from 'jsonwebtoken';

const SECRET = process.env.APP_SECRET_KEY;

/**
 * 
 * @param {string} token
 * @returns {Promise<boolean>}
 */
export async function checkToken(token) {
    /**@type {import('mongodb').Collection<import('../../app.mjs').User>} */
    const mongo = (await getMongoDbInstance()).collection('users');

    try {
        const user = jwt.decode(token);

        if (typeof user != 'object') return false;
        
        if (!('email' in user)) return false;

        if (await mongo.findOne({email: user.email})) return true;
        else return false;
    } catch (error) {
        return false;        
    }
}