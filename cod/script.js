const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function createTaskElement(task, index) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.draggable = true;
    li.textContent = task.text;
    if (task.completed) li.classList.add('completed');

    li.addEventListener('click', () => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    });

    li.addEventListener('dragstart', () => {
        li.classList.add('dragging');
        li.dataset.index = index;
    });

    li.addEventListener('dragend', () => {
        li.classList.remove('dragging');
    });

    return li;
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const taskElement = createTaskElement(task, index);
        taskList.appendChild(taskElement);
    });
}

addTaskBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text !== '') {
        tasks.push({ text, completed: false });
        saveTasks();
        renderTasks();
        taskInput.value = '';
    }
});

taskList.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(e.clientY);
    const dragging = document.querySelector('.dragging');
    if (afterElement == null) {
        taskList.appendChild(dragging);
    } else {
        taskList.insertBefore(dragging, afterElement);
    }
});

taskList.addEventListener('drop', () => {
    const dragging = document.querySelector('.dragging');
    const newIndex = Array.from(taskList.children).indexOf(dragging);
    const oldIndex = +dragging.dataset.index;
    const movedItem = tasks.splice(oldIndex, 1)[0];
    tasks.splice(newIndex, 0, movedItem);
    saveTasks();
    renderTasks();
});

function getDragAfterElement(y) {
    const draggableElements = [...taskList.querySelectorAll('.task-item:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

renderTasks();
