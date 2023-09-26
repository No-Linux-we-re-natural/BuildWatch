import { Api } from "./api.mjs";

const client = new Api();

const projectsMenu = document.querySelector('.projects');
const selectedProject = document.querySelector('.selected_project');
/**@type {HTMLDivElement} */
const active = document.querySelector('#active_project');
/**@type {HTMLDivElement} */
const selected = document.querySelector('#selected_project');

/**@type {HTMLDivElement} */
const newProject = document.querySelector('.new_project');

;(async () => {
    const projects = await client.getAllProjects();

    let msg = '<div class="project">Нет активных проектов</div>';

    if (projects.length) {
        msg = projects.map(e => '<div class="create_project project blelele">' + e.name + '</div>').join('\n');
    }

    projectsMenu.innerHTML = `
        <h2>Проекты:</h2>
        <div class="create_project project puk">Создать проект</div>
        ${msg}
    `;

    const array = Array.from(projectsMenu.querySelectorAll('.blelele'));

    if (array.length) for (const [index, doc] of array.entries()) {
        doc.addEventListener('click', () => {
            const curr = projects[index];
            show();
            selectedProject.innerHTML = `
                <div class="name">
                    <h3>${curr.name}</h3>
                    <h4>Статус: ${curr.status == 'processing' ? 'В процессе' : 'Готов'}</h4>
                </div>
                <a href="./menu/?id=${curr.id}"><button>Подробнее</button></a>
            `
        })
    }
    const createProject = document.querySelector('.puk');

    createProject.addEventListener('click', e => {
        newProject.style.display = 'flex';
        active.style.display = "none";
        selected.style.display = "none";
        
        /**@type {HTMLDivElement} */
        const create_projeja = document.querySelector('#create_projeja');
        /**@type {HTMLInputElement} */
        const create_input = document.querySelector('#create_input');

        let msg = '';

        create_input.oninput = () => msg = create_input.value;
        
        create_projeja.onclick = async () => {
            await client.createProject(msg);

            location.href = '/';
        }
    });
})()

function show() {
    newProject.style.display = "none";
    active.style.display = "none";
    selected.style.display = "flex";
}