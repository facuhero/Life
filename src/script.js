let parsedColSize = parseInt(document.getElementById("column-size").value);
let COLUMN_SIZE = isNaN(parsedColSize) ? 20 : parsedColSize;
let parsedRowSize = parseInt(document.getElementById("row-size").value);
let ROW_SIZE = isNaN(parsedRowSize) ? 20 : parsedRowSize;

const MIN_SPEED = 1000; //time in miliseconds
let isPlaying = false;
let timer;
let grid;
let isMouseDown;
let speed = MIN_SPEED - document.getElementById("speedSlider").value; //default speed in miliseconds

const STATES = {
  ALIVE: "alive",
  DEAD: "dead",
};

function cellOnClickHandler() {
  let [row, col] = this.id.split("-");

  if (this.className === STATES.ALIVE) {
    this.setAttribute("class", STATES.DEAD);
    grid[row][col] = 0;
    return;
  }
  this.setAttribute("class", STATES.ALIVE);
  grid[row][col] = 1;
}

function startOnClickHandler() {
  if (isPlaying) {
    this.innerHTML = "Start";
    isPlaying = false;
    clearTimeout(timer);
    return;
  }

  this.innerHTML = "Stop";
  isPlaying = true;
  play();
}

function setupButtons() {
  let startButton = document.getElementById("start-button");
  let resetButton = document.getElementById("reset-button");
  let randomButton = document.getElementById("random-button");
  let speedSlider = document.getElementById("speedSlider");
  let resizeButton = document.getElementById("resize-button");
  startButton.onclick = startOnClickHandler;
  resetButton.onclick = resetBoard;
  randomButton.onclick = randomBoard;
  speedSlider.oninput = (event) => {
    speed = MIN_SPEED - event.target.value;
  };
  resizeButton.onclick = resizeBoard;
}

const createBoard = () => {
  let boardContainer = document.getElementById("board");
  boardContainer.innerHTML = ""; // Clear previous board
  let arr = new Array(ROW_SIZE);

  if (!boardContainer) {
    throw Error("No board container");
  }

  let board = document.createElement("table");

  for (let i = 0; i < ROW_SIZE; i++) {
    let tr = document.createElement("tr");
    arr[i] = new Array(COLUMN_SIZE);
    for (let j = 0; j < COLUMN_SIZE; j++) {
      let cell = document.createElement("td");
      cell.setAttribute("id", i + "-" + j);
      cell.setAttribute("class", STATES.DEAD);
      cell.onmousedown = cellOnClickHandler;
      cell.onmouseover = cellOnMouseOverHandler;
      tr.appendChild(cell);
      arr[i][j] = 0;
    }
    board.appendChild(tr);
  }
  boardContainer.appendChild(board);
  return arr;
};

const resetBoard = () => {
  clearTimeout(timer);
  for (let i = 0; i < ROW_SIZE; i++) {
    for (let j = 0; j < COLUMN_SIZE; j++) {
      cell = document.getElementById(i + "-" + j);
      cell.setAttribute("class", STATES.DEAD);
      grid[i][j] = 0;
    }
  }

  isPlaying = false;
  let startButton = document.getElementById("start-button");
  startButton.innerHTML = "Start";
};

const randomBoard = () => {
  if (isPlaying) return;
  resetBoard();
  for (var i = 0; i < ROW_SIZE; i++) {
    for (var j = 0; j < COLUMN_SIZE; j++) {
      var isLive = Math.round(Math.random());
      if (isLive == 1) {
        var cell = document.getElementById(i + "-" + j);
        cell.setAttribute("class", STATES.ALIVE);
        grid[i][j] = 1;
      }
    }
  }
};

const initialize = () => {
  grid = createBoard();
  setupButtons();
};

const play = () => {
  //compute next gen
  grid = computeNextGen();
  //update view
  updateView(grid);
  if (isPlaying) {
    timer = setTimeout(play, speed);
  }
};

function computeNextGen() {
  let nextGen = createNextGenGrid();
  for (let i = 0; i < ROW_SIZE; i++) {
    for (let j = 0; j < COLUMN_SIZE; j++) {
      let numNeighbors = countNeighbors(i, j);

      let state = grid[i][j];

      if (state == 0 && numNeighbors == 3) {
        nextGen[i][j] = 1;
      } else if (state == 1 && (numNeighbors < 2 || numNeighbors > 3)) {
        nextGen[i][j] = 0;
      } else {
        nextGen[i][j] = state;
      }
    }
  }

  return nextGen;
}

function countNeighbors(x, y) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let row = (x + i + ROW_SIZE) % ROW_SIZE;
      let col = (y + j + COLUMN_SIZE) % COLUMN_SIZE;
      sum += grid[row][col];
    }
  }
  sum -= grid[x][y];
  return sum;
}

function updateView(grid) {
  for (let i = 0; i < ROW_SIZE; i++) {
    for (let j = 0; j < COLUMN_SIZE; j++) {
      cell = document.getElementById(i + "-" + j);
      cell.setAttribute("class", grid[i][j] == 1 ? STATES.ALIVE : STATES.DEAD);
    }
  }
}

function createNextGenGrid() {
  let nextGen = new Array(ROW_SIZE);

  for (let i = 0; i < ROW_SIZE; i++) {
    nextGen[i] = new Array(COLUMN_SIZE).fill(0);
  }
  return nextGen;
}

function resizeBoard() {
  let newRow = parseInt(document.getElementById("row-size").value);
  let newCol = parseInt(document.getElementById("column-size").value);

  if (newCol > 0 && newCol < 101 && newRow > 0 && newRow < 101) {
    COLUMN_SIZE = newCol;
    ROW_SIZE = newRow;
    initialize();
  }
}

document.body.onmousedown = () => {
  isMouseDown = true;
};
document.body.onmouseup = () => {
  isMouseDown = false;
};

function cellOnMouseOverHandler() {
  if (isMouseDown) {
    cellOnClickHandler.call(this);
  }
}

window.onload = initialize;
