import { Api } from "../scripts/api.mjs";

/**@type {HTMLAnchorElement} */
const menuA = document.querySelector('#menu');

const payments = document.querySelector('.container_payments');

const client = new Api();

;(async () => {
    if (!location.search || !location.search.startsWith('?id')) {
        location.href = '../';
        return;
    }

    const projectId = +location.search.slice(4);
    if (Number.isNaN(projectId)) location.href = '../';

    const project = await client.getProject(projectId);

    if (!project) location.href = '../';

    menuA.href = menuA.href + location.search;

    let msg = `
        <div class="container_payment">
            <div class="row_header">
                <p>У вас нет платежей</p>
            </div>
        </div>
    `

    if (project.products.length) {
        msg = project.products.map(e => {
            return `
            <div class="row">
                <p>${e.name}</p>
                <p>${new Date(e.actual.supplies_date).toLocaleString()}</p>
                <p>${e.factually.supplies_date ? new Date(e.factually.supplies_date).toLocaleString() : 'Н/Д'}</p>
            </div>
        `}).join('\n')
    }

    payments.innerHTML = `
        <div class="container_payment">
            <div class="row_header">
                <p>Название</p>
                <p>Планируемая дата</p>
                <p>Фактическая дата</p>
            </div>
            ${msg}
        </div>
    `
})();