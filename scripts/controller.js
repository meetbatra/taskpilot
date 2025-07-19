import { validateName, validateDesc, validateDate } from "./validation.js"; 
import todoOperations from "./service.js";
import { init } from "./utils.js";

window.addEventListener('load', initialize);

let autoId;
let editedRow;

function initialize(){
    bindEvents();
    autoId = init();
    showId();
    todoOperations.loadTasks();
    printAllTasks();
}

function bindEvents(){
    document.getElementById('add').addEventListener('click', addTask);
    document.getElementById('delete').addEventListener('click', deleteTask);
    document.getElementById('update').addEventListener('click', updateTask);
    document.getElementById('save').addEventListener('click', saveTasks);
    document.getElementById('clear').addEventListener('click', clearAll);
    document.getElementById('search').addEventListener('click', showSearch);
    document.getElementById('search-icon').addEventListener('click', search);
    document.getElementById('sort-up').addEventListener('click', sort);
    document.getElementById('sort-down').addEventListener('click', sort);
}

function showId(){
    document.querySelector('#id').innerText = autoId();
}

function addTask(){
    var task = readFields();
    if(verifyFields(task)){
        todoOperations.addTask(task);
        printTask(task);
        computeTotal();
        showId();
    }
}

function toggleMarking(){
    const currentButton=this;
    const id=currentButton.getAttribute('task-id');
    todoOperations.toggleTask(id);
    const tr=currentButton.parentNode.parentNode;
    tr.classList.toggle('red');
    computeTotal();
    document.getElementById('delete').disabled = false;
}

function deleteTask(){
    const tbody = document.querySelector('#task-list');
    const markedTasks = tbody.querySelectorAll('tr.red');
    tbody.innerHTML = '';
    todoOperations.removeTask();
    printAllTasks();
    document.getElementById('delete').disabled = true;
}

function editTask(){
    const row = this.closest('tr');
    const cells = row.querySelectorAll('td');
    const fields = ['name','desc','date','time','photo'];
    for(let i=0; i<fields.length; i++){
        const elem = document.getElementById(fields[i]);
        if(fields[i] == 'photo'){
            const img = cells[i+1].querySelector('img');
            elem.value = img.src;
        } else {
            elem.value = cells[i+1].innerText;
        }
    }
    editedRow = row;
    document.getElementById('update').disabled = false;
}

function updateTask(){
    if(!editedRow) return;
    console.log(editedRow);
    const cells = editedRow.querySelectorAll('td');
    const task = readFields();
    if(verifyFields(task)){
        todoOperations.updateTask(task);
        delete task.id;
        let i = 1;
        for(let key in task){
            if(key === 'photo'){
                const img = cells[i].querySelector('img');
                img.src = task[key];
            } else {
                cells[i].innerText = task[key];
            }
            i++;
        }
        editedRow = null;
        document.getElementById('update').disabled = true;
    }
}

function saveTasks(){
    todoOperations.saveTasks();
}

function clearAll(){
    document.getElementById('task-list').innerHTML = ''
    todoOperations.tasks = [];
    todoOperations.clearAll();
    computeTotal();
}

function showSearch(){
    const elem = document.querySelector('.search');
    if(elem.style.display == 'none'){
        elem.style.display = 'flex';
    } else {
        elem.style.display = 'none';
    }
}

function search(){
    const query = document.querySelector('.search-inp').value.toLowerCase();
    const rows = document.querySelectorAll('#task-list tr');
    if(rows.length === 0){
        return;
    }
    rows.forEach((row) => {
        const name = row.querySelectorAll('td')[1];
        if(name.innerText.toLocaleLowerCase().trim() === query){
            row.classList.add('highlight');
        } else {
            row.classList.remove('highlight');
        }
    });
}

function sort(){
    const up = document.getElementById('sort-up');
    const down = document.getElementById('sort-down');

    const upVisible = up.style.display === 'block' || window.getComputedStyle(up).display === 'block';
    const downVisible = down.style.display === 'block' || window.getComputedStyle(down).display === 'block';

    if(upVisible){
        todoOperations.sortTask(true);
        up.style.display = 'none';
        down.style.display = 'block';
    } else if(downVisible){
        todoOperations.sortTask(false);
        down.style.display = 'none';
        up.style.display = 'block';
    }

    document.getElementById('task-list').innerHTML = '';
    printAllTasks();
}

function printAllTasks(){
    todoOperations.tasks.forEach(printTask);
    computeTotal();
}

function printTask(task){
    const tbody = document.querySelector('#task-list');
    const tr = tbody.insertRow();
    let index = 0;
    for(let key in task){
        const td = tr.insertCell(index)
        if(key === 'photo'){
            const img = document.createElement('img');
            img.src = task[key];
            img.alt = 'task-img';
            img.width = 50;
            img.height = 50;
            img.style.objectFit = 'cover';
            td.appendChild(img);
        } else {
            td.innerText = task[key];
        }
        index++;
    }
    const td = tr.insertCell(index);
    td.appendChild(createIcon(task.id, toggleMarking));
    td.appendChild(createIcon(task.id, editTask, 'fa-pen'));
    td.classList.add('operations');
}

function computeTotal(){
    document.querySelector('#total').innerText = todoOperations.getTotal();
    document.querySelector('#marked').innerText = todoOperations.getMarked();
    document.querySelector('#unmarked').innerText = todoOperations.getUnmarked();
}

function createIcon(id, fn, className='fa-trash'){
    const iTag = document.createElement('i');
    iTag.className = `fa-solid ${className}`;
    iTag.addEventListener('click', fn);
    iTag.setAttribute('task-id', id);
    return iTag;
}

function verifyFields(task){
    const nameErr = validateName(task.name);
    const descErr = validateDesc(task.desc);
    const dateErr = validateDate(task.date);
    
    document.getElementById('name-error').innerText = nameErr ? nameErr : '';
    document.getElementById('desc-error').innerText = descErr ? descErr : '';
    document.getElementById('date-error').innerText = dateErr ? dateErr : '';

    if(nameErr || descErr || dateErr){
        return false
    };

    return true;
}

function readFields(){
    const FIELDS = ['id', 'name', 'desc' , 'date','time','photo'];
    var task = {};
    for(let field of FIELDS){
        if(field=='id'){
             task[field] = document.getElementById(field).innerText;
             continue;
        }
        task[field] = document.getElementById(field).value;
        console.log(field);
        console.log(task)
    }
    return task;
}