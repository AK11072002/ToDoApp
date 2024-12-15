let todoList = [];
let searchQuery = '';



initializeApp();

function initializeApp() {
    const savedTodos = localStorage.getItem('todoList');
    if (savedTodos) {
        // Parse and load tasks from localStorage
        todoList = JSON.parse(savedTodos);
    }
    displayItems();
}

function saveToLocalStorage() {
    // Save the todoList array to localStorage
    localStorage.setItem('todoList', JSON.stringify(todoList));
}

//   displayItems();

function addTodo() {
    let inputElement = document.querySelector('#todo-input');
    let todoItem = inputElement.value;
    if (todoItem === '') {
        alert('The Todo fields are required!');
        return;
    }
    todoList.unshift({ item: todoItem, done: false });
    saveToLocalStorage();
    displayItems();
    inputElement.value = '';
}

function displayItems() {
    let containerElement = document.querySelector('.todo-contaner');
    let newHtml = '';

    let filteredList = todoList.filter(todo => todo.item.toLowerCase().includes(searchQuery.toLowerCase()));

    for (let i = 0; i < filteredList.length; i++) {
        let { item, done } = filteredList[i];
        newHtml += `
            <div class="todo-items">
                <div class="todo-item ${done ? 'done' : ''}" id="item-${i}">
                    <div class="s-button-input">
                        <button 
                            class="circular-button ${done ? 'done' : ''}" 
                            onclick="markAsDone(${i})">
                        </button>
                        <div class="content">
                            <span id="text-${i}" style="text-decoration: ${done ? 'line-through' : 'none'};">
                                ${item}
                            </span>
                            <input 
                                type="text" 
                                id="edit-input-${i}" 
                                class="edit-input" 
                                style="display: none;" 
                                value="${item}" 
                                onkeypress="handleEditKeyPress(event, ${i})"
                            />
                        </div>
                    </div>
                    <div class="menu">
                        <button class="menu-button" onclick="toggleMenu(${i})">⋮</button>
                        <div class="menu-actions" id="menu-actions-${i}" style="display: none;">
                            <button class="button" onclick="deleteItem(${i})">Delete</button>
                            <button class="button" id="edit-button-${i}" onclick="editItem(${i})">Edit</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    containerElement.innerHTML = newHtml;
}


function toggleMenu(index) {
    const allMenus = document.querySelectorAll('.menu-actions');
    allMenus.forEach((menu, i) => {
        if (i !== index) {
            menu.style.display = 'none';
        }
    });
    const menuActions = document.getElementById(`menu-actions-${index}`);
    menuActions.style.display = menuActions.style.display === 'none' ? 'block' : 'none';
}

function markAsDone(index) {
    todoList[index].done = !todoList[index].done;
    saveToLocalStorage();
    displayItems();
}

function editItem(index) {
    const textElement = document.getElementById(`text-${index}`);
    const inputElement = document.getElementById(`edit-input-${index}`);
    const editButton = document.getElementById(`edit-button-${index}`);
    
    textElement.style.display = 'none';
    inputElement.style.display = 'inline-block';
    inputElement.focus(); 

    editButton.textContent = 'Save';
    editButton.onclick = function() {
        saveItem(index);
    };
}

function handleEditKeyPress(event, index) {
    if (event.key === 'Enter') {
        saveItem(index);
    }
}

function saveItem(index) {
    const inputElement = document.getElementById(`edit-input-${index}`);
    const newValue = inputElement.value.trim();
    if (newValue === '') {
        alert('Todo item cannot be empty!');
        return;
    }
    todoList[index].item = newValue;

    const editButton = document.getElementById(`edit-button-${index}`);
    editButton.textContent = 'Edit';
    editButton.onclick = function() {
        editItem(index);
    };

    saveToLocalStorage(); 

    displayItems();
}

function deleteItem(index) {
    todoList.splice(index, 1);

    saveToLocalStorage();
    
    displayItems();
}

function searchTodos() {
    searchQuery = document.getElementById('search-input').value.trim();
    displayItems();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        addTodo();
    }
}