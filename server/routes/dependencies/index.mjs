import { checkToken } from '../oauth/Guards.mjs';
import getMongoDbInstance from '../../MongoClientInstance.mjs';
import { getUser } from '../project/index.mjs';
/**
 * 
 * @param {import('fastify').FastifyInstance} fastify 
 * @param {import('fastify').HookHandlerDoneFunction} done
 * @param {{}} options 
 */
function route(fastify, options, done) {

    fastify.get('/', async (req, rep) => {
        if (!req.headers.authorization) return rep.send(403);
        if (!(await checkToken(req.headers.authorization))) return rep.send(403);

        /**@type {import('mongodb').Collection<import('../../app.mjs').Project>} */
        const projects = (await getMongoDbInstance()).collection('projects');

        const user = await getUser(req.headers.authorization);

        if (typeof req.query != 'object') return {error: "Bad query"};

        if (!('id' in req.query)) return {error: "Missing id"};
        if (typeof +req.query.id != 'number') return {error: "Bad id"};

        const project = await projects.findOne({id: +req.query.id});

        if (!project) return {error: "Bad id"};

        if (project.owner_id != user.id && !project.users_id.includes(user.id)) return {error: "Вы не можете просматривать этот проект"};

        return project.products.filter(p => p.type == 'material' && p.status < 4);
    })

    done()
}

export default route;