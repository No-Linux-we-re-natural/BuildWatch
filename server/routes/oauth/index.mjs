/**
 * TODO:
 * регистрация уникальных пользователей
 * авторизация
 * генерация токенов 
 */

const SECRET = process.env.APP_SECRET_KEY;

import getMongoDbInstance from '../../MongoClientInstance.mjs';
import jwt from 'jsonwebtoken';

function generateId() {
    return ~~(Math.random() * 1000000);
}

/**
 * 
 * @param {import('fastify').FastifyInstance} fastify 
 * @param {import('fastify').HookHandlerDoneFunction} done
 * @param {{}} options 
 */
function route(fastify, options, done) {
    fastify.get('/register', async (req, rep) => {
        /**@type {import('mongodb').Collection<import('../../app.mjs').User>} */
        const mongo = (await getMongoDbInstance()).collection('users');
        
        if (typeof req.query != 'object') {
            rep.code(400);
            return;
        }

        if (!('name' in req.query))
            return rep.send(JSON.stringify({error: "Вы не можете создать учётную запись без имени"}));
        if (!('email' in req.query))
            return rep.send(JSON.stringify({error: "Вы не можете создать учётную запись без почты"}));
        if (!('password' in req.query))
            return rep.send(JSON.stringify({error: "Вы не можете создать учётную запись без пароля"}));
        
        if (typeof req.query.name != 'string' || typeof req.query.password != 'string' || typeof req.query.email != 'string') {
            return rep.send({error: "Не правильные типы пароля или имени"});
        }

        const name = req.query.name;
        const email = req.query.email;
        
        if (await mongo.findOne({email})) {
            return rep.send({error: "Пользователь с такой почтой уже существует"});
        }

        const user = {
            allowedProjects: [],
            id: generateId(),
            password: req.query.password,
            name,
            email
        }

        await mongo.insertOne(user);

        const token = jwt.sign({email}, SECRET);

        return rep.send({succes: true, token});
    });

    fastify.get('/', async (req, rep) => {
        /**@type {import('mongodb').Collection<import('../../app.mjs').User>} */
        const mongo = (await getMongoDbInstance()).collection('users');

        if (typeof req.query != 'object') {
            rep.code(400);
            return;
        }

        if (!('email' in req.query))
            return rep.send(JSON.stringify({error: "Вы не можете авторизоваться в учётную запись без почты"}));
        if (!('password' in req.query))
            return rep.send(JSON.stringify({error: "Вы не можете авторизоваться в учётную запись без пароля"}));
        
        if (typeof req.query.email != 'string' || typeof req.query.password != 'string') {
            return rep.send({error: "Не правильные типы пароля или имени"});
        }

        const password = req.query.password;
        const email = req.query.email;

        const user = mongo.findOne({email, password});

        if (user) return rep.send({succes: true, token: jwt.sign({email}, SECRET)});
        else return rep.send({error: "Неправильное имя пользователя или пароль"});
    });

    done();
}

export default route;