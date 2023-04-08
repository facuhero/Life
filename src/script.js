//let board = document.getElementById("board");
const rows = 20;
const columns = 40;

function cellOnClickHandler () {
    if(this.className === 'alive'){
        this.setAttribute("class","dead");
        return;
    }
    this.setAttribute("class","alive");
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
            cell.setAttribute("class", "dead");
            cell.onclick = cellOnClickHandler;
            tr.appendChild(cell);
        }
        board.appendChild(tr);
    }
    boardContainer.appendChild(board);

}


createBoard();