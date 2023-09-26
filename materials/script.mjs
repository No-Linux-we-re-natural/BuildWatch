import { Api } from "../scripts/api.mjs";

const client = new Api();

const container_materials = document.querySelector('.container_materials');
/**@type {HTMLAnchorElement} */
const menuA = document.querySelector('#menu')

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

    let msg = `
        <div class="table_materials">
            <div class="table_materials_row">
                <div class="material_id">1</div>
                <div class="material_info">
                    Вы не заказали материалы
                </div>
                <button>-</button>
            </div>
        </div>
    `;

    if (project.products.filter(e => e.type == 'material').length) {
        const materials = project.products.filter(e => e.type == 'material');

        msg = materials.map((m, i) => `
            <div class="table_materials">
                <div class="table_materials_row">
                    <div class="material_id">${i+1}</div>
                    <div class="material_info">
                        <p>${m.worker_name}</p>
                        <p>${m.name}</p>
                        <p>${m.units}</p>
                        <p>${m.count}</p>
                        <p>${m.provider}</p>
                        <p>${obj[m.status]}</p>
                    </div>
                    <button>-</button>
                </div>
            </div>
        `).join('\n')
    }

    container_materials.innerHTML = `
        <div class="table_header">
            <div class="id"></div>
            <div class="table_header_name">
                <p>Рабочее наименование товара</p>
                <p>Наименование для торгов товара</p>
                <p>Ед. изм</p>
                <p>Кол-во</p>
                <p>Поставщик</p>
                <p>Статус</p>
            </div>
            <button>+</button>
        </div>
        ${msg}
    `
})()