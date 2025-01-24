class LightPath {
    constructor(startPosition, direction) {
      this.positions = [];
      this.currentDirection = direction;
      this.addPosition(startPosition, null);
    }
  
    addPosition(position, orientation) {
      this.positions.push({ position, orientation: orientation || this.currentDirection });
    }
  
    clearPath() {
      this.positions = [];
    }
  
    isPositionInPath(position) {
      return this.positions.some(pos => pos.position.x === position.x && pos.position.y === position.y);
    }
  
    getCurrentPath() {
      return this.positions;
    }
  
    updateDirection(newDirection) {
      this.currentDirection = newDirection;
    }
  }