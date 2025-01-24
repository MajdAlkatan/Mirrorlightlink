
class State {
  constructor(grid, lightPosition) {
    this.grid = grid;
    this.lightPosition = lightPosition;
    this.isWon = false;
    this.previousDirection = null;
  }

  getCurrentLightPath() {
    const path = [];
    let currentPos = { ...this.lightPosition };
    let direction = this.lightPosition.direction; // Ensure you are using the direction from lightPosition

    while (true) {
      // Check bounds
      if (
        currentPos.x < 0 ||
        currentPos.x >= this.grid.length ||
        currentPos.y < 0 ||
        currentPos.y >= this.grid[0].length
      ) {
        break;
      }

      const cell = this.grid[currentPos.x][currentPos.y];

      // Log current position and cell for debugging
      console.log(`Current Position: (${currentPos.x}, ${currentPos.y}), Cell:`, cell);

      path.push({ ...currentPos });

      if (cell instanceof Target) {
        this.isWon = true;
        break;
      }

      if (
        cell instanceof LightSource &&
        currentPos.x === this.lightPosition.x &&
        currentPos.y === this.lightPosition.y &&
        path.length > 1
      ) {
        break;
      }

      if (cell instanceof ObstacleCell) {
        break;
      }

      if (cell instanceof Mirror) {
        const newDirection = getNextDirection(direction, cell.orientation);
        if (newDirection === this.previousDirection) {
          break;
        }
        this.previousDirection = direction;
        direction = newDirection;
      } else {
        this.previousDirection = direction;
      }

      // Move the light
      currentPos = moveLight(currentPos, direction);

      // Log the new position after moving
      console.log(`New Position after moving: (${currentPos.x}, ${currentPos.y})`);
    }
    return path;
  }
  getCurrentLightPaths() {
    const path = [];
    let currentPos = { ...this.lightPosition };
    let direction = this.grid[currentPos.x][currentPos.y].direction;

    while (true) {
      // Check bounds
      if (
        currentPos.x < 0 ||
        currentPos.x >= this.grid.length ||
        currentPos.y < 0 ||
        currentPos.y >= this.grid[0].length
      ) {
        break;
      }

      const cell = this.grid[currentPos.x][currentPos.y];

      // Log current position and cell for debugging
      console.log(`Current Position: (${currentPos.x}, ${currentPos.y}), Cell:`, cell);

      path.push({ ...currentPos });

      if (cell instanceof Target) {
        this.isWon = true;
        break;
      }

      if (
        cell instanceof LightSource &&
        currentPos.x === this.lightPosition.x &&
        currentPos.y === this.lightPosition.y &&
        path.length > 1
      ) {
        break;
      }

      if (cell instanceof ObstacleCell) {
        break;
      }

      if (cell instanceof Mirror) {
        const newDirection = getNextDirection(direction, cell.orientation);
        if (newDirection === this.previousDirection) {
          break;
        }
        this.previousDirection = direction;
        direction = newDirection;
      } else {
        this.previousDirection = direction;
      }

      // Move the light
      currentPos = moveLight(currentPos, direction);

      // Log the new position after moving
      console.log(`New Position after moving: (${currentPos.x}, ${currentPos.y})`);
    }
    return path;
  }

}
function moveLights(position,direction) {
  const moves = {
    "right": { x: 0, y: 1 },
    "down": { x: 1, y: 0 },
    "left": { x: 0, y: -1 },
    "up": { x: -1, y: 0 },
    "down-right": { x: 1, y: 1 },
    "down-left": { x: 1, y: -1 },
    "up-right": { x: -1, y: 1 },
    "up-left": { x: -1, y: -1 },
  };
  const move = moves[direction];
  return { x: position.x + move.x, y: position.y + move.y };
}
function moveLight(position, direction) {
  const moves = {
    "right": { x: 0, y: 1 },
    "down": { x: 1, y: 0 },
    "left": { x: 0, y: -1 },
    "up": { x: -1, y: 0 },
    "down-right": { x: 1, y: 1 },
    "down-left": { x: 1, y: -1 },
    "up-right": { x: -1, y: 1 },
    "up-left": { x: -1, y: -1 },
  };

  if (!moves[direction]) {
    console.error(`Invalid direction: ${direction}`);
  }

  const move = moves[direction];
  return { x: position.x + move.x, y: position.y + move.y };
}

