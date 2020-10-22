const boardWidth = 8;
const boardHeight = 8;

const knightDirections = [
  { y: -2, x: -1 },
  { y: -2, x: 1 },
  { x: 2, y: -1 },
  { x: 2, y: 1 },
  { y: 2, x: 1 },
  { y: 2, x: -1 },
  { x: -2, y: 1 },
  { x: -2, y: -1 },
];

const getPossibleDirections = (positions, x, y) => {
  const directions = [];

  for (const direction of knightDirections) {
    const tileX = x + direction.x;
    const tileY = y + direction.y;

    if (canMoveTo(positions, tileX, tileY)) {
      directions.push(direction);
    }
  }

  return directions;
};

const getBestNextDirection = (
  positions,
  currentPosition,
  lookForClosedTour
) => {
  // look onwards to all possible positions and get the one with the fewest directions
  const items = [];
  for (let index = 0; index < currentPosition.directions.length; index++) {
    const direction = currentPosition.directions[index];
    const tileX = currentPosition.x + direction.x;
    const tileY = currentPosition.y + direction.y;

    let directionCount = getPossibleDirections(positions, tileX, tileY).length;
    items.push({ index: index, count: directionCount });
  }

  // sort by fewest possible directions
  items.sort((a, b) => (a.count > b.count ? 1 : -1));

  let indexToUse = 0;

  if (lookForClosedTour) {
    indexToUse = getBestDirectionIndexForClosedTour(
      positions,
      currentPosition,
      items
    );
    if (indexToUse == null) {
      return null;
    }
  }

  const item = items[indexToUse];
  const direction = currentPosition.directions[item.index];
  currentPosition.directions.splice(item.index, 1);

  return direction;
};

const canMoveTo = (positions, x, y) => {
  // outside board is always false
  if (x < 0 || x > boardWidth - 1 || y < 0 || y > boardHeight - 1) {
    return false;
  }

  // is destination tile already take
  if (positions.some((tile) => tile.x === x && tile.y === y)) {
    return false;
  }

  return true;
};

const getBestDirectionIndexForClosedTour = (
  positions,
  currentPosition,
  directionItems
) => {
  let indexToUse = null;

  for (let index = 0; index < directionItems.length; index++) {
    const item = directionItems[index];
    const direction = currentPosition.directions[item.index];

    // put position on temp board to check for closed tour
    const _positions = [...positions];
    _positions.push({
      x: currentPosition.x + direction.x,
      y: currentPosition.y + direction.y,
      value: _positions.length + 1,
      directions: undefined, // not needed
    });

    if (ensureClosedTour(_positions)) {
      indexToUse = index;
      break;
    }
  }

  return indexToUse;
};

const ensureClosedTour = (positions) => {
  // to look for a close tour, one of the postions around the starting tile must stay empty until the last step
  if (positions.length > 0 && positions.length < boardSize) {
    const firstPosition = positions[0];
    let counter = firstPosition.directions.length;
    for (let direction of firstPosition.directions) {
      if (
        positions.some(
          (tile) =>
            tile.x === firstPosition.x + direction.x &&
            tile.y === firstPosition.y + direction.y
        )
      ) {
        counter--;
      }
    }

    if (counter === 0) {
      return false;
    }
  }

  return true;
};

// =========== public

export const boardSize = boardWidth * boardHeight;

export const createTiles = (value, state) => {
  return Array.from({ length: boardHeight }, () => {
    return Array.from({ length: boardWidth }, () => {
      return { value: value, state: state };
    });
  });
};

export const start = (x, y) => {
  var position = {
    x: x,
    y: y,
    value: 1,
    directions: [...getPossibleDirections([], x, y)],
  };

  return [position];
};

export const nextStep = (positions, lookForClosedTour) => {
  const _positions = [...positions];

  if (_positions.length === 0) {
    // tour is stuck or not started
    return _positions;
  }

  const currentPosition = _positions[_positions.length - 1];
  if (currentPosition.directions.length === 0) {
    _positions.pop();
    return _positions;
  }

  const direction = getBestNextDirection(
    _positions,
    currentPosition,
    lookForClosedTour
  );
  if (direction == null) {
    _positions.pop();
    return _positions;
  }

  const x = currentPosition.x + direction.x;
  const y = currentPosition.y + direction.y;

  _positions.push({
    x: x,
    y: y,
    value: _positions.length + 1,
    directions: getPossibleDirections(_positions, x, y),
  });

  return _positions;
};
