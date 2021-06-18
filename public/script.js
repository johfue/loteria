function _(x) {
	return document.getElementById(x);
}

var socket = io();
var opponentList = [];

content = _("popItIn");

function changeAlert(string) {
    return string;
}

function generateCardOnBoard(func, param, arg) {
    cardOnBoard = [];
        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                cardOnBoardCheck = cardOnBoard.length;
                while (cardOnBoard.length === cardOnBoardCheck ) {
                    card = (Math.floor(Math.random() * (54 - 1 + 1)) + 1);
        
                    if (cardOnBoard.includes(card) === false) {
                        cardOnBoard.push(card);
                        func(param, arg);
                    }
                }
            }
        }
}


function appendCell(cell, tbl) {
    let cellT = cell.cloneNode(true);
    cellT.firstElementChild.src = "images/CAAR/" + card + '.jpeg';
    tbl.rows[i].appendChild(cellT);
}

function drawCell(table) {
    col = table.rows[i].cells[j];
    col.lastElementChild.src = "images/CAAR/" + card + '.jpeg';
    col.addEventListener("click", function() {
        var cell = this.cellIndex;
        var row = this.parentNode.rowIndex;
        socket.emit("activity", cell, row, this.firstElementChild.checked, roomNumber.innerHTML);
    });
}

function boardConstruct(seed) {
    Math.seedrandom(seed.toString());
    let tbl = document.createElement("table");
    let tblRow = document.createElement("tr");
    for (v=0; v < 4; v++) {
        let tblRowV = tblRow.cloneNode();
        tbl.appendChild(tblRowV);
    }
    let cell = document.createElement("td");
    cell.setAttribute("class", "alleged__cell");
    let img = document.createElement("img");
    cell.appendChild(img);
    
    generateCardOnBoard(appendCell, cell, tbl);

    return tbl;
}


