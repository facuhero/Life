//let board = document.getElementById("board");
const rows = 40;
const columns = 40;
let isPlaying = false;
let timer;
let grid;
let nextGen = [[]];

function cellOnClickHandler() {
  var rowcol = this.id.split("-");
  var row = rowcol[0];
  var col = rowcol[1];

  if (this.className === "alive") {
    this.setAttribute("class", "dead");
    grid[row][col] = 0;
    return;
  }
  this.setAttribute("class", "alive");
  grid[row][col] = 1;
}

function startOnClickHandler() {
  if (isPlaying) {
    isPlaying = false;
    console.log("Stoping game!");
    clearTimeout(timer);
    return;
  }
  isPlaying = true;
  console.log("Playing game!");
  play();
}

function setupButtons(grid) {
  let startButton = document.getElementById("start-button");
  let resetButton = document.getElementById("reset-button");
  startButton.onclick = startOnClickHandler;
  resetButton.onclick = resetBoard;
}

const createBoard = () => {
  let boardContainer = document.getElementById("board");
  let arr = new Array(columns);
  nextGen = new Array(columns);
  if (!boardContainer) {
    throw Error("No board container");
  }

  let board = document.createElement("table");

  for (let i = 0; i < rows; i++) {
    let tr = document.createElement("tr");
    nextGen[i] = new Array(rows)
    arr[i] = new Array(rows);
    for (let j = 0; j < columns; j++) {
      let cell = document.createElement("td");
      cell.setAttribute("id", i + "-" + j);
      cell.setAttribute("class", "dead");
      cell.onclick = cellOnClickHandler;
      tr.appendChild(cell);
      arr[i][j] = 0;
      nextGen[i][j] = 0;
    }
    board.appendChild(tr);
  }
  boardContainer.appendChild(board);
  return arr;
};

const resetBoard = () => {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      cell = document.getElementById(i + "-" + j);
      cell.setAttribute("class", "dead");
      grid[i][j] = 0;
    }
  }
  isPlaying = false;
  console.log("Reset game!");
};

const inicilize = () => {
  grid = createBoard();
  setupButtons();
};

const play = () => {
  //compute next gen
  grid = computeNextGen();
  //update view
  updateView();
  if (isPlaying) {
    timer = setTimeout(play, 500);
  }
};

function computeNextGen() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
          let numNeighbors = countNeighbors(i, j);
          let state = grid[i][j];
    
          if(state == 0 && numNeighbors == 3){
            nextGen[i][j] = 1;
          }else if(state == 1 && (numNeighbors < 2 || numNeighbors > 3)){
            nextGen[i][j] = 0;
          }else{
            nextGen[i][j] = grid[i][j];
          }
        }
      }
      return nextGen;
}

function countNeighbors(x, y) {
  let sum = 0;
  for (var i = -1; i < 2; i++) {
    for (var j = -1; j < 2; j++) {
      let col = (x + i + columns) % columns;
      let row = (y + j + rows) % rows;
      sum += grid[row][col];
    }
  }
  sum -= grid[x][y];
  return sum;
}

function updateView() {

  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < columns; j++) {
      cell = document.getElementById(i + "-" + j);
      cell.setAttribute("class", grid[i][j] == 1 ? "alive" : "dead");
    }
  }
}

window.onload = inicilize;
