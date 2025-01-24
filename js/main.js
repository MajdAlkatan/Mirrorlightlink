// main.js

const gridElement = document.getElementById("grid");
const resetButton = document.getElementById("resetButton");
const verticalMoveButtonup = document.getElementById("verticalMoveup");
const horizontalMoveButtonright = document.getElementById(
  "horizontalMoveright"
);
const verticalMoveButtondown = document.getElementById("verticalMovedown");
const horizontalMoveButtonleft = document.getElementById("horizontalMoveleft");
const diagonalMoveButtondownright = document.getElementById(
  "diagonalMovedownright"
);
const diagonalMoveButtondownleft = document.getElementById(
  "diagonalMovedownleft"
);
const diagonalMoveButtonupleft = document.getElementById("diagonalMoveupleft");
const diagonalMoveButtonupright = document.getElementById(
  "diagonalMoveupright"
);
const stageButtons = document.querySelectorAll(".stage-button");
const RotateMirrorButton = document.getElementById("Rotate");
const gridSize = { rows: 13, cols: 6 };

let grid = [];
let lightPath;
let currentStage = 1;
let statesHistory = [];
let currentStateIndex = -1;

const stageConfigurations = {
  1: {
    lightSource: { x: 9, y: 2, direction: "up-right" },
    target: { x: 3, y: 2 },
    mirrors: [
      { x: 6, y: 5, orientation: "180", type: "rotatable", moveRange: [] },
    ],
    obstacles: [
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
      { x: 6, y: 1 },
      { x: 7, y: 1 },
      { x: 8, y: 1 },
      { x: 9, y: 1 },
    ],
  },
  2: {
    lightSource: { x: 5, y: 5, direction: "left" },
    target: { x: 9, y: 3 },
    mirrors: [
      { x: 5, y: 0, orientation: "-60", type: "fixed", moveRange: [] },
      { x: 2, y: 3, orientation: "90", type: "rotatable", moveRange: [] },
    ],
    obstacles: [
      { x: 2, y: 0 },
      { x: 2, y: 5 },
      { x: 10, y: 1 },
      { x: 10, y: 2 },
      { x: 10, y: 3 },
      { x: 10, y: 4 },
      { x: 11, y: 0 },
      { x: 11, y: 1 },
      { x: 11, y: 2 },
      { x: 11, y: 3 },
      { x: 11, y: 4 },
      { x: 11, y: 5 },
    ],
  },
  3: {
    lightSource: { x: 3, y: 1, direction: "down" },
    target: { x: 11, y: 1 },
    mirrors: [
      { x: 3, y: 5, orientation: "45", type: "rotatable", moveRange: [] },
      { x: 11, y: 5, orientation: "-45", type: "rotatable", moveRange: [] },
    ],
    obstacles: [
      { x: 6, y: 1 },
      { x: 7, y: 1 },
      { x: 8, y: 1 },
    ],
  },
  4: {
    lightSource: { x: 3, y: 0, direction: "down" },
    target: { x: 9, y: 0 },
    mirrors: [
      { x: 5, y: 0, orientation: "45", type: "rotatable", moveRange: [] },
      { x: 5, y: 2, orientation: "45", type: "rotatable", moveRange: [] },
      { x: 3, y: 2, orientation: "45", type: "rotatable", moveRange: [] },
      { x: 3, y: 4, orientation: "45", type: "rotatable", moveRange: [] },
      { x: 6, y: 2, orientation: "45", type: "fixed", moveRange: [] },
      { x: 9, y: 4, orientation: "45", type: "fixed", moveRange: [] },
    ],
    obstacles: [
      { x: 3, y: 1 },
      { x: 4, y: 3 },
      { x: 8, y: 0 },
    ],
  },
  5: {
    lightSource: { x: 1, y: 0, direction: "down-right" },
    target: { x: 12, y: 3 },
    mirrors: [
      { x: 5, y: 2, orientation: "90", type: "horizontalMove", moveRange: [{ x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 }] },
      { x: 10, y: 0, orientation: "90", type: "verticalMove", moveRange: [{ x: 10, y: 0 }, { x: 9, y: 0 }, { x: 8, y: 0 }] },
    ],
    obstacles: [
      { x: 5, y: 0 },
      { x: 5, y: 1 },
      { x: 8, y: 3 },
      { x: 8, y: 4 },
      { x: 8, y: 5 },
    ],
  },
  6: {
    lightSource: { x: 2, y: 0, direction: "right" },
    target: { x: 10, y: 5 },
    mirrors: [
      { x: 2, y: 4, orientation: "-45", type: "horizontalmove", moveRange: [[2, 4], [2, 5]] },
      { x: 5, y: 5, orientation: "45", type: "verticalmove", moveRange: [[5, 5], [6, 5], [7, 5]] },
      { x: 8, y: 0, orientation: "45", type: "verticalmove", moveRange: [[8, 0], [7, 0], [6, 0]] },
      { x: 10, y: 1, orientation: "-45", type: "horizontalmove", moveRange: [[10, 1], [10, 0]] },
    ],
    obstacles: [
      { x: 3, y: 2 },
      { x: 3, y: 3 },
      { x: 4, y: 2 },
      { x: 4, y: 3 },
      { x: 6, y: 2 },
      { x: 6, y: 2 },
      { x: 8, y: 2 },
      { x: 8, y: 3 },
      { x: 9, y: 2 },
      { x: 9, y: 3 },
    ],
  },
  7: {
    lightSource: { x: 2, y: 2, direction: "right" },
    target: { x: 11, y: 3 },
    mirrors: [
      { x: 4, y: 5, orientation: "-45", type: "diagonalalmove", moveRange: [[4, 5], [3, 4], [2, 3]] },
      { x: 5, y: 5, orientation: "45", type: "diagonalmove", moveRange: [[5, 5], [6, 4], [7, 3]] },
      { x: 8, y: 0, orientation: "45", type: "diagonalmove", moveRange: [[8, 0], [7, 1], [6, 2]] },
      { x: 9, y: 0, orientation: "-45", type: "diagonalmove", moveRange: [[9, 0], [10, 1], [11, 2]] },
    ],
    obstacles: [
      { x: 4, y: 2 },
      { x: 9, y: 3 },
    ],
  },
  8: {
    lightSource: { x: 11, y: 5, direction: "up-left" },
    target: { x: 5, y: 5 },
    mirrors: [
      { x: 3, y: 1, orientation: "180", type: "horizontalmove", moveRange: [[3, 1], [3, 2], [3, 3], [3, 4]] },
      { x: 8, y: 2, orientation: "90", type: "diagonalmove", moveRange: [[9, 3], [8, 2], [7, 1], [6, 0]] },
    ],
    obstacles: [
      { x: 6, y: 5 },
      { x: 6, y: 4 },
    ],
  },
  9: {
    lightSource: { x: 6, y: 1, direction: "up" },
    target: { x: 8, y: 1 },
    mirrors: [
      { x: 4, y: 0, orientation: "45", type: "diagonalmove", moveRange: [[4, 0], [3, 1], [2, 2]] },
      { x: 2, y: 3, orientation: "-45", type: "diagonalmove", moveRange: [[2, 3], [3, 4], [4, 5]] },
    ],
    obstacles: [
      { x: 4, y: 2 },
      { x: 5, y: 3 },
      { x: 7, y: 3 },
    ],
  },
  10: {
    lightSource: { x: 3, y: 2, direction: "right" },
    target: { x: 8, y: 2 },
    mirrors: [
      { x: 3, y: 0, orientation: "45", type: "verticalmove", moveRange: [[3, 0], [3, 1], [3, 2], [3, 3]] },
    ],
    obstacles: [
      { x: 4, y: 1 },
      { x: 5, y: 0 },
      { x: 6, y: 1 },
      { x: 7, y: 0 },
    ],
  },
};

