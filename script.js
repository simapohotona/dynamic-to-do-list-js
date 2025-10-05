// Wait for the DOM to fully load before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Select DOM elements
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // In-memory tasks array. Each task is an object: { id: string, text: string }
    let tasks = [];

    // Save current tasks array to localStorage
    function saveTasksToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Create an <li> element for a task object (does NOT modify storage)
    function createTaskElement(task) {
        const li = document.createElement('li');
        li.dataset.id = task.id;

        // Keep text in its own element so layout is stable
        const span = document.createElement('span');
        span.textContent = task.text;
        li.appendChild(span);

        // Create remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.className = 'remove-btn';

        // When clicked, remove task from DOM and localStorage
        removeBtn.addEventListener('click', () => {
            removeTask(task.id);
        });

        li.appendChild(removeBtn);
        return li;
    }

    // Render a task (append it to the list) without altering storage
    function renderTask(task) {
        const li = createTaskElement(task);
        taskList.appendChild(li);
    }

    // Add a new task. If called with a string param, that text is used;
    // otherwise the value from the input field is used. This function
    // updates tasks[] and localStorage.
    function addTask(taskTextParam) {
        // Determine the source of the text (param or input)
        const taskText = (typeof taskTextParam === 'string') ? taskTextParam.trim() : taskInput.value.trim();

        // Validate input
        if (taskText === '') {
            alert('Please enter a task before adding!');
            return;
        }

        // Create task object with a unique id
        const task = {
            id: Date.now().toString() + Math.random().toString(36).slice(2),
            text: taskText
        };

        // Update in-memory array and persist to localStorage
        tasks.push(task);
        saveTasksToLocalStorage();

        // Render to DOM
        renderTask(task);

        // Clear the input if the task came from the input field
        if (typeof taskTextParam !== 'string') {
            taskInput.value = '';
        }
    }

    // Remove a task by id: update in-memory array, localStorage, and DOM
    function removeTask(id) {
        // Update tasks array
        tasks = tasks.filter(t => t.id !== id);

        // Persist the change
        saveTasksToLocalStorage();

        // Remove the corresponding li from the DOM
        const li = taskList.querySelector(`li[data-id="${id}"]`);
        if (li) li.remove();
    }

    // Load tasks from localStorage and render them
    function loadTasks() {
        const stored = JSON.parse(localStorage.getItem('tasks') || '[]');

        // If stored is an array, normalize it to objects {id, text}
        if (Array.isArray(stored)) {
            // Support both previous string-only storage (["task1","task2"]) and object storage.
            tasks = stored.map(item => {
                if (typeof item === 'string') {
                    // convert older string format to object with unique id
                    return { id: Date.now().toString() + Math.random().toString(36).slice(2), text: item };
                }
                // assume item already has {id, text}
                return item;
            });

            // Render all loaded tasks
            tasks.forEach(renderTask);

            // Save back normalized structure (objects) in case older format was found
            saveTasksToLocalStorage();
        } else {
            // If something unexpected is in localStorage, reset it
            tasks = [];
            saveTasksToLocalStorage();
        }
    }

    // Attach event listeners
    addButton.addEventListener('click', () => addTask());
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') addTask();
    });

    // Initialize by loading saved tasks from localStorage
    loadTasks();
});

