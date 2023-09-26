import { Api } from "../scripts/api.mjs";

const client = new Api();

/**@type {HTMLAnchorElement[]} */
const card_pool = Array.from(document.querySelectorAll('.card_pool a'));

const name = document.querySelector('#imechko');

;(async () => {

    if (!location.search || !location.search.startsWith('?id')) {
        location.href = '../';
        return;
    }

    const projectId = +location.search.slice(4);
    if (Number.isNaN(projectId)) location.href = '../';

    const project = await client.getProject(projectId);

    if (!project) location.href = '../';
    
    for (const card of card_pool) {
        card.href = card.href + location.search;
    }

    name.innerHTML = 'Название: ' + project.name;
})()