function initGrid() {
  grid = Array.from({ length: gridSize.rows }, (_, x) =>
    Array.from({ length: gridSize.cols }, (_, y) => new Cell(x, y, "empty"))
  );

  const stageConfig = stageConfigurations[currentStage];

  if (stageConfig) {
    const { x: lightX, y: lightY, direction } = stageConfig.lightSource;
    grid[lightX][lightY] = new LightSource(lightX, lightY, direction);

    const { x: targetX, y: targetY } = stageConfig.target;
    grid[targetX][targetY] = new Target(targetX, targetY);

    stageConfig.mirrors.forEach(({ x, y, orientation, type, moveRange }) => {
      const mirror = new Mirror(x, y, orientation, type, moveRange);
      grid[x][y] = mirror;
    });

    stageConfig.obstacles.forEach(({ x, y }) => {
      const obstacle = new ObstacleCell(x, y);
      grid[x][y] = obstacle;
    });
  }

  renderGrid();
  updateLightPath();
}

function renderGrid() {
  gridElement.innerHTML = "";

  grid.forEach((row) => {
    row.forEach((cell) => {
      const cellDiv = document.createElement("div");
      cellDiv.className = `cell ${cell.type}`;

      if (cell instanceof LightSource) {
        cellDiv.classList.add(cell.currentDirectionClass);
        cellDiv.addEventListener("click", () => {
          cell.rotatelightsource();
          updateLightPath();
        });
      } else if (cell instanceof Mirror) {
        cellDiv.classList.add(cell.currentOrientationClass);
        cellDiv.addEventListener("click", () => {
          // Deselect the previously selected mirror
          grid.flat().forEach((c) => c instanceof Mirror && c.deselect());
          cell.select();
          console.log(`Mirror at (${cell.x}, ${cell.y}) selected.`);
        });
         // Add move range visualization
         const moveRangePath = cell.getMoveRangePath();
         if (moveRangePath) {
           const pathElement = document.createElement("div");
           pathElement.className = "move-range";
           pathElement.style.position = "relative";
           pathElement.style.left = `${cell.x * gridSize.cols}px`;
           pathElement.style.top = `${cell.y * gridSize.rows}px`;
           pathElement.style.width = `${gridSize.cols}px`;
           pathElement.style.height = `${gridSize.rows}px`;
           pathElement.style.border = "1px solid black";
           pathElement.style.pointerEvents = "none";
 
           const pathData = `path(${moveRangePath})`;
           pathElement.innerHTML = `<svg width="100%" height="100%">
             <path d="${pathData}" fill="none" stroke="red" />
           </svg>`;
 
           cellDiv.appendChild(pathElement);
         }
       
      }

      cellDiv.dataset.x = cell.x;
      cellDiv.dataset.y = cell.y;
      gridElement.appendChild(cellDiv);
    });
  });

  if (lightPath) {
    lightPath.getCurrentPath().forEach(({ position, orientation }) => {
      const pathCell = gridElement.querySelector(
        `.cell[data-x="${position.x}"][data-y="${position.y}"]`
      );
      if (pathCell) {
        pathCell.classList.add("laser", orientation);
      }
    });
  }
}