function getNextDirection(currentDirection, mirrorOrientation) {
  const directions = {
    "45": {
      "up": "right",
      "down": "left",
      "left": "down",
      "right": "up",
      "up-right": "down",
      "down-right": "up",
      "up-left": "down",
      "down-left": "up",
    },
    "-45": {
      up: "left",
      down: "right",
      left: "up",
      right: "down",
      "up-right": "down",
      "down-right": "up-left",
      "up-left": "down-right",
      "down-left": "up-right",
    },
    "60": {
      up: "down-left",
      down: "up-left",
      left: "down-right",
      right: "up-left",
      "up-right": "left",
      "down-right": "up",
      "up-left": "down",
      "down-left": "right",
    },
    "-60": {
      up: "down-right",
      down: "up-left",
      left: "up-right",
      right: "down-left",
      "up-right": "down",
      "down-right": "left",
      "up-left": "right",
      "down-left": "up",
    },
    "90": {
      "up-left": "up-right",
      "down-left": "down-right",
      "down-right": "down-left",
      "up-right": "up-left",
    },
    "180": {
      up: "down",
      down: "up",
      left: "right",
      right: "left",
      "up-left": "down-left",
      "down-left": "up-left",
      "down-right": "up-right",
      "up-right": "down-right",
    },
  };
  return directions[mirrorOrientation][currentDirection] || currentDirection;
}
const stageConfigurationss = {
  1: {
    lightSource: { x: 9, y: 2, direction: "up-right" },
    target: { x: 3, y: 2 },
    mirrors: [
      {
        x: 6,
        y: 5,
        orientation: "180",
        type: "rotatable",
        moveRange: [{ x: 6, y: 5 }],
      },
    ],
    obstacles: [
      { x: 3, y: 1 },
      { x: 4, y: 2 },
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
      {
        x: 5,
        y: 0,
        orientation: "-60",
        type: "fixed",
        moveRange: [{ x: 5, y: 0 }],
      },
      {
        x: 2,
        y: 3,
        orientation: "90",
        type: "rotatable",
        moveRange: [
          { x: 2, y: 3 },
          { x: 2, y: 4 },
        ],
      },
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
    lightSource: { x: 3, y: 1, direction: "right" },
    target: { x: 11, y: 1 },
    mirrors: [
      {
        x: 3,
        y: 5,
        orientation: "45",
        type: "rotatable",
        moveRange: [{ x: 3, y: 5 }],
      },
      {
        x: 11,
        y: 5,
        orientation: "-45",
        type: "rotatable",
        moveRange: [{ x: 11, y: 5 }],
      },
    ],
    obstacles: [
      { x: 6, y: 1 },
      { x: 7, y: 1 },
      { x: 8, y: 1 },
    ],
  },
  4: {
    lightSource: { x: 5, y: 0, direction: "down" },
    target: { x: 9, y: 5 },
    mirrors: [
      {
        x: 7,
        y: 3,
        orientation: "45",
        type: "rotatable",
        moveRange: [{ x: 7, y: 3 }]
      },
      {
        x: 3,
        y: 5,
        orientation: "90",
        type: "fixed",
        moveRange: [{ x: 3, y: 5 }]
      }
    ],
    obstacles: [
      { x: 4, y: 2 },
      { x: 4, y: 3 },
      { x: 4, y: 4 },
      { x: 4, y: 5 },
      { x: 4, y: 6 },
      { x: 4, y: 7 }
    ]
  },

  5: {
    lightSource: { x: 0, y: 0, direction: "down" },
    target: { x: 4, y: 3 },
    mirrors: [
      {
        x: 4,
        y: 0,
        orientation: "180",
        type: "rotatable",
      },
    ],
    obstacles: [

    ]
  },


  6: {
    lightSource: { x: 6, y: 0, direction: "down-right" },
    target: { x: 0, y: 0 },
    mirrors: [
      {
        x: 5,
        y: 5,
        orientation: "90",
        type: "rotatable",
        moveRange: [{ x: 5, y: 5 }]
      },
      {
        x: 8,
        y: 2,
        orientation: "45",
        type: "rotatable",
        moveRange: [{ x: 10, y: 5 }]
      }
    ],
    obstacles: [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 6, y: 2 },
      { x: 6, y: 3 },
      { x: 6, y: 1 },
    ]
  },
  7: {
    lightSource: { x: 3, y: 0, direction: "down" },
    target: { x: 9, y: 0 },
    mirrors: [
      {
        x: 5,
        y: 0,
        orientation: "-45",
        type: "rotatable",
        moveRange: [
          { x: 5, y: 0 },
          { x: 5, y: 1 },
        ],
      },
      {
        x: 5,
        y: 2,
        orientation: "45",
        type: "rotatable",
        moveRange: [
          { x: 5, y: 2 },
          { x: 5, y: 3 },
        ],
      },
      {
        x: 3,
        y: 2,
        orientation: "45",
        type: "rotatable",
        moveRange: [{ x: 3, y: 2 }],
      },
      {
        x: 3,
        y: 4,
        orientation: "45",
        type: "rotatable",
        moveRange: [{ x: 3, y: 4 }],
      },
      {
        x: 6,
        y: 2,
        orientation: "45",
        type: "fixed",
        moveRange: [{ x: 6, y: 2 }],
      },
      {
        x: 9,
        y: 4,
        orientation: "45",
        type: "fixed",
        moveRange: [{ x: 9, y: 4 }],
      },
    ],
    obstacles: [
      { x: 3, y: 1 },
      { x: 4, y: 3 },
      { x: 8, y: 0 },
    ],
  },
}

