//let board = document.getElementById("board");
const rows = 20;
const columns = 20;

const cellOnClickHandler = () => {

}

const createBoard = () => {
    let boardContainer = document.getElementById("board");

    if(!boardContainer){
       throw Error("No board container");
    }

    let board = document.createElement("table");
    for(let i = 0; i < rows; i++){
        let tr = document.createElement("tr");
        for(let j = 0; j < columns; j++){
            let cell = document.createElement("td");
            cell.setAttribute("id", i + "-" + j); 
            cell.setAttribute("class", "live");
            cell.onclick = cellOnClickHandler;
            tr.appendChild(cell);
        }
        board.appendChild(tr);
    }
    boardContainer.appendChild(board);

}


createBoard();