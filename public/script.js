function _(x) {
	return document.getElementById(x);
}

var socket = io();
// var winCondition;
// var currentCard;
var opponentList = [];

content = _("popItIn");

function changeAlert(string) {
    return string;
}

function boardConstruct(seed) {
    // creates a <table> element
    Math.seedrandom(seed.toString());
    var tbl = document.createElement("table");
    cardOnBoard = [];
    // creating rows
    for (r = 0; r < 4; r++) {
        var row = document.createElement("tr");
	    // create cells in row
        for (j = 0; j < 4; j++) {
            cardOnBoardCheck = cardOnBoard.length;
            var cell = document.createElement("td");
            var img = document.createElement("img");
            var input = document.createElement("input");
            input.setAttribute("type", "checkbox");
            while (cardOnBoard.length === cardOnBoardCheck ) {
                card = (Math.floor(Math.random() * (54 - 1 + 1)) + 1);
                if (cardOnBoard.includes(card) === false) {
                    cardOnBoard.push(card);
                    img.src = "images/CAAR/" + card + '.jpeg';
                    cell.appendChild(input);
                    cell.appendChild(img);
                    row.appendChild(cell);
                }
            }
        }
        tbl.appendChild(row);
    }
    return tbl;
}

function newPlayer(nickname, id) {
    
    if (!opponentList.includes(id)) {
        var opponent = document.createElement("div");
        var opponentTable = document.createElement("table");
        var opponentName = document.createElement("span");
        opponentName.innerHTML = nickname;
        opponent.setAttribute("id", id);
        opponentList.push(id);
    
        for (r = 0; r < 4; r++) {
            var row = document.createElement("tr");
            for (j = 0; j < 4; j++) {
                var cell = document.createElement("td");
                var input = document.createElement("input");
                input.setAttribute("type", "checkbox");
                input.disabled = true;
                cell.appendChild(input);
                row.appendChild(cell);
            }
            opponentTable.appendChild(row);
        }
        opponent.appendChild(opponentTable);
        opponent.appendChild(opponentName);
        _("playerGraph").appendChild(opponent);
    }

}