//todo:
class StateManager {

  constructor(gridWidth, gridHeight, lightSourcePosition, stageConfigurationss, currentStagee) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.lightSourcePosition = lightSourcePosition;
    this.stageConfigurationss = stageConfigurationss;
    this.currentStagee = currentStagee;
    const currentStage = this.stageConfigurationss[this.currentStagee];

    this.lightSourcePosition = currentStage.lightSource;
    this.parent = null

    this.initialGrid = this.createEmptyGrid();
    this.initializeGridWithObjects();
  }
  aStarSearch() {
    //priorityQueue
    const openSet = [];
    //
    const closedSet = new Set();
  
    openSet.push({
        state: this.cloneState(),
        path: [],
        gCost: 0, 
        hCost: this.calculateHeuristicEuclidean([]),
        fCost: 0 + this.calculateHeuristicEuclidean([]),
    });
  
    while (openSet.length > 0) {
        openSet.sort((a, b) => {
            if (a.fCost === b.fCost) {
                return b.gCost - a.gCost;
            }
            return a.fCost - b.fCost; 
        });
  
        
        const { state, path, gCost, fCost,totalCost } = openSet.shift();
        const stateKey = this.getStateKey(state);
  
        if (closedSet.has(stateKey)) continue;
        closedSet.add(stateKey);
  
        if (this.isGoalState(state.lightPath)) {
            return {
                path: [...path, state], 
                gcost: gCost,
                fcost:fCost,  
                totalCost:fCost+gCost,         
                success: true,        
            };
        }
  
        const nextStates = this.GetNextState();
        for (const nextState of nextStates) {
            const nextStateKey = this.getStateKey(nextState);
  
            if (closedSet.has(nextStateKey)) continue;
  
            const nextPath = [...path, state];
            const transitionCost = this.calculateTransitionCost(state, nextState);
            const nextGCost = gCost + transitionCost;
            const nextHCost = this.calculateHeuristicEuclidean(nextState.lightPath); 
            const nextFCost = nextGCost + nextHCost; 
  
            openSet.push({
                state: nextState,
                path: nextPath,
                gCost: nextGCost,
                hCost: nextHCost,
                fCost: nextFCost,
            });
        }
    }
  
    return { found: false };
}


  uniformCostSearch() {
    const priorityQueue = [];
    const visited = new Set();

    priorityQueue.push({
      state: this.cloneState(),
      path: [],
      cost: 0,

    });

    while (priorityQueue.length > 0) {

      priorityQueue.sort((a, b) => a.cost - b.cost);


      const { state, path, cost } = priorityQueue.shift();
      const stateKey = this.getStateKey(state);


      if (visited.has(stateKey)) {
        continue;
      }

      visited.add(stateKey);

      if (this.isGoalState(state.lightPath)) {
        return {
          path: [...path, state],
          cost: cost,
          found: true,
        };
      }


      const nextStates = this.generateAllStates();

      for (const nextState of nextStates) {
        const nextStateKey = this.getStateKey(nextState);

        if (!visited.has(nextStateKey)) {
          const nextPath = [...path, state];
          const transitionCost = this.calculateTransitionCost(state, nextState);
          const nextCost = cost + transitionCost;
          priorityQueue.push({
            state: nextState,
            path: nextPath,
            cost: nextCost,
          });
        }
      }
    }

    return { found: false };
  }

  createEmptyGrid() {
    return Array.from({ length: this.gridHeight }, () => Array(this.gridWidth).fill("[     ]"));
  }

  initializeGridWithObjects() {
    this.initialGrid = this.createEmptyGrid();

    if (this.lightSourcePosition && this.lightSourcePosition.x < this.gridHeight && this.lightSourcePosition.y < this.gridWidth) {
      this.initialGrid[this.lightSourcePosition.x][this.lightSourcePosition.y] = '[   L   ]';
    }

    const stageConfig = this.stageConfigurationss[this.currentStagee];

    if (stageConfig) {
      const { x: targetX, y: targetY } = stageConfig.target;
      if (targetX < this.gridHeight && targetY < this.gridWidth) {
        this.initialGrid[targetX][targetY] = '[   T   ]';
      }

      stageConfig.mirrors.forEach(({ x, y, orientation }) => {
        if (x < this.gridHeight && y < this.gridWidth) {
          this.initialGrid[x][y] = `[ M${orientation} ]`;
        }
      });

      stageConfig.obstacles.forEach(({ x, y }) => {
        if (x < this.gridHeight && y < this.gridWidth) {
          this.initialGrid[x][y] = '[   O   ]';
        }
      });
    }
  }

  getCurrentLightPath() {
    const path = [];
    let currentPos = { ...this.lightSourcePosition };
    let direction = this.lightSourcePosition.direction;

    while (true) {
      currentPos = moveLight(currentPos, direction);

      if (
        currentPos.x < 0 || currentPos.x >= this.gridHeight ||
        currentPos.y < 0 || currentPos.y >= this.gridWidth
      ) break;

      const cell = this.initialGrid[currentPos.x][currentPos.y];

      path.push({ ...currentPos });

      if (cell === '[   O   ]' || cell === '[   T   ]') break;

      if (cell.startsWith('[ M')) {
        const mirrorOrientation = this.stageConfigurationss[this.currentStagee].mirrors.find(m => m.x === currentPos.x && m.y === currentPos.y).orientation;
        direction = getNextDirection(direction, mirrorOrientation);
      }
    }

    return path;
  }

  updateGridWithLightPath(path) {
    const gridCopy = this.createEmptyGrid();

    path.forEach(pos => {
      if (gridCopy[pos.x][pos.y] === '[     ]') {
        gridCopy[pos.x][pos.y] = '[   *   ]';
      }
    });

    const stageConfig = this.stageConfigurationss[this.currentStagee];

    if (this.lightSourcePosition && this.lightSourcePosition.x < this.gridHeight && this.lightSourcePosition.y < this.gridWidth) {
      gridCopy[this.lightSourcePosition.x][this.lightSourcePosition.y] = '[   L   ]';
    }

    const { x: targetX, y: targetY } = stageConfig.target;
    if (targetX < this.gridHeight && targetY < this.gridWidth) {
      gridCopy[targetX][targetY] = '[   T   ]';
    }

    stageConfig.mirrors.forEach(({ x, y, orientation }) => {
      if (x < this.gridHeight && y < this.gridWidth) {
        gridCopy[x][y] = `[ M${orientation} ]`;
      }
    });

    stageConfig.obstacles.forEach(({ x, y }) => {
      if (x < this.gridHeight && y < this.gridWidth) {
        gridCopy[x][y] = '[   O   ]';
      }
    });

    return gridCopy;
  }

  updateCurrentStage(stageId) {
    if (this.stageConfigurationss[stageId]) {
      this.currentStagee = stageId;
      this.initializeGridWithObjects();
    } else {
      console.error(`Stage ${stageId} does not exist`);
    }
  }

  GetNextState() {
    const states = [];
    states.push(...this.getAllLightSourceRotations());
    states.push(...this.getAllMirrorRotations());
    states.push(...this.getAllMirrorMoves());

    return states.map(state => ({
      ...state,
      isGoal: this.isGoalState(state.lightPath),
      stageId: this.currentStagee
    }));
  }

  isPositionValid(position) {
    return position.x >= 0 && position.x < this.gridHeight && position.y >= 0 && position.y < this.gridWidth &&
      !(this.initialGrid[position.x][position.y] instanceof ObstacleCell);
  }

  getAllLightSourceRotations() {
    const states = [];
    const lightRotations = ['up', 'down', 'left', 'right', 'up-left', 'up-right', 'down-left', 'down-right'];
    const originalDirection = this.lightSourcePosition.direction;

    for (const rotation of lightRotations) {
      this.lightSourcePosition.direction = rotation;
      const path = this.getCurrentLightPath();
      const gridWithPath = this.updateGridWithLightPath(path);
      states.push({
        grid: gridWithPath,
        lightSourcePosition: { ...this.lightSourcePosition },
        lightPath: path
      });
    }

    this.lightSourcePosition.direction = originalDirection;

    return states;
  }
  getAllMirrorMoves() {
    const states = [];

    for (let x = 0; x < this.gridHeight; x++) {
      for (let y = 0; y < this.gridWidth; y++) {
        const cell = this.initialGrid[x][y];
        if (cell instanceof Mirror) {
          const originalPosition = { x: cell.x, y: cell.y };

          // Try all possible directions for the mirror to move
          const directions = ['up', 'down', 'left', 'right', 'up-left', 'up-right', 'down-left', 'down-right'];
          for (const direction of directions) {
            const newPosition = {
              x: originalPosition.x + (direction.includes('up') ? -1 : direction.includes('down') ? 1 : 0),
              y: originalPosition.y + (direction.includes('left') ? -1 : direction.includes('right') ? 1 : 0)
            };

            if (this.isPositionValid(newPosition)) {
              cell.move(direction); // Move the mirror
              const newState = this.cloneState();
              states.push(newState);
              cell.resetPosition(); // Reset to original position
            }
          }
        }
      }
    }

    return states;
  }

  getAllMirrorRotations() {
    const states = [];
    const mirrorOrientations = ['45', '-45', '60', '-60', '90', '180'];
    const stageConfig = this.stageConfigurationss[this.currentStagee];

    for (const mirror of stageConfig.mirrors) {
      if (mirror.type === "rotatable") {
        const originalOrientation = mirror.orientation;

        for (const orientation of mirrorOrientations) {
          mirror.orientation = orientation;
          const path = this.getCurrentLightPath();
          const gridWithPath = this.updateGridWithLightPath(path);
          states.push({
            grid: gridWithPath,
            lightSourcePosition: { ...this.lightSourcePosition },
            lightPath: path,
            mirrors: JSON.parse(JSON.stringify(stageConfig.mirrors))
          });
        }

        mirror.orientation = originalOrientation;
      }
    }

    return states;
  }
  generateAllStates() {
    const states = []; // Collect all possible states
    const lightRotations = ['up', 'down', 'left', 'right', 'up-left', 'up-right', 'down-left', 'down-right'];
    const mirrorOrientations = ['45', '-45', '60', '-60', '90', '180'];

    for (const lightRotation of lightRotations) {
      this.lightSourcePosition.direction = lightRotation;

      const stageConfig = this.stageConfigurationss[this.currentStagee];
      const mirrors = stageConfig.mirrors;

      this.rotateMirrorsRecursively(mirrors, 0, mirrorOrientations, states);
    }

    console.log(`Generated ${states.length} states.`);
    return states;
  }

  rotateMirrorsRecursively(mirrors, index, orientations, states) {
    if (index === mirrors.length) {
      const path = this.getCurrentLightPath();

      // Check if the light path intersects with any mirror
      const stageConfig = this.stageConfigurationss[this.currentStagee];
      const mirrorsHit = path.some(pos =>
        stageConfig.mirrors.some(mirror => mirror.x === pos.x && mirror.y === pos.y)
      );

      if (mirrorsHit) {
        const gridWithPath = this.updateGridWithLightPath(path);
        const isGoal = this.isGoalState(path);

        states.push({
          grid: gridWithPath,
          lightSourcePosition: { ...this.lightSourcePosition },
          lightPath: path,
          mirrors: JSON.parse(JSON.stringify(mirrors)),
          isGoal: isGoal,
        });
      }

      return;
    }

    const currentMirror = mirrors[index];
    const originalOrientation = currentMirror.orientation;

    if (currentMirror.type === "rotatable") {
      for (const orientation of orientations) {
        currentMirror.orientation = orientation;
        this.rotateMirrorsRecursively(mirrors, index + 1, orientations, states);
      }
      currentMirror.orientation = originalOrientation; // Restore original orientation
    } else {
      this.rotateMirrorsRecursively(mirrors, index + 1, orientations, states);
    }
  }

  isGoalState(lightPath) {
    const stageConfig = this.stageConfigurationss[this.currentStagee];
    const { x: targetX, y: targetY } = stageConfig.target;

    if (!lightPath || lightPath.length === 0) {
      console.log("isGoalState: No light path.");
      return false;
    }

    const lastPoint = lightPath[lightPath.length - 1];
    console.log(`isGoalState: Last point = (${lastPoint.x}, ${lastPoint.y}), Target = (${targetX}, ${targetY})`);
    return lastPoint.x === targetX && lastPoint.y === targetY;
  }

  breadthFirstSearch() {
    const queue = [{ state: this.cloneState(), path: [] }];
    const visited = new Set();

    while (queue.length > 0) {
      const { state, path } = queue.shift();
      const stateKey = this.getStateKey(state);

      if (visited.has(stateKey)) continue;
      visited.add(stateKey);

      if (this.isGoalState(state.lightPath)) {
        return { path: [...path, state], found: true };
      }

      const nextStates = this.generateAllStates();
      for (const nextState of nextStates) {
        queue.push({ state: nextState, path: [...path, state] });
      }
    }

    return { found: false };
  }
 




  evaluate(lightPath) {
    const stageConfig = this.stageConfigurationss[this.currentStagee];
    const { x: targetX, y: targetY } = stageConfig.target;

    if (!lightPath || lightPath.length === 0) {
      return Infinity; // No path means very high cost
    }

    const lastPoint = lightPath[lightPath.length - 1];
    const distanceToTarget = Math.sqrt(
      Math.pow(lastPoint.x - targetX, 2) + Math.pow(lastPoint.y - targetY, 2)
    );

    // Cost is inversely proportional to proximity to the target
    return distanceToTarget + 1; // Add 1 to avoid division by zero
  }
  depthFirstSearch() {
    const stack = [{ state: this.cloneState(), path: [] }];
    const visited = new Set();

    while (stack.length > 0) {
      const { state, path } = stack.pop();
      const stateKey = this.getStateKey(state);

      if (visited.has(stateKey)) continue;
      visited.add(stateKey);

      if (this.isGoalState(state.lightPath)) {
        return { path: [...path, state], found: true };
      }

      const nextStates = this.GetNextState();
      for (const nextState of nextStates) {
        nextState.parent = state
        stack.push({ state: nextState, path: [...path, state] });
      }
    }

    return { found: false };
  }

  // Breadth-First Search (BFS)

  
  calculateTransitionCost(parentState, childState) {
    let cost = 0;

    for (let i = 0; i < parentState.grid.length; i++) {
      for (let j = 0; j < parentState.grid[i].length; j++) {
        if (parentState.grid[i][j] !== childState.grid[i][j]) {
          cost++;

          if (parentState.grid[i][j] === '[     ]' && childState.grid[i][j] === '[   *   ]') {
            cost++;
          }

          if (parentState.grid[i][j] === '[   *   ]' && childState.grid[i][j] === '[     ]') {
            cost++;
          }
        }
      }
    }

    return cost;
  }

  calculateHeuristicManhattan(lightPath) {
    const stageConfig = this.stageConfigurationss[this.currentStagee];
    const { x: targetX, y: targetY } = stageConfig.target;

    if (!lightPath || lightPath.length === 0) {
      console.log("////////////////////////////////asdasdasdasdas");

      console.log(lightPath.length);

      return Math.pow(this.lightSourcePosition.x - targetX, 2) + Math.pow(this.lightSourcePosition.y - targetY, 2)

        ;
    }

    const lastPoint = lightPath[lightPath.length - 1];
    const distanceToTarget =
      Math.pow(lastPoint.x - targetX, 2) + Math.pow(lastPoint.y - targetY, 2)


    return distanceToTarget;
  }
  calculateHeuristicEuclidean(lightPath) {
    const stageConfig = this.stageConfigurationss[this.currentStagee];
    const { x: targetX, y: targetY } = stageConfig.target;

    if (!lightPath || lightPath.length === 0) {

      return Math.sqrt(
        Math.pow(this.lightSourcePosition.x - targetX, 2) + Math.pow(this.lightSourcePosition.y - targetY, 2)
      );
    }

    const lastPoint = lightPath[lightPath.length - 1];
    const distanceToTarget = Math.sqrt(
      Math.pow(lastPoint.x - targetX, 2) + Math.pow(lastPoint.y - targetY, 2)
    );

    return Math.floor(distanceToTarget);
  }
  hillClimbing() {
    let currentState = this.cloneState();


    currentState.heuristic = this.calculateHeuristicEuclidean(currentState.getCurrentLightPath());

    while (true) {
      const nextStates = this.GetNextState();

      nextStates.forEach((state) => {
        state.heuristic = this.calculateHeuristicEuclidean(state.lightPath);
         console.log("Heuristic : " + state.heuristic);
           console.log(state);
        


      });
      const nextState = nextStates.reduce((bestState, state) => {
        return state.heuristic < bestState.heuristic ? state : bestState;
      }, currentState);

      console.log("Current heuristic:", currentState.heuristic);
      console.log("Next heuristic:", nextState.heuristic);

      if (this.isGoalState(nextState.lightPath)) {
        console.log("Goal state found!");
        console.log("Current heuristic:", nextState.heuristic);
        console.log("Goal state:", nextState);

        return {
          isGoal: true,
          finalState: nextState,
          finalLightPath: nextState.lightPath,
        };
      }



      currentState = nextState;
    }
  }



  getStateKey(state) {
    return JSON.stringify(state.lightSourcePosition) + JSON.stringify(state.lightPath);
  }

  cloneState() {
    const clonedData = JSON.parse(JSON.stringify({
      grid: this.initialGrid,
      lightSourcePosition: this.lightSourcePosition,
    }));

    // إنشاء كائن جديد من النوع State
    const clonedState = new State(clonedData.grid, clonedData.lightSourcePosition);

    // نسخ الخصائص الإضافية إلى الكائن الجديد
    clonedState.previousDirection = this.previousDirection;
    clonedState.isWon = this.isWon;

    return clonedState;
  }




  printGrid(grid) {
    console.log("\n");
    console.log("╔" + "═".repeat(grid[0].length * 9 + 1) + "╗");

    grid.forEach((row, rowIndex) => {
      let rowString = "║";
      row.forEach((cell) => {
        switch (cell) {
          case '[   L   ]':
            rowString += '\x1b[32m' + cell + '\x1b[0m ';
            break;
          case '[   T   ]':
            rowString += '\x1b[31m' + cell + '\x1b[0m ';
            break;
          case '[   O   ]':
            rowString += '\x1b[34m' + cell + '\x1b[0m ';
            break;
          default:
            if (cell.startsWith('[ M')) {
              rowString += '\x1b[33m' + cell + '\x1b[0m ';
            } else if (cell === '[   *   ]') {
              rowString += '\x1b[35m' + cell + '\x1b[0m ';
            } else {
              rowString += ' ' + cell + ' ';
            }
        }
      });
      console.log(rowString + "║");

      if (rowIndex < grid.length - 1) {
        console.log("╠" + "═".repeat(grid[rowIndex].length * 9 + 1) + "╣");
      }
    });

    console.log("╚" + "═".repeat(grid[grid.length - 1].length * 9 + 1) + "╝");
  }

}

