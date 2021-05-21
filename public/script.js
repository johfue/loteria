function _(x) {
	return document.getElementById(x);
}

var socket = io();
// var winCondition;
// var currentCard;
var opponentList = [];

content = document.getElementById("popItIn");

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

function newPlayer(id) {
    
    if (!opponentList.includes(id)) {
        var opponent = document.createElement("table");
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
            opponent.appendChild(row);
        }
        
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
    let drawnCards = [];
    let allegedWinnerID = null;
    
    var gameInfo = {
        gameState: false,
        pickedBoards: [],
        playerChecks: [],

    };
    
    var players = {
        id: null,
        nickname: "",
        board: null,
        boardChecked: [],
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
        socket.emit('win condition', currentWinCondition, roomNumber);
        gameSettings.classList.add("invisible");
        for (n=0; n<winCondition.length; n++) {
            winCondition[n].disabled = true;
        }
    }
    
    function startGame() {
        currentCard.src = "images/blank.png";
        shuffleDeck();
        drawBtn.disabled = false;
        winConditionBtn.disabled = true;
        socket.emit('game state', true, roomNumber);
    }
    
    function boardChecked(bool) {
        socket.emit('board checked', bool, allegedWinnerID);
        if (bool) {
            endGame();
        }
        allegedWinner.classList.add("invisible");
    }
    
    function checkBoard(board, checked, id) {
        allegedWinnerID = id;
        _(id).classList.add("winnerGlow");
    
        var quick = _(id).querySelectorAll('input');
        for (z=0; z < quick.length; z++) {
            quick[z].disabled = false;
        }

        _(id).addEventListener('click', function(event) {
            _(id).classList.remove("winnerGlow");
            checkBoardRender(board, checked);
            _(id).removeEventListener('click', checkBoardRender);
        });

    }
    
    function checkBoardRender(board, checked) {
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
    }

    _("confirm").addEventListener('click', boardChecked(true));
    _("deny").addEventListener('click', boardChecked(false));

    function endGame() {
        drawBtn.disabled = true;
        winConditionBtn.disabled = false;
        for (n=0; n<winCondition.length; n++) {
            winCondition[n].disabled = false;
        }
        drawnCards = [];
        currentCard.src="images/blank.png";
        gameSettings.classList.remove("invisible");
        opponentTiles = _("playerGraph").getElementsByTagName('input');
        losers = _("playerGraph").querySelectorAll(".winnerGlow");
        for (u=0; u < losers.length; u++) {
            losers[u].classList.remove("winnerGlow");
            losers[u].removeEventListener('click', checkBoardRender);

        }
        for (w=0; w < opponentTiles.length; w++) {
            opponentTiles[w].checked = false;
        }
        socket.emit('game state', false, roomNumber);
    }
    
    function drawCard(evt) {
        evt.preventDefault();
        cardDrawn = deckList[(Math.floor(Math.random() * (deckList.length - 1 + 1)))];
        currentCard.src = "images/CAAR/" + cardDrawn + ".jpeg";
        drawnCards.push(cardDrawn);
        
        deckList = deckList.filter(function(card) {
                return card !== cardDrawn;
            };
        );
        
        if (deckList.length <= 0) {
            endGame();
        }
        else {
            socket.emit('current card', cardDrawn, roomNumber);
        }
        
    }
    
    socket.on ("check win", function(board, checked, id) {
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
        startGame();
    });

    
    socket.on ("new player", function(id) {
        if (currentWinCondition === null ) {
            socket.emit('update newcomer', "blank", currentCard.src, roomNumber, id, opponentList, false);
        }
        else {
            socket.emit('update newcomer', currentWinCondition, currentCard.src, roomNumber, id, opponentList, true);
            
        }
        newPlayer(id);
    });
    
    drawBtn.onclick = drawCard;
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
        clearBeans();
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
                            var cell = this.parentNode.cellIndex;
                            var row = this.parentNode.parentNode.rowIndex;

                            var coordinate = {y:row, x:cell};
                            
                            if (checkedPosition.includes(coordinate)) {
                                checkedPosition.splice(chedckedPosition.indexOf(coordinate), 1);
                            }
                            
                            else if (this.checked) {
                                checkedPosition.push(coordinate);
                            }

                            socket.emit("activity", x, y, this.checked, roomNumber.innerHTML);
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
        socket.emit("announce win", chosenBoard, checkedPosition, roomInput);
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
        disabledBoard(false);
    });
    
    _("roomNumber").innerHTML = roomInput;
    
    socket.emit('new player', roomNumber.innerHTML);
    
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
            boardSelectOptions.appendChild(li);
    }
    
    
    for (n=0; n<boardOptions.length; n++) {
        boardOptions[n].addEventListener('click', function() {
            newBoard.disabled = false;
        });
    }

    socket.on('catch-up', function(condition, sentCard, id, opponentList, bool) {
        startEnd(bool);
        currentCard.src = sentCard;
        winConditionInfo.src = "images/" + condition + '.png';
        for (e=0; e < opponentList.length; e++) {
            newPlayer(opponentList[e]);
        }
    });
    socket.on ("new player", function(id) {
        newPlayer(id);
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
    var opponent = _(id);
    opponent.rows[y].cells[x].firstElementChild.checked = bool;
}

socket.on ("updateActivity", function(x, y, bool, id) {
    opponentUpdate(x, y, bool, id);
});

_("player").addEventListener('click', function(event) {
    roomInput = _("roomSearch").value;
    roomSearch(roomInput, event);
});

_("host").addEventListener('click', function(event) {
    load_page("host", event);
    event.preventDefault();
});