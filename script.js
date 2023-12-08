// const addButton = document.querySelector("#add-button");
const chronologicalList = document.getElementById("chronological-list");
const sporadicList = document.getElementById("sporadic-list");

let isAKeyPressed = false;

// ---------------- TIME BLOCK FUNCTIONS --------------------------------

function generateTimeBlocks() {
  const list = document.getElementById("chronological-list");

  for (let hour = 0; hour < 24; hour++) {
    const timeContainer = document.createElement("div");
    timeContainer.classList.add("time-container");

    const timeLabel = document.createElement("div");
    timeLabel.classList.add("time-label");
    let hourFormatted = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    let amPm = hour < 12 ? "AM" : "PM";
    timeLabel.textContent = `${hourFormatted}:00 ${amPm}`;
    timeContainer.appendChild(timeLabel);

    const timeBlock = document.createElement("div");
    timeBlock.classList.add("time-block");
    timeContainer.appendChild(timeBlock);

    list.appendChild(timeContainer);
  }
  resizeList(list);
}

// Call this function to initialize the chronological list with time blocks
generateTimeBlocks();

// ---------------- TIME BLOCK FUNCTIONS --------------------------------

// ---------------- TASK BLOCK FUNCTIONS --------------------------------

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
    // Generate a random start time between 0 and 23
    const startTime = Math.floor(Math.random() * 24);

    // Generate a random duration between 0.5 and 2 hours, assuming you want at least 30 minutes blocks
    // This will give you a random duration in increments of 30 minutes, up to 2 hours.
    const duration = 0.5 + Math.floor(Math.random() * 4) * 0.5;

    // Now call addTaskBlock with the list, random start time, and random duration
    addTaskBlock(list, startTime, duration);
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

function addTaskBlock(list, startTime, duration) {
  const container = document.createElement("div");
  container.className = "task-block-container";

  console.log(startTime, duration);
  // Generate a unique ID for each task
  const uniqueId = `task-${Date.now()}`;
  const taskBlock = createTaskBlock(generateRandomTaskName());
  taskBlock.id = uniqueId; // Set the unique ID
  container.appendChild(taskBlock);

  const hourHeight = 82;
  const startTop = startTime * hourHeight;
  const blockHeight = duration * hourHeight;

  container.style.top = `${startTop}px`; // Position based on the start time
  container.style.height = `${blockHeight}px`; // Height based on the duration
  container.style.left = "50px"; // Align to the left edge of the chronological list
  container.style.width = "70%"; // Set width relative to the parent element
  container.style.zIndex = 10; // Ensure task block overlays on top of time blocks

  makeResizable(container, chronologicalList); // Pass the task block and its container list to make it resizable

  list.appendChild(container);

  resizeList(list);
}

function makeResizable(container, list) {
  const minHeight = 10; // Minimum height of a task block in pixels

  // Function to handle resizing from the top
  function resizeTop(event) {
    const startY = event.clientY;
    const startHeight = parseInt(getComputedStyle(container).height, 10);
    const startTop = parseInt(container.style.top, 10) || 0;

    function onMouseMove(e) {
      const dy = e.clientY - startY;
      let newHeight = startHeight - dy;
      let newTop = startTop + dy;

      // Check for minimum height and top edge of the list
      newHeight = Math.max(newHeight, minHeight);
      newTop = Math.max(newTop, 0);

      // Update height and top position
      container.style.height = `${newHeight}px`;
      container.style.top = `${newTop}px`;
    }

    function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  // Function to handle the resize from bottom
  function resizeBottom(event) {
    const startY = event.clientY;
    const startHeight = parseInt(getComputedStyle(container).height, 10);

    function onMouseMove(e) {
      let newHeight = startHeight + e.clientY - startY;

      // Check for minimum height and bottom edge of the list
      newHeight = Math.max(newHeight, minHeight);
      newHeight = Math.min(newHeight, list.offsetHeight - container.offsetTop);

      container.style.height = `${newHeight}px`;
    }

    function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  // Create a top grip element for resizing
  const gripTop = document.createElement("div");
  gripTop.className = "grip top-grip";
  gripTop.addEventListener("mousedown", function (event) {
    event.stopPropagation();
    resizeTop(event);
  });

  // Create a bottom grip element for resizing
  const gripBottom = document.createElement("div");
  gripBottom.className = "grip bottom-grip";
  gripBottom.addEventListener("mousedown", function (event) {
    // Prevent this event from triggering drag-and-drop
    event.stopPropagation();
    // Initialize resizing
    resizeBottom(event);
  });

  container.appendChild(gripTop);
  container.appendChild(gripBottom);
}

function createTaskBlock(text) {
  const taskBlock = document.createElement("div");
  taskBlock.classList.add("task-block");
  //   taskBlock.draggable = true; // Make the task block draggable

  taskBlock.style.backgroundColor = getRandomColor();

  //   // Change the event listener to only allow dragging on the main body of the task block
  //   taskBlock.addEventListener("mousedown", function (event) {
  //     if (event.target === taskBlock) {
  //       // Only initiate drag if the event target is the task block itself
  //       taskBlock.draggable = true;
  //     } else {
  //       taskBlock.draggable = false; // Prevent dragging when clicking on grips or other elements
  //     }
  //   });

  //   taskBlock.addEventListener("dragstart", dragStart);
  //   taskBlock.addEventListener("dragend", dragEnd);

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

// function dragStart(event) {
//   event.dataTransfer.setData("text/plain", event.target.id);
//   event.dataTransfer.effectAllowed = "move";
// }

// function dragOver(event) {
//   event.preventDefault();
//   event.target.classList.add("highlight"); // Highlight the list
// }

// function dragEnd(event) {
//   // Remove highlight from all lists
//   document.querySelectorAll(".list").forEach((list) => {
//     list.classList.remove("highlight");
//     resizeList(list); // Recalculate and adjust the height of each list
//   });
// }

// // Dropping a Task-block to another List
// function drop(event) {
//   event.preventDefault();
//   const data = event.dataTransfer.getData("text");
//   const draggedElement = document.getElementById(data);

//   // Check if the drop target is a task block
//   let dropTarget = event.target;
//   while (!dropTarget.classList.contains("list") && dropTarget.parentNode) {
//     if (dropTarget.classList.contains("task-block")) {
//       // If dropped on a task block, insert before this task block
//       dropTarget.parentNode.insertBefore(draggedElement, dropTarget);
//       resizeList(dropTarget.parentNode);
//       return; // Exit the function
//     }
//     dropTarget = dropTarget.parentNode;
//   }

//   // If dropped on the list (not on a task block), append to the end of the list
//   if (dropTarget.classList.contains("list")) {
//     dropTarget.appendChild(draggedElement);
//     resizeList(dropTarget);
//   }

//   // Remove highlight from all lists
//   document
//     .querySelectorAll(".list")
//     .forEach((list) => list.classList.remove("highlight"));
// }

// // Add dragover and drop event listeners to the lists
// chronologicalList.addEventListener("dragover", dragOver);
// chronologicalList.addEventListener("drop", drop);
// sporadicList.addEventListener("dragover", dragOver);
// sporadicList.addEventListener("drop", drop);

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

// ---------------- TASK BLOCK FUNCTIONS --------------------------------

// ---------------- HELPER FUNCTIONS --------------------------------
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

function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const alpha = 0.5; // 50% Transparency
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
// ---------------- HELPER FUNCTIONS --------------------------------