// Example usage
const currentStagee = 7;
const stateManager = new StateManager(6, 13, { x: 3, y: 0, direction: 'down' }, stageConfigurationss, currentStagee);
stateManager.initializeGridWithObjects();

// const dfsResult = stateManager.depthFirstSearch();
// if (dfsResult.found) {
//   console.log("DFS found a solution:");
//   dfsResult.path.forEach((state, index) => {
//     console.log(`Step ${index + 1}:`);
//     console.log("Light source:", state.lightSourcePosition);
//     console.log("Light path:", state.lightPath);
//     console.log(`Is Goal: ${state.isGoal}`);
//     console.log("Mirrors:", state.mirrors);

//     stateManager.printGrid(state.grid);

//   });
// } else {
//   console.log("DFS did not find a solution.");
// }

const searchResult = stateManager.aStarSearch();

if (searchResult.success) {
  console.log("A* search found a solution.");
  console.log("Path to goal state:");
  searchResult.path.forEach((state, index) => {
    console.log(`Step ${index }:`);
    stateManager.printGrid(state.grid);
    console.log(state);
    console.log('light path:', state.lightPath);
    console.log('light source:', state.lightSourcePosition);
    
    
    
  });
  console.log(` gcost: ${searchResult.gcost}`);
  console.log(` fcost: ${searchResult.fcost}`);
  console.log(` totalCost: ${searchResult.totalCost}`);
  
} else {
  console.log("A* search did not find a solution.");
  console.log(`Visited states: ${stateManager.visited.size}`);
}