function updateLightPath() {
  const lightSourceConfig = stageConfigurations[currentStage]?.lightSource;

  if (!lightSourceConfig) {
    console.error("Light source configuration not found for current stage.");
    return;
  }

  const lightSourcePosition = {
    x: lightSourceConfig.x,
    y: lightSourceConfig.y,
  };
  const lightSource = grid[lightSourcePosition.x][lightSourcePosition.y];

  if (!(lightSource instanceof LightSource)) {
    console.error("Light source not found at specified position.");
    return;
  }

  lightPath = new LightPath(lightSourcePosition, lightSourceConfig.direction);
  lightPath.clearPath();

  const path = new State(grid, lightSourcePosition).getCurrentLightPaths();
  let targetReached = false;

  for (const pos of path) {
    const cell = grid[pos.x][pos.y];
    if (cell instanceof Target) {
      targetReached = true;
    }
    lightPath.addPosition(pos, lightSource.direction);
  }

  renderGrid();

  if (targetReached) {
    unlockNextStage();
    document.getElementById("winMessage").style.display = "block";
    setTimeout(() => {
      document.getElementById("winMessage").style.display = "none";
      document.querySelector(".main").style.display = "none";
      document.querySelector(".stages").style.display = "grid";
    }, 2000);
  }
}

function unlockNextStage() {
  const nextStageButton = document.querySelector(
    `.stage-button[data-stage="${currentStage + 1}"]`
  );
  if (nextStageButton) {
    nextStageButton.disabled = false;
  }
  currentStage++;
}