function host() {
    const drawBtn = _("drawBtn");
    const currentCard = _("currentCard");
    const winConditionBtn = _("winConditionBtn");
    const winCondition = document.querySelectorAll('input[name="winCondition"]');
    let currentWinCondition = null;
    const gameSettings = _("gameSettings");
    const winConditionInfo = _("winConditionInfo");
    const roomNumber = Math.floor(Math.random() * (999999 - 100000 + 1) ) + 100000;
    const boardHold = _("boardHold");
    const allegedWinner = _("allegedWinner");
    const cardReview = _("cardReview");
    const cardReviewList = _("cardReviewList");
    const alerModal = _("alertModal");
    let drawnCards = [];
    let allegedWinnerID = null;
    
    var gameInfo = {
        gameState: false,
        card: "blank",
        goal: "blank",
        playerList: [],
        pickedBoards: [],
    };
    

    
    socket.emit('new room', roomNumber);

    socket.on('room clear', function(r){
        _("roomNumber").innerHTML = r;
    });
    
    for (n=0; n<winCondition.length; n++) {
        winCondition[n].addEventListener('change', function() {
            winConditionBtn.disabled = false;
        });
    }
    
    function shuffleDeck() {
        deckList = [];
        for (var i=0; i<54; i++) {
            deckList.push(i+1);
        }
    }
    
    function chooseWinCondition() {
        currentWinCondition = document.querySelector('input[name="winCondition"]:checked').value;
        winConditionInfo.src =  "images/" + currentWinCondition + ".png";
        gameInfo.goal = currentWinCondition;
        socket.emit('win condition', currentWinCondition, roomNumber);
        drawBtn.disabled = false;
        gameSettings.classList.add("invisible");
        for (n=0; n<winCondition.length; n++) {
            winCondition[n].disabled = true;
        }
    }
    
    function startGame() {
        console.log("game started");
        currentCard.src = "images/blank.png";
        shuffleDeck();
        winConditionBtn.disabled = true;
        gameInfo.gameState = true;
        socket.emit('game state', true, roomNumber);
    }
    
    
    
    
    // const onCheckBoardRender = function(checkBoardRender) {
    //     return function actualCheckBoardRender(board, checked, id) {
    //         console.log(event);
    //         console.log(board, checked, id);
    //     };
    // };
    // const handlers = [];
    
    // const startSelectNode = (checkBoardRender) => {
    //   document.addEventListener("click", handlers[checkBoardRender] = onCheckBoardRender(checkBoardRender), true);
    // };
    
    // const stopSelectNode = (checkBoardRender) => {
    //   document.removeEventListener("click", handlers[checkBoardRender], true);
    // };
    
    
    
    
    
    
    function checkBoard(board, checked, id) {
        console.log("checkBoard");
        _(id).classList.add("winnerGlow");
        _(id).addEventListener('click', function(event) {
            checkBoardRender(board, checked, id);
        });
        // _(id).addEventListener('click', checkBoardRender.bind(this, board, checked, id))
            // startSelectNode(1);
        // var quick = _(id).querySelectorAll('input');
        // for (z=0; z < quick.length; z++) {
        //     quick[z].disabled = false;
        // }
    }



    function checkBoardRender(board, checked, id) {
        console.log("checkBoardRender");
        _(id).classList.remove("winnerGlow");
        var allegedBoard = boardConstruct(board);
        boardHold.innerHTML = "";

        for (b=0; b < checked.length; b++) {
            var currentCell = allegedBoard.rows[checked[b].y].cells[checked[b].x];
            currentCell.firstElementChild.checked = true;
        }
        var disableThis = allegedBoard.querySelectorAll("input");
        for (q=0; q < disableThis.length; q++) {
            disableThis[q].disabled = true;
        }
        _("cardReviewListAlleged").innerHTML = "";
        for (c=0; c < drawnCards.length; c++) {
            var li = document.createElement("li");
            var img = document.createElement("img");
            img.src = "images/CAAR/" + drawnCards[c] + ".jpeg";
            li.appendChild(img);
            _("cardReviewListAlleged").appendChild(li);
        }
        boardHold.appendChild(allegedBoard);
        allegedWinner.classList.remove("invisible");
        allegedWinnerID = id;

    }
    
    function boardChecked(bool) {
        console.log("boardChecked");
        socket.emit('board checked', bool, allegedWinnerID, roomNumber);
        if (bool) {
            alertModal.classList.remove("invisible");
        }
        console.log(allegedWinnerID);
        // _(allegedWinnerID).removeEventListener('click', checkBoardRender(board, checked, id));
        _(allegedWinnerID).removeEventListener('click', function(event) {
            checkBoardRender(board, checked, id);
        });


        // stopSelectNode(1);

        allegedWinner.classList.add("invisible");
        allegedWinnerID = null;
        
    }
    
    
    _("confirm").addEventListener('click', function(event) {
        boardChecked(true);
    });
    _("deny").addEventListener('click', function(event) {
        boardChecked(false);
    });


    function endGame() {
        drawBtn.disabled = true;
        winConditionBtn.disabled = false;
        for (n=0; n<winCondition.length; n++) {
            winCondition[n].disabled = false;
        }
        drawnCards = [];
        currentCard.src="images/blank.png";
        alertModal.classList.add("invisible");
        gameSettings.classList.remove("invisible");
        opponentTiles = _("playerGraph").getElementsByTagName('input');
        losers = _("playerGraph").querySelectorAll(".winnerGlow");
        for (u=0; u < losers.length; u++) {
            losers[u].classList.remove("winnerGlow");
            losers[u].removeEventListener('click', checkBoardRender(board, checked, id));

        }
        for (w=0; w < opponentTiles.length; w++) {
            opponentTiles[w].checked = false;
        }
        gameInfo.gameState = false;
        socket.emit('game state', false, roomNumber);
    }
    
    function drawCard(evt) {
        evt.preventDefault();
        
        if (gameInfo.gameState) {
            cardDrawn = deckList[(Math.floor(Math.random() * (deckList.length - 1 + 1)))];
            currentCard.src = "images/CAAR/" + cardDrawn + ".jpeg";
            gameInfo.card = cardDrawn;
            drawnCards.push(cardDrawn);
            
            deckList.splice(deckList.indexOf(cardDrawn), 1);
            
            if (deckList.length <= 0) {
                endGame();
            }
            else {
                socket.emit('current card', cardDrawn, roomNumber);
            }
        }
        
        else {
            console.log("game started")
            startGame();
        }
        
    }
    
    socket.on ("check win", function(board, id) {
        for (i=0; i < gameInfo.playerList.length; i++) {
            if (gameInfo.playerList[i].ID === id) {
                var checked = gameInfo.playerList[i].placedBeans;
                break;
            }
        }
        console.log(checked);
        checkBoard(board, checked, id);
    });
    
    _("reviewBtn").addEventListener('click', function() {
        cardReviewList.innerHTML = "";
        for (c=0; c < drawnCards.length; c++) {
            var li = document.createElement("li");
            var img = document.createElement("img");
            img.src = "images/CAAR/" + drawnCards[c] + ".jpeg";
            li.appendChild(img);
            cardReviewList.appendChild(li);
        }
        cardReview.classList.remove("invisible");
    });
    
    _("closeReview").addEventListener('click', function(event) {
        event.preventDefault();
        cardReview.classList.add("invisible");
    });
    
    winConditionBtn.addEventListener('click', function(event) {
        event.preventDefault();
        chooseWinCondition();
    });

    restartGame.addEventListener('click', function(event) {
        event.preventDefault();
        endGame();
    });

    continueGame.addEventListener('click', function(event) {
        event.preventDefault();
        alertModal.classList.add("invisible");
    });

    drawBtn.onclick = drawCard;
    
    socket.on ("new player", function(nickname, id) {
        socket.emit('update newcomer', gameInfo, id);
        newPlayer(nickname, id);
        var player = {ID: id, Nickname:nickname, board:undefined, placedBeans: []};
        gameInfo.playerList.push(player);
    });
    
    socket.on ("updateActivity", function(x, y, bool, id) {
        var coordinate = {y:y, x:x};
        for (i=0; i < gameInfo.playerList.length; i++) {
            if (gameInfo.playerList[i].ID === id) {
                var checkedPosition = gameInfo.playerList[i].placedBeans;
                
                if (bool) {
                    checkedPosition.push(coordinate);
                }
    
                else {
                    for (var i = 0; i < checkedPosition.length; i++) {
                         if (coordinate.x == checkedPosition[i].x && coordinate.y == checkedPosition[i].y) {
                             checkedPosition.splice(i,1);
                             break;
                         }
                    }
                }

                break;

            }
        }
        
        console.log(checkedPosition);
    });
    
    socket.on ("player left", function(id) {
        console.log("host: player left");
        for (var p = 0; p < gameInfo.playerList.length; p++) {
             if (gameInfo.playerList.ID == id) {
                 gameInfo.playerList.splice(p,1);
                 break;
             }
        }

    });
    
    shuffleDeck();
}