// const ucsResult = stateManager.uniformCostSearch();
// if (ucsResult.found) {
//   console.log("UCS found a solution:");
//   console.log("Total Cost:", ucsResult.cost);
//   ucsResult.path.forEach((state, index) => {
//     console.log(`Step ${index + 1}:`);
//     console.log("Light source:", state.lightSourcePosition);
//     console.log("Light path:", state.lightPath);
//     stateManager.printGrid(state.grid);
//   });
// } else {
//   console.log("UCS did not find a solution.");
// }

// const bfsResult = stateManager.breadthFirstSearch();
// if (bfsResult.found) {
//   console.log("BFS found a solution:");
//   bfsResult.path.forEach((state, index) => {
//     console.log(`Step ${index + 1}:`);
//       console.log("Light source:", state.lightSourcePosition);
//   console.log("Light path:", state.lightPath);
//   console.log(`Is Goal: ${state.isGoal}`);
//   console.log("Mirrors:", state.mirrors);
//     stateManager.printGrid(state.grid);
//   });
// } else {
//   console.log("BFS did not find a solution.");
// }

// const allGetNextStates = stateManager.generateAllStates();
// allGetNextStates.forEach((state, index) => {
//   console.log(`State ${index + 1}:`);
//   stateManager.printGrid(state.grid);
//   console.log("Light source:", state.lightSourcePosition);
//   console.log("Light path:", state.lightPath);
//   console.log("Mirrors:", state.mirrors);
//   console.log(`Is Goal: ${state.isGoal}`);

