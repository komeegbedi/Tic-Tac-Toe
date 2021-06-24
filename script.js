const gameGrid = document.querySelector('.grid');

//this represents each of the cell
const gameCell = Array.from(document.querySelectorAll('.grid .col-4'));

const humanChar = 'X';
const AIChar = 'O';

//this represents the possible wins of the gmae
const possibleWins = [
    [0 , 1 , 2],
    [3 , 4 , 5],
    [6 , 7 , 8],
    [0 , 3 , 6],
    [1 , 4 , 7],
    [2 , 5 , 8],
    [0 , 4 , 8],
    [2 , 4 , 6]
];

//this array will hold the array of the cell what each cell is currently filled with 
//at the beginning of the game it is filled with 0-8
let board = Array.from( Array(9).keys() );


//played by the AI
function AIGamePlay(){

    let nextIndex = minimax(board , AIChar).index;

    if(nextIndex !== undefined){

        board[nextIndex] = AIChar;
        gameCell[nextIndex].innerHTML = AIChar;
    }
   
}

//played by the human
function HPlay(cellID){
   
    if (cellID !== undefined) {
        gameCell[cellID].innerHTML = humanChar;
        board[cellID] = humanChar;
    }
}

function nextPlay(square){
    
    if( !noMorePlay() ){ // check and make sure that there is still a space to play 

        let clickID = square.target.getAttribute('data-id');

        if(typeof board[clickID] === 'number'){ // check that were is being clicked is empty 

            if( !turn(humanChar , clickID) ){

                turn(AIChar);
            }//if

        }//if
    }
    else{
        showResults('It is a tie');
    }

}


function turn(player , ID){

    let gameOver = false;

    if(player === humanChar){
        HPlay(ID);
    }
    else{
        AIGamePlay();
    }

    //after each player plays , check for win or tie

    if( checkWinner(player) ){

        showResults(text = player === humanChar ? 'You are the winner' : 'You lost');
        gameOver = true;
    }
    else if( noMorePlay() ){

        showResults('It is a tie');
        gameOver = true;
    }

    return gameOver;
}

//this function checks if a player won the game 

function checkWinner(player){
    let win = null;

    //loops through each possible wins and checks the board if a particular player has played 
    // in all the possible spots 
    for(let index = 0; index < possibleWins.length && !win; index++){

        let item = possibleWins[index];

        if (board[ item[0] ] === player && board[ item[1] ] === player
            && board[ item[2] ] === player) {

            win = { item, player};
        }
    }

    return win;
}


//using the minimax algorithm for the AI to play
function minimax(currBoard , player){

    if ( checkWinner(AIChar) ){
        return {score: 1};
    }
    else if(checkWinner (humanChar) ){
        return { score: -1};
    }
    else if(noMorePlay()){
        return { score: 0};
    }

    if(player === AIChar){ // maximizing player

        let maxEval = {score: -Infinity};
        let bestMove = maxEval;

        for(let index = 0; index < currBoard.length; index++){


            if(typeof currBoard[index] === 'number'){

                let currindex = currBoard[index];

                currBoard[index] = AIChar;
                bestMove = minimax(currBoard , humanChar);
               
                if(bestMove.score  > maxEval.score){
                    maxEval.index = currindex;
                    maxEval.score = bestMove.score;
                }
                currBoard[index] = currindex;
                
            }
        }

        return maxEval;
    }
    else{

        let maxEval = { score: Infinity, index: -1 };
        let bestMove = maxEval;

        for (let index = 0; index < currBoard.length; index++) {

            if (typeof currBoard[index] === 'number') {

                let currindex = currBoard[index];

                currBoard[index] = humanChar;
                bestMove = minimax(currBoard, AIChar);
    

                if (bestMove.score <  maxEval.score) {
                    maxEval.index = currindex;
                    maxEval.score = bestMove.score;
                }

                currBoard[index] = currindex;
            
            }
        }

        return maxEval;
    }

}

//chceks to see if there is anymore spots to play 
// returns true if there is no more spot to play 
function noMorePlay(){
    return board.filter(item => typeof item === 'number').length === 0;
}

//this function shows the results when someone wins
function showResults(text){
    const result = document.querySelector('.results');
    const winnerText = document.querySelector('.result-text');
    const replayBtn = document.querySelector('.replay .btn');

    winnerText.innerHTML = text;
    result.classList.remove('d-none');

    replayBtn.addEventListener('click', replay); 
}

function replay(){

    board = Array.from(Array(9).keys());
    let cells = Array.from(document.querySelectorAll('.grid .col-4'));
    const result = document.querySelector('.results');

    cells.forEach(cell => cell.innerHTML = ' ');
    result.classList.add('d-none');
}

function startGame(){
    gameGrid.addEventListener('click', nextPlay);
}

startGame();