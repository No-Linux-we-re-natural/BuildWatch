import { fastifyAutoload } from "@fastify/autoload";
import * as dotenv from 'dotenv';

/**
 * @typedef {{
 * 		email: string
 *      name: string
 *      password: string
 *      id: number
 *      allowedProjects: number[]
 * }} User
 * 
 * @typedef {{
 * 		id: number
 * 		users_id: number[]
 * 		owner_id: number
 * 		name: string
 * 		status: 'processing' | 'final'
 * 		products: Product[]
 * 		count_workers: number
 * }} Project
 * 
 * status:
 * 1 - Ждет оплаты
 * 2 - Ждет поступления материала
 * 3 - Ждет окончания работы
 * 4 - Done
 * 
 * @typedef {{
 * 		payment_date: number | null
 * 		supplies_date: number | null
 * 		begin_date: number | null
 * 		ends_date: number | null
 * }} Payment
 * 
 * @typedef {{
 * 		name: string
 * 		worker_name: string
 * 		type: 'material' | 'work'
 * 		units: string
 * 		provider: string
 * 		status: 1 | 2 | 3 | 4
 * 		actual: Payment
 * 		factually: Payment | {}
 * 		price: number
 * 		id: number
 * }} Product
 */

/**
 * @param {import('fastify').FastifyInstance} fastify 
 * @param {{}} options 
 */
const app = async (fastify, options) => {
	dotenv.config();

	fastify.register(fastifyAutoload, {
		dir: './routes'
	})
}

export default app;