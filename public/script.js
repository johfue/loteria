function _(x) {
	return document.getElementById(x);
}

var socket = io();
// var winCondition;
// var currentCard;
var opponentList = [];

content = document.getElementById("popItIn");

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
                //iterate through columns
                //columns would be accessed using the "col" variable assigned in the for loop
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

function host() {
    const deck = _("drawBtn");
    const currentCard = _("currentCard");
    const winCondition = document.querySelectorAll('input[name="winCondition"]');
    const start = _("start");
    const roomNumber = Math.floor(Math.random() * (999999 - 100000 + 1) ) + 100000;
    var drawnCards = [];
    
    socket.emit('new room', (roomNumber));

    socket.on('room clear', function(r){
        _("roomNumber").innerHTML = r;
    });
    
    for (n=0; n<winCondition.length; n++) {
        winCondition[n].addEventListener('change', function() {
            console.log(1);
            start.disabled = false;
            console.log(2);
        });
    }
    
    function shuffleDeck() {
        deckList = [];
        for (var i=0; i<54; i++) {
            deckList.push(i+1);
        }
    }
    
    function startGame() {
        currentCard.src = "images/blank.png";
        shuffleDeck();
        deck.disabled = false;
        start.disabled = true;
        _("gameSettings").classList.add("invisible");
        currentWinCondition = document.querySelector('input[name="winCondition"]:checked').value;
        socket.emit('game state', true, roomNumber);
        socket.emit('win condition', currentWinCondition, roomNumber);
        for (n=0; n<winCondition.length; n++) {
            winCondition[n].disabled = true;
        }
        socket.emit('game state', true, roomNumber);
    }
    
    function checkBoard(board, checked, id) {
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
        _("boardHold").innerHTML = "";
        
        console.log(checked);
        for (b=0; b < checked.length; b++) {
            var currentCell = allegedBoard.rows[checked[b].y].cells[checked[b].x];
            currentCell.firstElementChild.checked = true;
        }
        var disableThis = allegedBoard.querySelectorAll("input");
        for (q=0; q < disableThis.length; q++) {
            disableThis[q].disabled = true;
        }
        _("allegedWinner").classList.remove("invisible");
        _("boardHold").appendChild(allegedBoard);
    }
    
    function endGame() {
        deck.disabled = true;
        start.disabled = false;
        for (n=0; n<winCondition.length; n++) {
            winCondition[n].disabled = false;
        }
        drawnCards = [];
        currentCard.src="images/blank.png";
        _("gameSettings").classList.remove("invisible");
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
        
        deckList = deckList.filter(function(item) {
            return item !== cardDrawn;
            }
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
        console.log(checked);
    });
    
    currentCard.addEventListener('click', function() {
        _("cardReviewList").innerHTML = "";
        for (c=0; c < drawnCards.length; c++) {
            var li = document.createElement("li");
            var img = document.createElement("img");
            img.src = "images/CAAR/" + drawnCards[c] + ".jpeg";
            li.appendChild(img);
            _("cardReviewList").appendChild(li);
        }
        _("cardReview").classList.remove("invisible");
    });
    
    _("closeReview").addEventListener('click', function(event) {
        event.preventDefault();
        _("cardReview").classList.add("invisible");
    });
    
    _("confirm").addEventListener('click', function(event) {
        event.preventDefault();
        _("allegedWinner").classList.add("invisible");
        endGame();
    });
    _("deny").addEventListener('click', function(event) {
        event.preventDefault();
        _("allegedWinner").classList.add("invisible");
    });
    start.addEventListener('click', function(event) {
        event.preventDefault();
        startGame();
    });
    
    function newPlayer(id) {
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
    
    socket.on ("new player", function(id) {
        if (document.querySelector('input[name="winCondition"]:checked') === null ) {
            socket.emit('update newcomer', "blank", currentCard.src, roomNumber, id, opponentList, false);
        }
        else {
            socket.emit('update newcomer', document.querySelector('input[name="winCondition"]:checked').value, currentCard.src, roomNumber, id, opponentList, true);
            
        }
        newPlayer(id);
    });
    
    deck.onclick = drawCard;
    shuffleDeck();
}

function player() {
    
    var table = _("board");
    
    var newBoard = _("newBoard");
    
    var tableCells = table.querySelectorAll('input[type="checkbox"]');
    
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
        
                    }
        
                }
            }
        }
        
    }
        for (k=0; k < tableCells.length; k++) {
            var changed = tableCells[k];
            var x = changed.parentNode.cellIndex;
            var y = changed.parentNode.parentNode.rowIndex;
            var bool = changed.checked;
            tableCells[k].addEventListener("click", function() {
                socket.emit("activity", this.parentNode.cellIndex, this.parentNode.parentNode.rowIndex, this.checked, roomNumber.innerHTML);
        })
    }


    function pickBoard(evt) {
        evt.preventDefault();
        var chosenBoard = document.querySelector('input[name="boardNumber"]:checked').value;
        Math.seedrandom(chosenBoard);
        drawTable();
        _("boardSelect").classList.add("invisible");
        table.classList.remove("invisible");
    }
    
    function recordBoard() {
        var checkedList = document.querySelectorAll('input[name="boardCell"]:checked');
        var checkedPosition = [];
        for (d=0; d < checkedList.length; d++) {
            var row = checkedList[d].parentElement.parentElement.rowIndex;
            var cell = checkedList[d].parentElement.cellIndex;
            var coordinate = {y:row, x:cell};
            checkedPosition.push(coordinate);
        }
        return checkedPosition;
    }
    
    function announceWin(board, checked) {
        socket.emit("announce win", board, checked, roomNumber.innerHTML);
    }
    
    newBoard.onclick = pickBoard;
    
    _("announceWin").addEventListener('click', function(event) {
        event.preventDefault();
        announceWin(document.querySelector('input[name="boardNumber"]:checked').value, recordBoard(), event);
        console.log(recordBoard())
    });
    
    function startEnd(bool) {
        // for (n=0; n<boardOptions.length; n++) {
        //     boardOptions[n].disabled = bool;
        // }
        // newBoard.disabled = bool;
        if (bool) {
            for (h=0; h < tableCells.length; h++) {
                tableCells[h].disabled = false;
                _("announceWin").disabled = false;
            }
        }
        else {
            clearBeans();
            _("currentCard").src="images/blank.png";
            _("winConditionInfo").src="images/blank.png";
            for (h=0; h < tableCells.length; h++) {
                tableCells[h].disabled = true;
            }
            _("announceWin").disabled = true;
            _("boardSelect").classList.remove("invisible");
        }
        
    }
    
    socket.on('game state', function(bool){
        startEnd(bool)
    });
    
    socket.on('current card', function(sentCard){
        _('currentCard').src = "images/CAAR/" + sentCard + '.jpeg';
    });
    
    socket.on('win condition', function(condition){
        _('winConditionInfo').src = "images/" + condition + '.png';
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
            _("boardSelectOptions").appendChild(li);
    }
    
    var boardOptions = document.querySelectorAll('input[name="boardNumber"]');
    
    for (n=0; n<boardOptions.length; n++) {
        boardOptions[n].addEventListener('click', function() {
            newBoard.disabled = false;
        });
    }
    // drawTable();
    


    
    function newPlayer(id) {
        console.log(340);
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
    
    socket.on('catch-up', function(condition, sentCard, id, opponentList, bool) {
        startEnd(bool);
        _('currentCard').src = sentCard;
        _('winConditionInfo').src = "images/" + condition + '.png';
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