function player() {
    
    const table = _("board");
    const newBoard = _("newBoard");
    const tableCells = table.querySelectorAll('input[type="checkbox"]');
    const currentCard = _('currentCard');
    const winCondition = _('winConditionInfo');
    const announceWin = _("announceWin");
    const boardSelectOptions = _("boardSelectOptions");
    const boardOptions = document.querySelectorAll('input[name="boardNumber"]');
    
    let chosenBoard = null;
    let checkedPosition = [];

    function clearBeans() {
        tiles = board.getElementsByTagName('input');
        for (var i=0; i<tiles.length; i++) {
            if (tiles[i].type =='checkbox') {
                tiles[i].checked = false;
            }
            
        }
        opponentTiles = _("playerGraph").getElementsByTagName('input');
        for (w=0; w < opponentTiles.length; w++) {
            opponentTiles[w].checked = false;
        }
    }
    
    function drawTable() {
        cardOnBoard = [];
        for (var i = 0, row; row = table.rows[i]; i++) {
            for (var j = 0, col; col = row.cells[j]; j++) {
                cardOnBoardCheck = cardOnBoard.length;
                    
                while (cardOnBoard.length === cardOnBoardCheck ) {
                    card = (Math.floor(Math.random() * (54 - 1 + 1)) + 1);
        
                    if (cardOnBoard.includes(card) === false) {
                        cardOnBoard.push(card);
                        col.lastElementChild.src = "images/CAAR/" + card + '.jpeg';
                        col.addEventListener("click", function() {
                            var cell = this.cellIndex;
                            var row = this.parentNode.rowIndex;

                            socket.emit("activity", cell, row, this.firstElementChild.checked, roomNumber.innerHTML);
                        })

                    }
        
                }
            }
        }
        
    }
    //     for (k=0; k < tableCells.length; k++) {
    //         var changed = tableCells[k];
    //         var x = changed.parentNode.cellIndex;
    //         var y = changed.parentNode.parentNode.rowIndex;
    //         var bool = changed.checked;
    //         tableCells[k].addEventListener("click", function() {
    //             socket.emit("activity", this.parentNode.cellIndex, this.parentNode.parentNode.rowIndex, this.checked, roomNumber.innerHTML);
    //     })
    // }

    function pickBoard(evt) {
        evt.preventDefault();
        chosenBoard = document.querySelector('input[name="boardNumber"]:checked').value;
        Math.seedrandom(chosenBoard);
        drawTable();
        _("boardSelect").classList.add("invisible");
        table.classList.remove("invisible");
    }
    
    // function recordBoard() {
    //     var checkedList = document.querySelectorAll('input[name="boardCell"]:checked');
    //     for (d=0; d < checkedList.length; d++) {
    //         var row = checkedList[d].parentElement.parentElement.rowIndex;
    //         var cell = checkedList[d].parentElement.cellIndex;
    //         var coordinate = {y:row, x:cell};
    //         checkedPosition.push(coordinate);
    //     }
    //     return checkedPosition;
    // }
    
    // function announceWin(board, checked) {
    //     socket.emit("announce win", board, checked, roomNumber.innerHTML);
    // }
    
    function disableBoard(bool) {
        for (k=0; k < tableCells.length; k++) {
            tableCells[k].disabled = bool;
        }
        announceWin.disabled = bool;
        changeAlert("verifying");
    }
    
    newBoard.onclick = pickBoard;
    
    announceWin.addEventListener('click', function(event) {
        event.preventDefault();
        disableBoard(true);
        socket.emit("announce win", chosenBoard, roomInput);
    });
    
    function startEnd(bool) {
        // for (n=0; n<boardOptions.length; n++) {
        //     boardOptions[n].disabled = bool;
        // }
        // newBoard.disabled = bool;
        if (bool) {
            disableBoard(false);
        }
        else {
            clearBeans();
            currentCard.src="images/blank.png";
            winConditionInfo.src="images/blank.png";
            disableBoard(true);
            _("boardSelect").classList.remove("invisible");
        }
        
    }
    
    socket.on('game state', function(bool){
        startEnd(bool)
    });
    
    socket.on('current card', function(sentCard){
        currentCard.src = "images/CAAR/" + sentCard + '.jpeg';
    });
    
    socket.on('win condition', function(condition){
        winConditionInfo.src = "images/" + condition + '.png';
    });
    
    socket.on('win checked', function(bool){
        disableBoard(false);
    });
    
    _("roomNumber").innerHTML = roomInput;
    
    socket.emit('new player', roomInput, nickname);
    
    for (o=0; o < 75; o++) {
            var li = document.createElement("li");
            var input = document.createElement("input");
            input.setAttribute("type", "radio");
            input.setAttribute("name", "boardNumber");
            input.setAttribute("value", o);
            var label = document.createElement("label");
            label.setAttribute("for", o);
            label.appendChild(boardConstruct(o));
            li.appendChild(input);
            li.appendChild(label);
            li.addEventListener('click', function() {
                newBoard.disabled = false;
            });
            boardSelectOptions.appendChild(li);
    }
    
    
    // for (n=0; n<boardOptions.length; n++) {
    //     console.log("added event listener to boardOptions");
    //     boardOptions[n].addEventListener('click', function() {
    //         console.log("click on board option");
    //         newBoard.disabled = false;
    //     });
    // }

    socket.on('catch-up', function(gameInfo) {
        disableBoard(!gameInfo.gameState);
        if (!gameInfo.gameState) {
            currentCard.src = "images/blank.png";
        }
        else {
            currentCard.src = "images/CAAR/" + gameInfo.card + '.jpeg';
        }
        winConditionInfo.src = "images/" + gameInfo.goal + '.png';
        for (e=0; e < gameInfo.playerList.length; e++) {
            newPlayer(gameInfo.playerList[e].Nickname, gameInfo.playerList[e].ID);

            for (b=0; b < gameInfo.playerList[e].placedBeans.length; b++) {
                opponentUpdate(gameInfo.playerList[e].placedBeans[b].x, gameInfo.playerList[e].placedBeans[b].y, true, gameInfo.playerList[e].ID)
            }
        }
    });
    
    socket.on ("new player", function(nickname, id) {
        newPlayer(nickname, id);
    });
}

function load_page(page) {
    fetch(page + '.html')
        .then(function (data) {
            return data.text();
    })
    .then(function (html) {
        content.innerHTML = html;
        this[page]();
    });
}

function roomSearch(room, evt) {
    evt.preventDefault();
    socket.emit("room check", (room));
    socket.on('room join', function(bool){
        if (bool) {
            load_page("player");
        }
        else {
            console.log("error");
        }
    });
}

function opponentUpdate(x,y, bool, id) {
    var opponent = _(id).firstElementChild;
    opponent.rows[y].cells[x].checked = bool;
    opponent.rows[y].cells[x].firstElementChild.checked = bool;
}

socket.on ("updateActivity", function(x, y, bool, id) {
    opponentUpdate(x, y, bool, id);
});

socket.on ("player left", function(id) {
    _(id).remove(_(id));

        console.log("player left");

});

_("player").addEventListener('click', function(event) {
    roomInput = _("roomSearch").value;
    nickname = _("nickname").value;
    roomSearch(roomInput, event);
});

_("host").addEventListener('click', function(event) {
    load_page("host", event);
    event.preventDefault();
});