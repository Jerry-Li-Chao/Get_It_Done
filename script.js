// const addButton = document.querySelector("#add-button");
const chronologicalList = document.getElementById("chronological-list");
const sporadicList = document.getElementById("sporadic-list");

let isAKeyPressed = false;

// Event listener to detect when 'a' key is pressed
document.addEventListener("keydown", function (event) {
  if (event.key === "a") {
    isAKeyPressed = true;
  }
});

// Event listener to detect when 'a' key is released
document.addEventListener("keyup", function (event) {
  if (event.key === "a") {
    isAKeyPressed = false;
  }
});

// Function to add task if 'a' key is pressed when list is clicked
function tryAddTask(event, list) {
  if (isAKeyPressed) {
    addTaskBlock(list);
  }
}

chronologicalList.addEventListener("click", addChronologicalTask);
sporadicList.addEventListener("click", addSporadicTask);

function addChronologicalTask(event) {
  tryAddTask(event, chronologicalList);
}

function addSporadicTask(event) {
  tryAddTask(event, sporadicList);
}

function addTaskBlock(list) {
  const taskBlock = createTaskBlock(generateRandomTaskName());
  list.appendChild(taskBlock);

  resizeList(list);
}

function createTaskBlock(text) {
  const taskBlock = document.createElement("div");
  taskBlock.classList.add("task-block");

  // Create a span to hold the task text separately from the buttons.
  const taskText = document.createElement("span");
  taskText.classList.add("task-text");
  taskText.textContent = text;
  taskBlock.appendChild(taskText);

  const editButton = document.createElement("button");
  editButton.innerText = "Edit";
  editButton.addEventListener("click", function () {
    editTaskBlock(taskBlock);
  });
  taskBlock.appendChild(editButton);

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Delete";
  deleteButton.addEventListener("click", function () {
    deleteTaskBlock(taskBlock);
  });
  taskBlock.appendChild(deleteButton);

  return taskBlock;
}

function editTaskBlock(taskBlock) {
  const newText = prompt(
    "Enter new task name:",
    taskBlock.firstChild.textContent
  );
  if (newText !== null) {
    taskBlock.firstChild.textContent = newText;
  }
}

function deleteTaskBlock(taskBlock) {
  const parentList = taskBlock.parentNode;
  taskBlock.remove();
  resizeList(parentList); // Ensure we resize the list after removing the block.
}

function resizeList(list) {
  // Instead of using scrollHeight, we calculate the total height of all children.
  let totalHeight = 0;
  Array.from(list.children).forEach((child) => {
    totalHeight += child.offsetHeight;
  });
  list.style.height = `${Math.max(200, totalHeight)}px`;
}

function generateRandomTaskName() {
  const adjectives = [
    "important",
    "urgent",
    "critical",
    "relaxing",
    "fun",
    "creative",
  ];
  const nouns = ["meeting", "task", "project", "workout", "break", "hobby"];
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${randomAdjective} ${randomNoun}`;
}
