import { Api } from "../scripts/api.mjs";

const client = new Api();

/**@type {HTMLAnchorElement} */
const menuA = document.querySelector('#menu');
const container_relationship = document.querySelector('.container_relationship');

const obj = {
    1: 'Ждёт оплаты',
    2: 'Ждёт поступления материала',
    3: 'Ждёт окончания работы',
    4: 'Готово'
}

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

    let msg = '';

    const relations = await client.getProjectDepencies(project.id);

    if (!('error' in relations) && relations.length) {
        msg = relations.map(e => `
            <div class="relationship">
                <div class="row_info">
                    <p class="name">${e.name}</p>
                    <div class="status">
                        <span></span>
                        <p>${obj[e.status]}</p>
                    </div>
                    <p class="units">Единица: ${e.units}</p>
                    <p class="kol-vo">Кол-во: ${e.count}</p>
                </div>
                <div class="cena">
                    ${e.price}P
                </div>
            </div>
        `).join('\n');
    }

    container_relationship.innerHTML = `
        ${msg}
    `;
})()