//   console.log();
// });

// const hillClimbResult = stateManager.hillClimbing();
// if (hillClimbResult.isGoal) {
//   console.log("Hill Climbing found a solution:");
//   console.log("Final Light Path:", hillClimbResult.finalLightPath);
//   stateManager.printGrid(hillClimbResult.finalState.grid);
// console.log("///////////////////////////////");}
// else if (!hillClimbResult.isGoal) {
//   console.log("Hill Climbing did not find a solution.");
//   console.log("Last evaluated light path:", hillClimbResult.finalLightPath);
//   console.log("Current Light Source Position:", hillClimbResult.finalState.lightSourcePosition);
//   console.log(`Is Goal: ${hillClimbResult.finalState.isGoal}`);

//   stateManager.printGrid(hillClimbResult.finalState.grid);
// }


// // Generate a single next state by rotating light source to 'down' direction
// const singleState = stateManager.ge({
//   // type: 'rotateLightSource',
//   // direction: 'up-right',
//   // originalDirection: 'up-right',
//   type:'rotateMirror',
//   angle:'180',
//   originalAngle: '90',

// });

// console.log("Single next state:");
// stateManager.printGrid(singleState.grid);
// console.log("Light source:", singleState.lightSourcePosition);
// console.log("Light path:", singleState.lightPath);
// console.log(`Is Goal: ${singleState.isGoal}`);
// console.log(singleState.mirror);

