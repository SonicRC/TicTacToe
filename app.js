//Defintion of the GameBoard

const GameBoard = (() => {
    const cell = document.querySelectorAll(".cell");
    const winningCells = [
        ["cell-1", "cell-2", "cell-3"],
        ["cell-4", "cell-5", "cell-6"],
        ["cell-7", "cell-8", "cell-9"],
        ["cell-1", "cell-5", "cell-9"],
        ["cell-3", "cell-5", "cell-7"],
        ["cell-1", "cell-4", "cell-7"],
        ["cell-2", "cell-5", "cell-8"],
        ["cell-3", "cell-6", "cell-9"],
    ]
    return {cell, winningCells};
})();

//Manages the Players and their selections

const Players = (name) => {
    const getName = () => name;
    const roundCounter = 0;
    const selectedCells = [];
    const playerSelection = (name, selectedCell) => {
        if (!player1.selectedCells.includes(selectedCell) && !player2.selectedCells.includes(selectedCell)) {
            DisplayController.addClass(selectedCell, name.getName());
            name.selectedCells.push(selectedCell)
            name.selectedCells.sort();
            name.roundCounter += 1;
            GameFlow.getWinner(name);
        } 
    }
    return {getName, roundCounter, selectedCells, playerSelection};
}; 

const player1 = Players("PlayerX");
const player2 = Players("PlayerO");


//Defines how the game works

const GameFlow = (() => {
    const playRound = GameBoard.cell.forEach(element => {
        element.addEventListener('click', event => { 
            let selectedCell = event.target.classList[1];
                if (player1.roundCounter <= player2.roundCounter) {
                    player1.playerSelection(player1, selectedCell);    
                } else {
                    player2.playerSelection(player2, selectedCell);
                };
        });
    });
    const getWinner = (name) => { 
        for (let i = 0; i < 8; i++) {
            if (GameBoard.winningCells[i].every(val =>  name.selectedCells.includes(val))) {
                DisplayController.winnerMessage(name);
                ModalController().activateModal()
                DisplayController.addWinnerClass(i);
            } 
        }
        if (player1.roundCounter + player2.roundCounter === 9 && document.querySelectorAll(".winning-row").length === 0) {
            DisplayController.tieMessage(name);
            ModalController().activateModal()
        }
    }
    const resetGame = () => {
        player1.selectedCells = [];
        player2.selectedCells = [];
        player1.roundCounter = 0;
        player2.roundCounter = 0;
        const removeClass =  document.querySelectorAll('.cell')
        removeClass.forEach(remove => {
            remove.classList.remove('selected-PlayerX', 'selected-PlayerO', 'winning-row');
 
        });
    }
    return {playRound, getWinner, resetGame};
})();

//Controlls all the action on scereen

const DisplayController = (() => {
    const addClass = (selectedCell, name) => {
        document.querySelector('.' + selectedCell).classList.add('selected-' + name);               
    }
    const addWinnerClass = (index) => {
        for (i = 0; i < 3; i++) {
            document.querySelector('.' + GameBoard.winningCells[index][i]).classList.add("winning-row");
        }

    }
    const winnerMessage = (name) => {
        let icon = document.querySelector(".icon");
        let title = document.querySelector(".title");
        let message = document.querySelector("p");
        
        icon.innerHTML = "&#127942"; //award Emoji
        title.textContent = "Congratulations!";
        message.textContent = `You won, ${name.getName()}!`;
    }
    const tieMessage = () => {
        let icon = document.querySelector(".icon");
        let title = document.querySelector(".title");
        let message = document.querySelector("p");
        
        icon.innerHTML = "&#x1F64A"; //monkey Emoji
        title.textContent = "Oh no!";
        message.textContent = `It's a draw.`;
    }
    return {addClass, addWinnerClass, winnerMessage, tieMessage};
})();

//(De-)Acticates the overlay with winner message(defined in DisplayController)

const ModalController = () => {
    const modal = document.querySelector('.modal');
    const overlay = document.getElementById('overlay');
    const activateModal = () => {
        modal.classList.add('active')
        overlay.classList.add('active')
        deactivateModal();
    };
    const deactivateModal = () => {
        document.querySelectorAll('.restart').forEach(button => {
            button.addEventListener('click', () => {
                GameFlow.resetGame()
                modal.classList.remove('active')
                overlay.classList.remove('active')
            })
        });
    };
    return {activateModal};
}
