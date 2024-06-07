const ROW_SIZE = 20;
const COLUMN_SIZE = 20;
const MIN_SPEED = 1000;
let isPlaying = false;
let timer;
let grid;
let isMouseDown;
let speed = 300; //default speed in miliseconds

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
    console.log("Stoping game!");
    clearTimeout(timer);
    return;
  }

  this.innerHTML = "Stop";
  isPlaying = true;
  console.log("Playing game!");
  play();
}

function setupButtons() {
  let startButton = document.getElementById("start-button");
  let resetButton = document.getElementById("reset-button");
  let randomButton = document.getElementById("random-button");
  let speedSlider = document.getElementById("speedSlider");
  startButton.onclick = startOnClickHandler;
  resetButton.onclick = resetBoard;
  randomButton.onclick = randomBoard;
  speedSlider.oninput = (event) => {
    speed = MIN_SPEED - event.target.value;
  };
}

const createBoard = () => {
  let boardContainer = document.getElementById("board");
  let arr = new Array(COLUMN_SIZE);

  if (!boardContainer) {
    throw Error("No board container");
  }

  let board = document.createElement("table");

  for (let i = 0; i < COLUMN_SIZE; i++) {
    let tr = document.createElement("tr");
    arr[i] = new Array(ROW_SIZE);
    for (let j = 0; j < ROW_SIZE; j++) {
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
  for (let i = 0; i < COLUMN_SIZE; i++) {
    for (let j = 0; j < ROW_SIZE; j++) {
      cell = document.getElementById(i + "-" + j);
      cell.setAttribute("class", STATES.DEAD);
      grid[i][j] = 0;
    }
  }

  isPlaying = false;
  let startButton = document.getElementById("start-button");
  startButton.innerHTML = "Start";
  console.log("Reset game!");
};

const randomBoard = () => {
  if (isPlaying) return;
  resetBoard();
  for (var i = 0; i < COLUMN_SIZE; i++) {
    for (var j = 0; j < ROW_SIZE; j++) {
      var isLive = Math.round(Math.random());
      if (isLive == 1) {
        var cell = document.getElementById(i + "-" + j);
        cell.setAttribute("class", STATES.ALIVE);
        grid[i][j] = 1;
      }
    }
  }
};

const inicialize = () => {
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
  for (let i = 0; i < COLUMN_SIZE; i++) {
    for (let j = 0; j < ROW_SIZE; j++) {
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
      let row = (y + j + ROW_SIZE) % ROW_SIZE;
      let col = (x + i + COLUMN_SIZE) % COLUMN_SIZE;
      sum += grid[col][row];
    }
  }
  sum -= grid[x][y];
  return sum;
}

function updateView(grid) {
  for (let i = 0; i < COLUMN_SIZE; i++) {
    for (let j = 0; j < ROW_SIZE; j++) {
      cell = document.getElementById(i + "-" + j);
      cell.setAttribute("class", grid[i][j] == 1 ? STATES.ALIVE : STATES.DEAD);
    }
  }
}

function createNextGenGrid() {
  let nextGen = new Array(COLUMN_SIZE);

  for (let i = 0; i < COLUMN_SIZE; i++) {
    nextGen[i] = new Array(ROW_SIZE).fill(0);
  }
  return nextGen;
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

window.onload = inicialize;