function newPlayer(nickname, id) {
    
    if (!opponentList.includes(id)) {
        var opponent = document.createElement("div");
        var opponentTable = document.createElement("table");
        var opponentName = document.createElement("span");
        var row = document.createElement("tr");
        var cell = document.createElement("td");
        opponentTable.setAttribute("class", "player__table");
        cell.setAttribute("class", "player__cell");

        
        opponentName.innerHTML = nickname;
        opponent.setAttribute("id", id);
        opponent.setAttribute("class", "player");
        opponentName.setAttribute("class", "player__span");
        opponentList.push(id);
        
        for (j = 0; j < 4; j++) {
            let cellJ = cell.cloneNode();
            row.appendChild(cellJ);
        }
        for (r = 0; r < 4; r++) {
            let rowR = row.cloneNode('true');
            opponentTable.appendChild(rowR);
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
    const alertModal = _("alertModal");
    const cardReviewListAlleged = _("cardReviewListAlleged");
    const shadowBox = _("shadowBox");
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
        winConditionInfo.src =  "images/" + currentWinCondition + ".svg";
        gameInfo.goal = currentWinCondition;
        socket.emit('win condition', currentWinCondition, roomNumber);
        drawBtn.disabled = false;
        gameSettings.classList.add("invisible");
        shadowBox.classList.add("invisible");
        for (n=0; n<winCondition.length; n++) {
            winCondition[n].disabled = true;
        }
    }
    
    function startGame() {
        currentCard.src = "images/blank.svg";
        shuffleDeck();
        winConditionBtn.disabled = true;
        reviewBtn.disabled = false;
        drawBtn.innerHTML = "Draw";
        gameInfo.gameState = true;
        socket.emit('game state', true, roomNumber);
        _("topStripe").innerHTML = "Game Start"
        _("midStripe").innerHTML = "How to win: " + currentWinCondition;
        alertModal.classList.remove("invisible");
        shadowBox.classList.remove("invisible");
        alertModal.classList.add("slide");
        window.setTimeout(function() {
            alertModal.classList.add("invisible");
            shadowBox.classList.add("invisible");
        }, 2500);

    }

    function checkBoard(board, checked, id) {
        _(id).classList.add("winnerGlow");
        _(id).addEventListener('click', function(event) {
            checkBoardRender(board, checked, id);
        });
}

    function checkBoardRender(board, checked, id) {
        _(id).classList.remove("winnerGlow");
        var allegedBoard = boardConstruct(board);
        let allegedName = "";
        for (n=0; n < gameInfo.playerList.length; n++) {
            if (gameInfo.playerList[n].ID === id) {
                _("allegedWinnerName").innerHTML = gameInfo.playerList[n].Nickname;;
                break;
            }
        }

        boardHold.innerHTML = "";

        for (b=0; b < checked.length; b++) {
            var currentCell = allegedBoard.rows[checked[b].y].cells[checked[b].x];
            currentCell.classList.add("beaned");
        }
        var disableThis = allegedBoard.querySelectorAll("input");
        for (q=0; q < disableThis.length; q++) {
            disableThis[q].disabled = true;
        }
        cardReviewListAlleged.innerHTML = "";
        for (c=0; c < drawnCards.length; c++) {
            var li = document.createElement("li");
            var img = document.createElement("img");
            img.src = "images/CAAR/" + drawnCards[c] + ".jpeg";
            li.appendChild(img);
            cardReviewListAlleged.appendChild(li);
        }
        boardHold.appendChild(allegedBoard);
        shadowBox.classList.remove("invisible");
        allegedWinner.classList.remove("invisible");
        allegedWinnerID = id;

    }
    
    function boardChecked(bool) {
        socket.emit('board checked', bool, allegedWinnerID, roomNumber);
        let continueGame = document.createElement("button");
        let restartGame = document.createElement("button");
        continueGame.setAttribute("class", "secondaryBtn");
        restartGame.setAttribute("class", "primaryBtn");
        continueGame.innerHTML = "Keep playing";
        restartGame.innerHTML = "New game";

        
        restartGame.addEventListener('click', function(event) {
            event.preventDefault();
            endGame();
            _("bottomStripe").innerHTML = "";
            alertModal.classList.remove("paused");

        });
    
        continueGame.addEventListener('click', function(event) {
            event.preventDefault();
            alertModal.classList.add("invisible");
            shadowBox.classList.add("invisible");
            alertModal.classList.remove("paused");
            _("bottomStripe").innerHTML = "";
        });


        if (bool) {
            _("bottomStripe").appendChild(restartGame);
            _("bottomStripe").appendChild(continueGame);
            _("topStripe").innerHTML = "Winner";
            for (n=0; n < gameInfo.playerList.length; n++) {
                if (gameInfo.playerList[n].ID === allegedWinnerID) {
                    _("midStripe").innerHTML = gameInfo.playerList[n].Nickname;
                    break;
                }
            }            alertModal.classList.remove("invisible");
            alertModal.classList.add("slide");
            window.setTimeout(function() {
                alertModal.classList.add("paused");
            }, 2125);
        }
        else {
            shadowBox.classList.add("invisible");
        }
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
        reviewBtn.disabled = true;
        winConditionBtn.disabled = false;
        drawBtn.innerHTML = "Start";
        for (n=0; n<winCondition.length; n++) {
            winCondition[n].disabled = false;
        }
        drawnCards = [];
        currentCard.src="images/blank.svg";
        alertModal.classList.add("invisible");
        gameSettings.classList.remove("invisible");
        opponentTiles = _("playerGraph").getElementsByTagName('td');
        losers = _("playerGraph").querySelectorAll(".winnerGlow");
        for (u=0; u < losers.length; u++) {
            losers[u].classList.remove("winnerGlow");
            losers[u].removeEventListener('click', checkBoardRender(board, checked, id));

        }
        for (w=0; w < opponentTiles.length; w++) {
            opponentTiles[w].classList.remove("beaned");
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
        shadowBox.classList.remove("invisible");
    
    });
    
    _("closeReview").addEventListener('click', function(event) {
        event.preventDefault();
        cardReview.classList.add("invisible");
        shadowBox.classList.add("invisible");
    });
    
    winConditionBtn.addEventListener('click', function(event) {
        event.preventDefault();
        chooseWinCondition();
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
    
    function tabSwitch() {
        cardReviewListAlleged.classList.toggle("invisible");
        boardHold.classList.toggle("invisible");
    }
    
    _('board-tab-btn').addEventListener("click", function(event) {
        tabSwitch();
    })
    _('drawnCard-tab-btn').addEventListener("click", function(event) {
        tabSwitch();
    })
}

function player() {
    
    const table = _("board");
    const newBoard = _("newBoard");
    const tableCells = table.querySelectorAll('input[type="checkbox"]');
    const currentCard = _('currentCard');
    const winCondition = _('winConditionInfo');
    const announceWin = _("announceWin");
    const boardSelect = _("boardSelect");
    const boardSelectOptions = _("boardSelectOptions");
    const boardOptions = document.querySelectorAll('input[name="boardNumber"]');
    const shadowBox = _("shadowBox");
    const alertNodal = _("alertModal");
    
    let chosenBoard = null;
    let checkedPosition = [];
    let currentWinCondition = "";

    function clearBeans() {
        tiles = board.getElementsByTagName('input');
        for (var i=0; i<tiles.length; i++) {
            if (tiles[i].type =='checkbox') {
                tiles[i].checked = false;
            }
            
        }
        opponentTiles = _("playerGraph").getElementsByTagName('td');
        for (w=0; w < opponentTiles.length; w++) {
            opponentTiles[w].classList.remove("beaned");
        }
    }
    
    function drawTable() {
        generateCardOnBoard(drawCell, table);
    }

    function pickBoard(evt) {
        evt.preventDefault();
        chosenBoard = document.querySelector('input[name="boardNumber"]:checked').value;
        Math.seedrandom(chosenBoard);
        drawTable();
        boardSelect.classList.add("invisible");
        table.classList.remove("invisible");
        shadowBox.classList.add("invisible")
    }
    
    function disableBoard(bool) {
        for (k=0; k < tableCells.length; k++) {
            tableCells[k].disabled = bool;
        }
        if (bool) {
            _("waitingModal").classList.remove("invisible");
        }
        else {
            _("waitingModal").classList.add("invisible");
        }
        
        announceWin.disabled = bool;
    }
    
    newBoard.onclick = pickBoard;
    
    announceWin.addEventListener('click', function(event) {
        event.preventDefault();
        disableBoard(true);
        socket.emit("announce win", chosenBoard, roomInput);
    });
    
    function startEnd(bool) {
        if (bool) {
            disableBoard(false);
            console.log("game started")
            _("topStripe").innerHTML = "Game Start"
            _("midStripe").innerHTML = "How to win: " + currentWinCondition;
            shadowBox.classList.remove("invisible");
            alertModal.classList.remove("invisible");
            window.setTimeout(function() {
                alertModal.classList.add("invisible");
                shadowBox.classList.add("invisible");
                _("topStripe").innerHTML = "";
                _("midStripe").innerHTML = "";
            }, 2500);
            
        }
        else {
            clearBeans();
            currentCard.src="images/blank.svg";
            winConditionInfo.src="images/blank.svg";
            disableBoard(true);
            shadowBox.classList.add("invisible");
            boardSelect.classList.remove("invisible");
        }
        
    }
    
    socket.on('game state', function(bool){
        startEnd(bool)
    });
    
    socket.on('current card', function(sentCard){
        currentCard.src = "images/CAAR/" + sentCard + '.jpeg';
    });
    
    socket.on('win condition', function(condition){
        currentWinConditon = condition;
        winConditionInfo.src = "images/" + condition + '.svg';
    });
    
    socket.on('win checked', function(bool){
        if (bool) {
                _("topStripe").innerHTML = "Congratulations";
            shadowBox.classList.remove("invisible");
            alertModal.classList.remove("invisible");
            window.setTimeout(function() {
                alertModal.classList.add("invisible");
                shadowBox.classList.add("invisible");
                _("topStripe").innerHTML = "";
            }, 2500);
    
        }
        disableBoard(false);
    });
    
    _("roomNumber").innerHTML = roomInput;
    
    socket.emit('new player', roomInput, nickname);
    
    var boardSelectOptionsContainer = document.createDocumentFragment();
    var li = document.createElement("li");
    var input = document.createElement("input");
    input.setAttribute("type", "radio");
    input.setAttribute("name", "boardNumber");
    var label = document.createElement("label");
    li.appendChild(input);
    li.appendChild(label);

    for (o=0; o < 63; o++) {
        let liO = li.cloneNode('true');
        liO.children[1].setAttribute("value", o);
        liO.children[1].setAttribute("for", o);
        liO.children[1].appendChild(boardConstruct(o));
        liO.addEventListener('click', function() {
            newBoard.disabled = false;
        });
    
        boardSelectOptionsContainer.appendChild(liO);
    }
    boardSelectOptions.appendChild(boardSelectOptionsContainer);

    socket.on('catch-up', function(gameInfo) {
        disableBoard(!gameInfo.gameState);
        if (!gameInfo.gameState) {
            currentCard.src = "images/blank.svg";
        }
        else {
            currentCard.src = "images/CAAR/" + gameInfo.card + '.jpeg';
        }
        winConditionInfo.src = "images/" + gameInfo.goal + '.svg';
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
            _("welcomeForm").classList.add("invisible");
            _("host").classList.add("invisible");
            _("nameForm").classList.remove("invisible");
        }
        else {
            _("errorMsg1").classList.remove("invisible");
            _("errorMsg1").innerHTML = "Can't find room";
        }
    });
}

function nameCheck(name, evt) {
    evt.preventDefault();
    if (_("nickname").value.length > 0) {
        load_page("player");
    }
    else {
        _("errorMsg2").classList.remove("invisible");
        _("errorMsg2").innerHTML = "Enter a nickname";
    }
}

function opponentUpdate(x,y, bool, id) {
    var opponent = _(id).firstElementChild;
    opponent.rows[y].cells[x].classList.toggle("beaned");
}

socket.on ("updateActivity", function(x, y, bool, id) {
    opponentUpdate(x, y, bool, id);
});

socket.on ("player left", function(id) {
    _(id).remove(_(id));

});

_("join").addEventListener('click', function(event) {
    roomInput = _("roomSearch").value;
    roomSearch(roomInput, event);
});

_("player").addEventListener('click', function(event) {
    nickname = _("nickname").value;
    nameCheck(nickname, event);
});

_("host").addEventListener('click', function(event) {
    load_page("host", event);
    event.preventDefault();
});