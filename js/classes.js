class Cell {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }
}

class LightSource extends Cell {
  constructor(x, y, direction) {
    super(x, y, "lightSource");
    this.direction = direction;
    this.allowedDirections = [
      "right",
      "down-right",
      "down",
      "down-left",
      "left",
      "up-left",
      "up",
      "up-right",
    ];
    this.currentDirectionClass = `light-source-${this.direction}`;
  }

  rotatelightsource() {
    const currentIndex = this.allowedDirections.indexOf(this.direction);
    const newDirection =
      this.allowedDirections[
      (currentIndex + 1) % this.allowedDirections.length
      ];
    console.log(
      `Rotating light source at (${this.x}, ${this.y}) from ${this.direction} to ${newDirection}`
    );
    this.direction = newDirection;
  }
}

class Target extends Cell {
  constructor(x, y) {
    super(x, y, "target");
  }
}

class Mirror extends Cell {
  constructor(x, y, orientation, mirrorType, moveRange = []) {
    super(x, y, `mirror`);
    this.orientation = orientation;
    this.allowedOrientations = [
      "45", "60", "90", "-60", "-45", "180",
    ];
    this.currentOrientationClass = `mirror${this.orientation}`;

    this.mirrorType = mirrorType;
    this.moveRange = moveRange;
    this.isSelected = false;
    this.hasMoved = false;

    if (!this.hasMoved) {
      this.initialX = x;
      this.initialY = y;
      this.hasMoved = true;
    }
  }
  
  rotate() {
    if (this.mirrorType === "rotatable") {
      const currentIndex = this.allowedOrientations.indexOf(this.orientation);
      const newOrientation =
        this.allowedOrientations[
        (currentIndex + 1) % this.allowedOrientations.length
        ];
      console.log(
        `Rotating mirror at (${this.x}, ${this.y}) from ${this.orientation} to ${newOrientation}`
      );
      this.orientation = newOrientation;
      this.currentOrientationClass = `mirror${this.orientation}`; // Update class
    }
  }

  clone() {
    return new Mirror(this.x, this.y, this.orientation, this.mirrorType, [
      ...this.moveRange,
    ]);
  }

  move(direction) {
    if (direction === "up" || direction === "down") {
      this.moveVertical(direction);
    } else if (direction === "left" || direction === "right") {
      this.moveHorizontal(direction);
    } else if (direction === "up-right" || direction === "up-left" || direction === "down-right" || direction === "down-left") {
      this.moveDiagonal(direction);
    } else {
      console.error("Invalid direction for move");
    }
  }

  moveHorizontal(direction) {
    if (
      this.mirrorType === "horizontalMove" ||
      this.mirrorType === "rotatable"
    ) {
      const newY = direction === "right" ? this.y + 1 : this.y - 1;
      const newPosition = { x: this.x, y: newY };

      if (this.isWithinRange(newPosition)) {
        this.y = newY;
        console.log(`Moved mirror horizontally to (${this.x}, ${this.y})`);
      } else {
        console.error("Movement out of range.");
        this.resetPosition();
      }
    }
  }

  moveVertical(direction) {
    if (this.mirrorType === "verticalMove" || this.mirrorType === "rotatable") {
      const newX = direction === "down" ? this.x + 1 : this.x - 1;
      const newPosition = { x: newX, y: this.y };

      if (this.isWithinRange(newPosition)) {
        this.x = newX;
        console.log(`Moved mirror vertically to (${this.x}, ${this.y})`);
      } else {
        console.error("Movement out of range.");
        this.resetPosition();
      }
    }
  }

  moveDiagonal(direction) {
    let newX = this.x;
    let newY = this.y;

    switch (direction) {
      case "up-right":
        newX -= 1;
        newY += 1;
        break;
      case "up-left":
        newX -= 1;
        newY -= 1;
        break;
      case "down-right":
        newX += 1;
        newY += 1;
        break;
      case "down-left":
        newX += 1;
        newY -= 1;
        break;
      default:
        console.error("Invalid direction for diagonal move");
        return;
    }

    const newPosition = { x: newX, y: newY };

    if (this.isWithinRange(newPosition)) {
      this.x = newX;
      this.y = newY;
      console.log(`Moved mirror diagonally to (${this.x}, ${this.y})`);
    } else {
      console.error("Movement out of range.");
      this.resetPosition();
    }
  }
  getMoveRangePath() {
    switch(this.type) {
      case "rotatable":
        return `M${this.x},${this.y} L${this.moveRange[0].x},${this.moveRange[0].y}`;
      case "fixed":
        return `M${this.x},${this.y} L${this.moveRange[0].x},${this.moveRange[0].y}`;
      case "horizontalMove":
        return `M${this.x},${this.y} C${this.x},${this.y} ${this.moveRange[1].x},${this.moveRange[1].y} ${this.moveRange[2].x},${this.moveRange[2].y}`;
      case "verticalMove":
        return `M${this.x},${this.y} V${this.moveRange[0].y} H${this.moveRange[1].x} V${this.moveRange[2].y}`;
      case "diagonalMove":
        return `M${this.x},${this.y} L${this.moveRange[0].x},${this.moveRange[0].y} L${this.moveRange[1].x},${this.moveRange[1].y} L${this.moveRange[2].x},${this.moveRange[2].y}`;
      default:
        return "";
    }
  }

  isWithinRange(position) {
    return this.moveRange.some((p) => p.x === position.x && p.y === position.y);
  }

  resetPosition() {
    this.x = this.initialX;
    this.y = this.initialY;
    console.log(
      `Mirror reset to initial position (${this.initialX}, ${this.initialY})`
    );
  }

  select() {
    this.isSelected = true;
  }

  deselect() {
    this.isSelected = false;
  }
}

class ObstacleCell extends Cell {
  constructor(x, y) {
    super(x, y, "obstacle");
  }
}