function updateMirrorPosition(mirror) {
  if (grid[mirror.initialX] && grid[mirror.initialY]) {
    grid[mirror.initialX][mirror.initialY] = new Cell(
      mirror.initialX,
      mirror.initialY,
      "empty"
    );
  }
  grid[mirror.x][mirror.y] = mirror;
  mirror.initialX = mirror.x;
  mirror.initialY = mirror.y;
  updateLightPath(); // Call updateLightPath here
}

function updateGridAndPath() {
  renderGrid();
  updateLightPath();
}




RotateMirrorButton.addEventListener("click", () => {
  const selectedMirror = getSelectedMirror();
  if (selectedMirror) {
    selectedMirror.rotate();
    updateMirrorPosition(selectedMirror);
    updateLightPath();
  }
});

resetButton.addEventListener("click", () => {
  initGrid();
  updateLightPath();
  const winMessage = document.querySelector(".win-message");
  if (winMessage) {
    winMessage.remove();
  }
});

verticalMoveButtonup.addEventListener("click", () => {
  const selectedMirror = getSelectedMirror();
  if (selectedMirror) {
    selectedMirror.moveVertical("up");
    updateMirrorPosition(selectedMirror);
    updateGridAndPath();
  }
});

horizontalMoveButtonright.addEventListener("click", () => {
  const selectedMirror = getSelectedMirror();
  if (selectedMirror) {
    selectedMirror.moveHorizontal("right");
    updateMirrorPosition(selectedMirror);
    updateGridAndPath();
  }
});

verticalMoveButtondown.addEventListener("click", () => {
  const selectedMirror = getSelectedMirror();
  if (selectedMirror) {
    selectedMirror.moveVertical("down");
    updateMirrorPosition(selectedMirror);
    updateGridAndPath();
  }
});

horizontalMoveButtonleft.addEventListener("click", () => {
  const selectedMirror = getSelectedMirror();
  if (selectedMirror) {
    selectedMirror.moveHorizontal("left");
    updateMirrorPosition(selectedMirror);
    updateGridAndPath();
  }
});

diagonalMoveButtondownright.addEventListener("click", () => {
  const selectedMirror = getSelectedMirror();
  if (selectedMirror) {
    selectedMirror.moveDiagonal("down-right");
    updateMirrorPosition(selectedMirror);
    updateGridAndPath();
  }
});
diagonalMoveButtonupright.addEventListener("click", () => {
  const selectedMirror = getSelectedMirror();
  if (selectedMirror) {
    selectedMirror.moveDiagonal("up-right");
    updateMirrorPosition(selectedMirror);
    updateGridAndPath();
  }
});
diagonalMoveButtondownleft.addEventListener("click", () => {
  const selectedMirror = getSelectedMirror();
  if (selectedMirror) {
    selectedMirror.moveDiagonal("down-left");
    updateMirrorPosition(selectedMirror);
    updateGridAndPath();
  }
});
diagonalMoveButtonupleft.addEventListener("click", () => {
  const selectedMirror = getSelectedMirror();
  if (selectedMirror) {
    selectedMirror.moveDiagonal("up-left");
    updateMirrorPosition(selectedMirror);
    updateGridAndPath();
  }
});

function getSelectedMirror() {
  return grid.flat().find((cell) => cell instanceof Mirror && cell.isSelected);
}

stageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    console.log("Stage button clicked:", button.dataset.stage);
    currentStage = parseInt(button.dataset.stage);
    document.getElementById("winMessage").style.display = "none";
    initGrid();
    renderGrid();
    document.querySelector(".main").style.display = "flex";
    document.querySelector(".stages").style.display = "none";
  });
});



