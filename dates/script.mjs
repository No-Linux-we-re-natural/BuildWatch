import { Api } from "../scripts/api.mjs";

const client = new Api();

/**@type {HTMLAnchorElement} */
const menuA = document.querySelector('#menu');

const workElem = document.querySelector('#work');
const materialElem = document.querySelector('#material');

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

    const material = project.products.filter(e => e.type == 'material');
    const work = project.products.filter(e => e.type == 'work');

    insert(workElem, work, 'Начало/конец работы');
    insert(materialElem, material, 'Поставка материалов');
})();

/**
 * 
 * @param {Element} element 
 * @param {import('../scripts/api.mjs').Product[]} array 
 * @param {String} title
 */
function insert(element, array, title) {
    let msg = `Ничего`;

    if (array.length) {
        msg = array.map(e => `
            <div class="dates_row">
                <p>${e.name}</p>
                <p>${new Date(e.actual.supplies_date).toLocaleString()}</p>
                <p>${e.factually.supplies_date ? new Date(e.factually.supplies_date).toLocaleString() : 'Н/Д'}</p>
            </div>
        `).join('\n');
    }
    
    element.innerHTML = `
        <h1>${title}</h1>
        <div class="dates">
            <div class="dates_header">
                <p>Название</p>
                <p>Планируемая дата</p>
                <p>Фактическая дата</p>
            </div>
            ${msg}
        </div>
    `
}