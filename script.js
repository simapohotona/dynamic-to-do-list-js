// Wait for the DOM to fully load before running the script
document.addEventListener("DOMContentLoaded", () => {
    // Select DOM elements
    const addButton = document.getElementById("add-task-btn");
    const taskInput = document.getElementById("task-input");
    const taskList = document.getElementById("task-list");

    // Function to add a new task
    function addTask() {
        // Get and trim the input value
        const taskText = taskInput.value.trim();

        // If input is empty, show an alert and stop the function
        if (taskText === "") {
            alert("Please enter a task before adding!");
            return;
        }

        // Create a new list item for the task
        const li = document.createElement("li");
        li.textContent = taskText;

        // Create a remove button for the task
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.className = "remove-btn";

        // Add event to remove the task when button is clicked
        removeBtn.onclick = () => {
            taskList.removeChild(li);
        };

        // Append the button to the list item
        li.appendChild(removeBtn);

        // Add the new list item to the task list
        taskList.appendChild(li);

        // Clear the input field
        taskInput.value = "";
    }

    // Add event listener for the "Add Task" button
    addButton.addEventListener("click", addTask);

    // Add event listener for pressing "Enter" key inside input
    taskInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            addTask();
        }
    });

    // Optionally call addTask() when DOM loads (for testing, usually empty)
    // addTask(); // Uncomment if you want to run a default action on load
});