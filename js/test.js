// // main.js
// const gridElement = document.getElementById('grid');
// const resetButton = document.getElementById('resetButton');
// const addMirror45Button = document.getElementById('addMirror45');
// const addMirrorNeg45Button = document.getElementById('addMirrorNeg45');
// const addObstacleButton = document.getElementById('addObstacle');
// const gridSize = 10;
// let grid = [];
// let lightPath;
// let currentMirrorType = null;
// let placingObstacle = false;

// function initGrid() {
//     grid = Array.from({ length: gridSize }, (_, x) =>
//         Array.from({ length: gridSize }, (_, y) => new Cell(x, y, 'empty'))
//     );

//     grid[3][4] = new LightSource(3, 4, 'right');
//     grid[gridSize - 1][gridSize - 1] = new Target(gridSize - 1, gridSize - 1);
    
//     renderGrid();
// }

// function renderGrid() {
//     gridElement.innerHTML = '';

//     grid.forEach(row => {
//         row.forEach(cell => {
//             const cellDiv = document.createElement('div');
//             cellDiv.className = `cell ${cell.type}`;
//             cellDiv.dataset.x = cell.x;
//             cellDiv.dataset.y = cell.y;

//             cellDiv.addEventListener('click', () => {
//                 if (placingObstacle) {
//                     placeObstacle(cell);
//                 } else {
//                     placeMirror(cell);
//                 }
//             });

//             gridElement.appendChild(cellDiv);
//         });
//     });

//     if (lightPath) {
//         lightPath.getCurrentPath().forEach(({ position, orientation }) => {
//             const pathCell = gridElement.querySelector(`.cell[data-x="${position.x}"][data-y="${position.y}"]`);
//             if (pathCell) {
//                 pathCell.classList.add('laser', orientation);
//             }
//         });
//     }
// }

// function placeMirror(cell) {
//     if (currentMirrorType && cell.type === 'empty') {
//         const mirror = new Mirror(cell.x, cell.y, currentMirrorType);
//         grid[cell.x][cell.y] = mirror;
//         currentMirrorType = null;
//         updateLightPath();
//     }
// }

// function placeObstacle(cell) {
//     if (cell.type === 'empty') {
//         const obstacle = new ObstacleCell(cell.x, cell.y);
//         grid[cell.x][cell.y] = obstacle;
//         updateLightPath();
//     }
// }

// function updateLightPath() {
//     const lightSourcePosition = { x: 3, y: 4 };
//     const lightSource = grid[lightSourcePosition.x][lightSourcePosition.y];
//     lightPath = new LightPath(lightSourcePosition, lightSource.direction);
//     lightPath.clearPath();
//     const path = new State(grid, lightSourcePosition).getCurrentLightPath();
//     path.forEach(pos => lightPath.addPosition(pos, lightSource.direction));
//     renderGrid();
// }

// resetButton.addEventListener('click', () => {
//     initGrid();
//     updateLightPath();
// });

// addMirror45Button.addEventListener('click', () => {
//     currentMirrorType = '45';
//     placingObstacle = false;
// });

// addMirrorNeg45Button.addEventListener('click', () => {
//     currentMirrorType = '-45';
//     placingObstacle = false;
// });

// addObstacleButton.addEventListener('click', () => {
//     placingObstacle = true;
//     currentMirrorType = null;
// });

// window.onload = () => {
//     initGrid();
//     updateLightPath();
// };




 // if (nextState.heuristic >= currentState.heuristic) {
    //   console.log("Local maximum reached. Exiting.");
    //   return {
    //     isGoal: false,
    //     finalState: currentState,
    //     finalLightPath: currentState.lightPath,
    //   };
    // }

     // if (!currentState || typeof currentState.getCurrentLightPath !== "function") {
    //   console.error("Invalid state object:", currentState);
    //   throw new Error("State object is not initialized correctly.");
    // }