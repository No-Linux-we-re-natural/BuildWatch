const active = document.querySelector('#active_project');
const selected = document.querySelector('#selected_project');
function openProject() {
    active.style.display = "none";
    selected.style.display = "flex";
}