// const allStates = stateManager.generateAllStates();
// console.log("All possible states:");

// allStates.forEach((state, index) => {
//   console.log(`State ${index + 1}:`);
//   stateManager.printGrid(state.grid);
//   console.log("Light source:", state.lightSourcePosition);
//   console.log("Light path:", state.lightPath);
//   console.log("Mirrors:", state.mirrors);
//   console.log(`Is Goal: ${state.isGoal}`);

//   console.log();
// });

// const hillClimbResult = stateManager.hillClimbing();
// if (hillClimbResult.isGoal) {
//   console.log("Hill Climbing found a solution:");
//   console.log("Final Light Path:", hillClimbResult.finalLightPath);
//   stateManager.printGrid(hillClimbResult.finalState.grid);
// } else {
//   console.log("Hill Climbing did not find a solution.");
//   console.log("Last evaluated light path:", hillClimbResult.finalLightPath);
//   stateManager.printGrid(hillClimbResult.finalState.grid);
// }

// const aStarResult = stateManager.aStarSearch();

// if (aStarResult.found) {
//   console.log("A* Search found a solution:");
//   console.log("Final Light Path:", aStarResult.path);

//   // Update the grid to reflect the light path
//   const finalGrid = stateManager.updateGridWithLightPath(aStarResult.path);
  
//   // Print the final grid
//   stateManager.printGrid(finalGrid);
// } else {
//   console.log("A* Search did not find a solution.");
//   console.log("Last evaluated light path:", aStarResult.path);

//   // Print the initial grid if no solution was found
//   stateManager.printGrid(stateManager.initialGrid);
// }



