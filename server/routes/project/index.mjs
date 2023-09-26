import { checkToken } from '../oauth/Guards.mjs';
import getMongoDbInstance from '../../MongoClientInstance.mjs';
import jwt from 'jsonwebtoken';

function generateId() {
    return ~~(Math.random() * 1000000);
}

/**
 * 
 * @param {string} token 
 * @returns {Promise<import('../../app.mjs').User>}
 */
export async function getUser(token) {
    /**@type {import('mongodb').Collection<import('../../app.mjs').User>} */
    const mongo = (await getMongoDbInstance()).collection('users');

    const user = jwt.decode(token);

    if (typeof user != 'object') return null;

    if (!('email' in user)) return null;

    return await mongo.findOne({email: user.email});
}

/**
 * 
 * @param {import('fastify').FastifyInstance} fastify 
 * @param {import('fastify').HookHandlerDoneFunction} done
 * @param {{}} options 
 */
function route(fastify, options, done) {
    fastify.get('/all', async (req, rep) => {
        if (!req.headers.authorization) return rep.send(403);
        if (!(await checkToken(req.headers.authorization))) return rep.send(403);


        /**@type {import('mongodb').Collection<import('../../app.mjs').Project>} */
        const projects = (await getMongoDbInstance()).collection('projects');

        const user = await getUser(req.headers.authorization);

        return projects.find({$or: [{owner_id: user.id}, {users_id: {$in: [user.id]}}]}).toArray();
    });

    fastify.get('/', async (req, rep) => {
        if (!req.headers.authorization) return rep.send(403);
        if (!(await checkToken(req.headers.authorization))) return rep.send(403);


        /**@type {import('mongodb').Collection<import('../../app.mjs').Project>} */
        const projects = (await getMongoDbInstance()).collection('projects');
        
        if (typeof req.query != 'object') {
            rep.send(403);
            return;
        }

        if (!('id' in req.query))
            return rep.send({error: "Bad id"});
        if (typeof +req.query.id != 'number')
            return rep.send({error: "Bad id"});


        const user = await getUser(req.headers.authorization);

        const project = await projects.findOne({id: +req.query.id});

        if (!project.users_id.includes(user.id) && (project.owner_id != user.id))
            return rep.send({error: "Вы не можете получить этот проект"});

        return rep.send(project);
    })

    fastify.post('/', async (req, rep) => {
        if (!req.headers.authorization) return rep.send(403);
        if (!(await checkToken(req.headers.authorization))) return rep.send(403);

        /**@type {import('mongodb').Collection<import('../../app.mjs').Project>} */
        const projects = (await getMongoDbInstance()).collection('projects');
        /**@type {import('mongodb').Collection<import('../../app.mjs').User>} */
        const users = (await getMongoDbInstance()).collection('users');

        if (typeof req.body != 'object') {
            rep.send(403);
            return;
        }

        const user = await getUser(req.headers.authorization);

        if (!('name' in req.body))
            return rep.send({error: "Missing name"});
        if (typeof req.body.name != 'string')
            return rep.send({error: "Bad name"});

        const projectId = generateId();

        await projects.insertOne({
            name: req.body.name,
            count_workers: 1,
            id: projectId,
            owner_id: user.id,
            products: [],
            status: 'processing',
            users_id: []
        });

        user.allowedProjects.push(projectId);

        users.updateOne({email: user.email}, {$set: {allowedProjects: user.allowedProjects}});

        return {succes: true};
    })

    fastify.get('/add_user', async (req, rep) => {
        if (!req.headers.authorization) return rep.send(403);
        if (!(await checkToken(req.headers.authorization))) return rep.send(403);

        /**@type {import('mongodb').Collection<import('../../app.mjs').Project>} */
        const projects = (await getMongoDbInstance()).collection('projects');
        /**@type {import('mongodb').Collection<import('../../app.mjs').User>} */
        const users = (await getMongoDbInstance()).collection('users');

        if (typeof req.query != 'object') {
            rep.send(400);
            return;
        }

        if (!('id' in req.query))
            return {error: 'Cannot add without id'}
        if (!('user_id' in req.query))
            return {error: 'Cannot add without user_id'}

        if (typeof +req.query.id != 'number')
            return rep.send({error: "Bad id"});
        if (typeof +req.query.user_id != 'number')
            return rep.send({error: "Bad user id"});

        const project = await projects.findOne({id: +req.query.id});
        if (!project) return {error: "Wrong project id"}
        const user = await users.findOne({id: +req.query.user_id});
        if (!user) return {error: "Wrong user id"}

        if (!project.users_id.includes(user.id) && (project.owner_id != user.id))
            return rep.send({error: "Вы не можете редактировать этот проект"});

        if (project.users_id.includes(user.id)) return {error: "Нельзя добавить одного и того же пользователя"};

        project.users_id.push(user.id);
        
        projects.updateOne({id: project.id}, {$set: {users_id: project.users_id, count_workers: project.count_workers+1}});

        return {succes: true}
    })

    fastify.post('/create_product', async (req, rep) => {
        if (!req.headers.authorization) return rep.send(403);
        if (!(await checkToken(req.headers.authorization))) return rep.send(403);

        /**@type {import('mongodb').Collection<import('../../app.mjs').Project>} */
        const projects = (await getMongoDbInstance()).collection('projects');

        if (typeof req.body != 'object') {
            rep.send(403);
            return;
        }

        if (!('id' in req.body))
            return rep.send({error: "Missing id"});
        if (!('begin_date' in req.body))
            return rep.send({error: "Missing begin_date"});
        if (!('ends_date' in req.body))
            return rep.send({error: "Missing ends_date"});
        if (!('payment_date' in req.body))
            return rep.send({error: "Missing payment_date"});
        if (!('supplies_date' in req.body))
            return rep.send({error: "Missing supplies_date"});
        if (!('name' in req.body))
            return rep.send({error: "Missing name"});
        if (!('price' in req.body))
            return rep.send({error: "Missing price"});
        if (!('provider' in req.body))
            return rep.send({error: "Missing provider"});
        if (!('units' in req.body))
            return rep.send({error: "Missing units"});
        if (!('worker_name' in req.body))
            return rep.send({error: "Missing worker_name"});
        if (!('type' in req.body))
            return rep.send({error: "Missing worker_name"});
        
        
        if (typeof +req.body.id != 'number')
            return rep.send({error: "Bad id"});
        if (typeof +req.body.begin_date != 'number')
            return rep.send({error: "Bad begin_date"});
        if (typeof +req.body.ends_date != 'number')
            return rep.send({error: "Bad ends_date"});
        if (typeof +req.body.payment_date != 'number')
            return rep.send({error: "Bad payment_date"});
        if (typeof +req.body.supplies_date != 'number')
            return rep.send({error: "Bad supplies_date"});
        if (typeof req.body.name != 'string')
            return rep.send({error: "Bad name"});
        if (typeof +req.body.price != 'number')
            return rep.send({error: "Bad price"});
        if (typeof req.body.provider != 'string')
            return rep.send({error: "Bad provider"});
        if (typeof req.body.units != 'string')
            return rep.send({error: "Bad units"});
        if (typeof req.body.worker_name != 'string')
            return rep.send({error: "Bad worker_name"});
        if (typeof req.body.type != 'string')
            return rep.send({error: "Bad type"});

        if (req.body.type != 'material' && req.body.type != 'work') return {error: "Bad type"}

        const project = await projects.findOne({id: +req.body.id});
        if (!project) return {error: "Bad project id"}
        const user = await getUser(req.headers.authorization);

        if (!project.users_id.includes(user.id) && (project.owner_id != user.id))
            return rep.send({error: "Вы не можете редактировать этот проект"});

        /**@type {import('../../app.mjs').Product} */
        const material = {
            id: generateId(),
            factually: {},
            actual: {
                begin_date: +req.body.begin_date,
                ends_date: +req.body.ends_date,
                payment_date: +req.body.payment_date,
                supplies_date: +req.body.supplies_date
            },
            name: req.body.name,
            price: +req.body.price,
            provider: req.body.provider,
            status: 1,
            type: req.body.type,
            units: req.body.units,
            worker_name: req.body.worker_name
        }

        project.products.push(material);

        projects.updateOne({id: project.id}, {$set: {products: project.products}});

        return {success: true};
    })

    fastify.post('change_product', async (req, rep) => {
        if (!req.headers.authorization) return rep.send(403);
        if (!(await checkToken(req.headers.authorization))) return rep.send(403);

        /**@type {import('mongodb').Collection<import('../../app.mjs').Project>} */
        const projects = (await getMongoDbInstance()).collection('projects');

        if (typeof req.body != 'object') {
            rep.send(403);
            return;
        }

        if (!('id' in req.body))
            return {error: "Missing id"}
        if (typeof +req.body.id != 'number')
            return {error: "Bad id"}
        
        const project = await projects.findOne({id: req.body.id});
        const user = await getUser(req.headers.authorization);

        if (!project.users_id.includes(user.id) && (project.owner_id != user.id))
            return rep.send({error: "Вы не можете редактировать этот проект"});
        
        if (!project) return {error: "Bad id"};

        if ('product_status' in req.body && 'product_id' in req.body) {
            if (typeof +req.body.product_status != 'number') return {error: "Bad product_status"};
            if (typeof +req.body.product_id != 'number') return {error: "Bad product_id"};
            if (+req.body.product_status == 1 || +req.body.product_status == 2 || +req.body.product_status == 3 || +req.body.product_status == 4) return {error: "Bad product_status"};
            const produtc = project.products.find(e => e.id == +req.body.product_id);

            if (!produtc) return {error: 'bad product id'};
            
            produtc.status = +req.body.product_status;

            await projects.updateOne({id: project.id}, {$set: project.products});

            return {succes: true};
        } else if ('factually' in req.body && 'product_id' in req.body) {
            if (typeof +req.body.product_id != 'number') return {error: "Bad product_id"};
            if (typeof req.body.factually != 'object') return {error: "Bad factually"};

            if ('payment_date' in req.body.factually && 
            'supplies_date' in req.body.factually && 
            'begin_date' in req.body.factually && 
            'ends_date' in req.body.factually) {
                const produtc = project.products.find(e => e.id == +req.body.product_id);

                if (!produtc) return {error: 'bad product id'};

                produtc.factually = req.body.factually;

                await projects.updateOne({id: project.id}, {$set: {
                    products: project.products
                }});
                
                return {success: true};
            } else {
                return {error: "Missing payment_date|supplies_date|begin_date|ends_date"};
            }
        }

        return {error: 'braaaah'};
    })

    fastify.post('project_status', async (req, rep) => {
        if (!req.headers.authorization) return rep.send(403);
        if (!(await checkToken(req.headers.authorization))) return rep.send(403);

        /**@type {import('mongodb').Collection<import('../../app.mjs').Project>} */
        const projects = (await getMongoDbInstance()).collection('projects');

        if (typeof req.body != 'object') {
            rep.send(403);
            return;
        }

        if (!('id' in req.body))
            return {error: "Missing id"}
        if (!('status' in req.body))
            return {error: "Missing status"}
        if (typeof req.body.status != 'string')
            return {error: "Bad status"};
        if (typeof +req.body.id != 'number')
            return {error: "Bad id"};
        if (req.body.status != 'processing' && req.body.status != 'final') return {error: "Bad status"};

        const project = await projects.findOne({id: req.body.id});
        const user = await getUser(req.headers.authorization);

        if (!project.users_id.includes(user.id) && (project.owner_id != user.id))
            return rep.send({error: "Вы не можете редактировать этот проект"});

        await projects.updateOne({id: project.id}, {$set: {status: req.body.status}});

        return {success: true};
    })
    
    done();
}

export default route;