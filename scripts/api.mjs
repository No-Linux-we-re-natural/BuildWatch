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

const base_api_url = 'http://localhost:3000';

export class Api {
    constructor() {}
    /**
     * 
     * @param {string} login 
     * @param {string} email 
     * @param {string} pass
     * @returns {Promise<boolean>} 
     */
    async register(login, email, pass) {
        const data = await (await fetch(`${base_api_url}/oauth/?email=${email}&password=${pass}&name=${login}`)).json();

        if (data.succes) {
            localStorage.setItem('token', data.token);
            return true;
        } else return false;
    }

    /**
     * 
     * @param {string} email 
     * @param {string} pass 
     * @returns {Promise<boolean>} 
     */
    async login(email, pass) {
        const data = await (await fetch(`${base_api_url}/oauth/?email=${email}&password=${pass}`)).json();

        if (data.succes) {
            localStorage.setItem('token', data.token);
            return true;
        } else return false;
    }

    /**
     *@returns {Promise<Project[]>} 
     */
    async getAllProjects() {
        return await (await fetch(`${base_api_url}/project/all`)).json();
    }

    /**
     * 
     * @param {number} id
     * @returns {Promise<Project | null>} 
     */
    async getProject(id) {
        const data = await (await fetch(`${base_api_url}/project?id=${id}`)).json();

        if (data.error) return null;
        return data;
    }

    /**
     * 
     * @param {String} name
     * @returns {Promise<boolean>} 
     */
    async createProject(name) {
        const data = await (await fetch(`${base_api_url}/project`,{
            method: "POST",
            body: JSON.stringify({
                name
            })
        })).json();

        if (data.error) return false;
        else return true;
    }

    /**
     * 
     * @param {number} project_id 
     * @param {number} user_id 
     * @returns {Promise<{error: string} | {success: true}>}
     */
    async addUserToProject(project_id, user_id) {
        const data = await (await fetch(`${base_api_url}/project/add_user?id=${project_id}&user_id=${user_id}`)).json();

        return data;
    }

    /**
     * 
     * @param {{
     *      id: Number
     *      begin_date: Number
     *      ends_date: Number
     *      payment_date: Number
     *      supplies_date: Number
     *      name: String
     *      price: Number
     *      provider: String
     *      units: String
     *      worker_name: String
     *      type: 'material' | 'work'
     * }} opts 
     * @returns {Promise<{error: string} | {success: true}>}
     */
    async createProduct(opts) {
        const data = await (await fetch(`${base_api_url}/project/create_product`, {
            method: "POST",
            body: JSON.stringify(opts)
        })).json();

        return data;
    }

    /**
     * 
     * @param {{
     *          id: Number
     *      } & {
     *          product_status: 1 | 2 | 3 | 4
     *          product_id: Number
     *      } | {
     *          product_id: Number
     *          factually: {
     *              payment_date: Number
     *              supplies_date: Number
     *              begin_date: Number
     *              ends_date: Number
     *          }
     *      }} opts 
     * @returns {Promise<{error: string} | {success: true}>}
     */
    async changeProduct(opts) {
        const data = await (await fetch(`${base_api_url}/project/change_product`, {
            method: "POST",
            body: JSON.stringify(opts)
        })).json();

        return data;
    }

    /**
     * 
     * @param {number} id 
     * @param {'processing' | 'final'} status 
     * @returns {Promise<{error: string} | {success: true}>}
     */
    async changeProjectStatus(id, status) {
        const data = await (await fetch(`${base_api_url}/project_status`, {
            method: "POST",
            body: JSON.stringify({
                id,
                status
            })
        })).json()

        return data;
    }

    /**
     * 
     * @param {number} project_id
     * @returns  {Promise<{error: string} | Product[]>}
     */
    async getProjectDepencies(project_id) {
        const data = await (await fetch(`${base_api_url}/dependencies`)).json();

        return data;
    }
}