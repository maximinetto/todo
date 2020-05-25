const classNames = {
  TODO_ITEM: 'todo-container',
  TODO_CHECKBOX: 'todo-checkbox',
  TODO_TEXT: 'todo-text',
  TODO_DELETE: 'todo-delete',
}

const list = document.getElementById('todo-list')
const itemCountSpan = document.getElementById('item-count')
const uncheckedCountSpan = document.getElementById('unchecked-count')
let input = document.getElementById('addTask');

function newTodo() {
  if(input.value === ""){
    return;  
  }
  saveTask();
  getTasks();
  cleanTexts();

  
}

getTasks();
input.addEventListener('keyup', function(ev){
  const title = ev.target.value;
  if(ev.keyCode === 13){
    newTodo();
  }

});


function saveTask() {
  const title = input.value;

  const task = {
    title,
  };

  let tasks = localStorage.getItem('tasks');
  if (tasks === null) {
    tasks = saveWithoutTasks(tasks, task);
  } else {
    tasks = saveWithTasks(tasks, task);
  }
  
}

function getTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  if (tasks === null) {
    return;
  }
  
  let tasksView = document.getElementById('todo-list');

  tasksView.innerHTML = '';
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    tasksView.innerHTML += `
        <li id="tasks-${task.id}" >
            <input type="hidden" value="${task.id}">
            ${task.title} <span class="close" onClick="deleteTask(${task.id})">x</span>
        </li>`
  }

  itemCountSpan.textContent = tasks.length;
  countUnchecked();
  addEventListenerLi();
}

function addEventListenerLi(){
  
  document.querySelectorAll("li").forEach(item => {
    item.addEventListener("click", function (ev){
      const id = item.firstElementChild.value;
      const node = ev.target.nodeName;
      if(node === "SPAN"){
        return;
      }
  
      toggleCheck(id);
    })
  });
  
}


function deleteTask(idTask) {
  const id = parseInt(idTask, 10);
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (task.id === id) {
      tasks.splice(i, 1);
    }
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));
  getTasks();
}

function countUnchecked(){
  const checkedCount = document.querySelectorAll("li.checked").length;
  const itemCount = parseInt(itemCountSpan.textContent, 10);
  const uncheckedCount = itemCount - checkedCount;
  uncheckedCountSpan.textContent = uncheckedCount;
}

function toggleCheck(id){
  let taskView = document.getElementById("tasks-" + id);
  taskView.classList.toggle("checked");
  countUnchecked();
}

function saveWithTasks(tasks, task) {
  tasks = JSON.parse(tasks);
  let number = tasks.length;
  task.id = number + 1;
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  return tasks;
}

function saveWithoutTasks(tasks, task) {
  tasks = [];
  task.id = 1;
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  return tasks;
}

function cleanTexts() {
  document.getElementById('addTask').value = "";
}