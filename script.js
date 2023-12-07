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
  // Generate a unique ID for each task
  const uniqueId = `task-${Date.now()}`;
  const taskBlock = createTaskBlock(generateRandomTaskName());
  taskBlock.id = uniqueId; // Set the unique ID
  list.appendChild(taskBlock);

  resizeList(list);
}

function createTaskBlock(text) {
  const taskBlock = document.createElement("div");
  taskBlock.classList.add("task-block");
  taskBlock.draggable = true; // Make the task block draggable

  taskBlock.style.backgroundColor = getRandomColor();

  taskBlock.addEventListener("dragstart", dragStart); // Add dragstart event listener
  taskBlock.addEventListener("dragend", dragEnd);

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

function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const alpha = 0.5; // 50% Transparency
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function dragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
  event.dataTransfer.effectAllowed = "move";
}

function dragOver(event) {
  event.preventDefault();
  event.target.classList.add("highlight"); // Highlight the list
}

function dragEnd(event) {
  // Remove highlight from all lists
  document
    .querySelectorAll(".list")
    .forEach((list) => list.classList.remove("highlight"));
}

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  const draggedElement = document.getElementById(data);

  // Check if the drop target is a task block
  let dropTarget = event.target;
  while (!dropTarget.classList.contains("list") && dropTarget.parentNode) {
    if (dropTarget.classList.contains("task-block")) {
      // If dropped on a task block, insert before this task block
      dropTarget.parentNode.insertBefore(draggedElement, dropTarget);
      resizeList(dropTarget.parentNode);
      return; // Exit the function
    }
    dropTarget = dropTarget.parentNode;
  }

  // If dropped on the list (not on a task block), append to the end of the list
  if (dropTarget.classList.contains("list")) {
    dropTarget.appendChild(draggedElement);
    resizeList(dropTarget);
  }

  // Remove highlight from all lists
  document
    .querySelectorAll(".list")
    .forEach((list) => list.classList.remove("highlight"));
}

// Add dragover and drop event listeners to the lists
chronologicalList.addEventListener("dragover", dragOver);
chronologicalList.addEventListener("drop", drop);
sporadicList.addEventListener("dragover", dragOver);
sporadicList.addEventListener("drop", drop);

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
  let totalHeight = 0;
  Array.from(list.children).forEach((child) => {
    const style = window.getComputedStyle(child);
    const marginTop = parseInt(style.marginTop, 10);
    const marginBottom = parseInt(style.marginBottom, 10);
    totalHeight += child.offsetHeight + marginTop + marginBottom;
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
