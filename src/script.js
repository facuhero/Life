//let board = document.getElementById("board");
const rows = 20;
const columns = 40;
let isPlaying = false;
let grid;

function cellOnClickHandler () {
    if(this.className === 'alive'){
        this.setAttribute("class","dead");
        return;
    }
    this.setAttribute("class","alive");
}

function startOnClickHandler() {
    
    if(isPlaying){
        isPlaying = false;
        console.log("Stoping game!");
        return;
    }
    isPlaying = true;
    console.log("Playing game!");
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
    if(!boardContainer){
       throw Error("No board container");
    }

    let board = document.createElement("table");
    
    for(let i = 0; i < rows; i++){
        let tr = document.createElement("tr");
        arr[i] = new Array(rows);
        for(let j = 0; j < columns; j++){
            let cell = document.createElement("td");
            cell.setAttribute("id", i + "-" + j); 
            cell.setAttribute("class", "dead");
            cell.onclick = cellOnClickHandler;
            tr.appendChild(cell);
            arr[i][j] = 0;
        }
        board.appendChild(tr);
    }
    boardContainer.appendChild(board);
    return arr;
}

const resetBoard = () => {
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < columns; j++){
            cell = document.getElementById(i+"-"+j);
            cell.setAttribute("class", "dead");
            grid[i][j] = 0;
        }
    }
    console.log("Reset game!");
}

const initialize = () => {

    grid = createBoard();
    setupButtons();

    // while(isPlaying){
    //     //TO DO
    // }
}

initialize();