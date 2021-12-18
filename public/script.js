function _(x) {
	return document.getElementById(x);
}

var socket = io();
var opponentList = [];

content = _("popItIn");

function share() {
    if (navigator.share) {
      navigator.share({
        title: 'PlayLoteria.Online!',
        text: 'Come join my game!',
        url: location
      });
    }
    else {
        const copy = _("shareTextArea");
        
        copy.value = location;
        copy.select();
        copy.setSelectionRange(0, 9999);
        document.getElementById("alertModalSmall").classList.remove("invisible");
        shadowBox.classList.remove("invisible");
    }
}

function copyShare() {
    const copy = _("shareTextArea");
    
    copy.select();
    document.execCommand("copy");

    document.getElementById("alertModalSmall").classList.add("invisible");
    shadowBox.classList.add("invisible");
    
}

let oldID = "";

function storeID() {
    oldID = socket.id;
}

function targetDom() {
    const playerGraph = _("playerGraph");
    const infoHub = _("infoHub");
    const copy = _("shareTextArea");
    const shadowBox = _("shadowBox");
    const alertModal = _("alertModal");
    const bottomStripe = _("bottomStripe");
    const midStripe = _("midStripe");
    const topStripe = _("topStripe");
}

// function disconnectionHandler() {
//     socket.on("disconnect", (reason) => {
//         if (reason === "io server disconnect") {
//           // the disconnection was initiated by the server, you need to reconnect manually
//           console.log("disonnected by server");
//           socket.connect();
//         }
//         // else the socket will automatically try to reconnect
//         console.log("disonnected some other way " + oldID);
//     });
// }

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
    cellT.firstElementChild.src = "images/donClemente/" + card + '.jpg';
    tbl.rows[i].appendChild(cellT);
}

function drawCell(table) {
    col = table.rows[i].cells[j];
    col.lastElementChild.src = "images/donClemente/" + card + '.jpg';
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

function newPlayer(nickname, id, oldID) {
    if (opponentList.includes(oldID)) {
        _(oldID).remove(oldID);
    }

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
    window.onpopstate = function(event) {
        window.location = "/";
    };
    const drawBtn = _("drawBtn");
    const currentCard = _("currentCard");
    const winConditionBtn = _("winConditionBtn");
    const winCondition = document.querySelectorAll('input[name="winCondition"]');
    let currentWinCondition = null;
    const gameSettings = _("gameSettings");
    const winConditionInfo = _("winConditionInfo");
    const roomNumber = Math.floor(Math.random() * (999999 - 100000 + 1) ) + 100000;
    const invite = _("invite");
    const inviteClone = invite.cloneNode("true");
    const boardHold = _("boardHold");
    const board_tab_btn = _("board-tab-btn");
    const drawnCard_tab_btn = _("drawnCard-tab-btn");
    const allegedWinner = _("allegedWinner");
    const cardReview = _("cardReview");
    const cardReviewList = _("cardReviewList");
    const cardReviewListAlleged = _("cardReviewListAlleged");
    targetDom();

    let drawnCards = [];
    let allegedWinnerID = null;
    
    const continueGame = document.createElement("button");
    const restartGame = document.createElement("button");
    continueGame.setAttribute("class", "secondaryBtn");
    restartGame.setAttribute("class", "primaryBtn");

    restartGame.addEventListener('click', function(event) {
        event.preventDefault();
        bottomStripe.innerHTML = "";
        alertModal.classList.remove("paused");
        endGame();
    });
    
    socket.on("connect", function() {
        socket.emit("resync", roomNumber);
        socket.emit('current card', currentCard, roomNumber);
    });
    
    var gameInfo = {
        gameState: false,
        card: "blank",
        goal: "blank",
        playerList: [],
    };
    
    socket.emit('new room', roomNumber);

    socket.on('room clear', function(r){
        window.history.pushState('','', r);
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
    
    function reviewCards() {
        var cardReviewListFragment = document.createDocumentFragment();

        for (c=0; c < drawnCards.length; c++) {
            var li = document.createElement("li");
            var img = document.createElement("img");
            img.src = "images/donClemente/" + drawnCards[c] + ".jpg";
            li.appendChild(img);
            cardReviewListFragment.appendChild(li);
        }
        return cardReviewListFragment;
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
        shuffleDeck();
        alertModal.classList.remove("paused");
        winConditionBtn.disabled = true;
        reviewBtn.disabled = false;
        drawBtn.innerHTML = "Draw";
        gameInfo.gameState = true;
        socket.emit('game state', true, roomNumber);
        midStripe.innerHTML = "";
        topStripe.innerHTML = "Start"
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

        cardReviewListAlleged.appendChild(reviewCards());
        boardHold.appendChild(allegedBoard);
        shadowBox.classList.remove("invisible");
        allegedWinner.classList.remove("invisible");
        allegedWinnerID = id;

    }
    
    function boardChecked(bool) {
        socket.emit('board checked', bool, allegedWinnerID, roomNumber);
        continueGame.innerHTML = "Keep playing";
        restartGame.innerHTML = "New game";

        continueGame.addEventListener('click', function(event) {
            event.preventDefault();
            alertModal.classList.add("invisible");
            shadowBox.classList.add("invisible");
            alertModal.classList.remove("paused");
            bottomStripe.innerHTML = "";
        });


        if (bool) {
            bottomStripe.appendChild(restartGame);
            bottomStripe.appendChild(continueGame);
            topStripe.innerHTML = "Winner";
            for (n=0; n < gameInfo.playerList.length; n++) {
                if (gameInfo.playerList[n].ID === allegedWinnerID) {
                    midStripe.innerHTML = gameInfo.playerList[n].Nickname;
                    break;
                }
            }
            alertModal.classList.remove("paused");
            alertModal.classList.remove("invisible");
            alertModal.classList.add("slide");
            window.setTimeout(function() {
                alertModal.classList.add("paused");
            }, 2125);
        }
        else {
            shadowBox.classList.add("invisible");
        }
        // _(allegedWinnerID).removeEventListener('click', checkBoardRender(board, checked, id));
        //checks if the board is still there, then removes it
        if (_(allegedWinnerID)) {
            _(allegedWinnerID).removeEventListener('click', function(event) {
                checkBoardRender(board, checked, id);
            });
        }
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
        currentCard.src = "images/blank.svg";
        for (r=0; r < gameInfo.playerList.length; r++) {
            gameInfo.playerList[r].placedBeans = [];
        }
        drawBtn.disabled = true;
        reviewBtn.disabled = true;
        winConditionBtn.disabled = false;
        drawBtn.innerHTML = "Start";
        for (n=0; n<winCondition.length; n++) {
            winCondition[n].disabled = false;
        }
        alertModal.classList.add("invisible");
        gameSettings.classList.remove("invisible");
        opponentTiles = playerGraph.getElementsByTagName('td');
        losers = playerGraph.querySelectorAll(".winnerGlow");
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
            currentCard.src = "images/donClemente/" + cardDrawn + ".jpg";
            gameInfo.card = cardDrawn;
            drawnCards.push(cardDrawn);
            
            deckList.splice(deckList.indexOf(cardDrawn), 1);
            
            if (deckList.length === 0) {
                console.log("ran out of cards");
                reshuffle = continueGame.cloneNode('true');
                reshuffle.innerHTML = "Reshuffle cards";
                restartGame.innerHTML = "New game";
                
                reshuffle.addEventListener('click', function(event) {
                    event.preventDefault();
                    alertModal.classList.add("invisible");
                    shadowBox.classList.add("invisible");
                    alertModal.classList.remove("paused");
                    bottomStripe.innerHTML = "";
                    shuffleDeck();
                    drawnCards = [];
                    currentCard.src="images/blank.svg";
                });
                
                bottomStripe.appendChild(restartGame);
                bottomStripe.appendChild(reshuffle);
                topStripe.innerHTML = "Out of cards";
                
                alertModal.classList.remove("paused");
                alertModal.classList.remove("invisible");
                    alertModal.classList.add("slide");
                    window.setTimeout(function() {
                        alertModal.classList.add("paused");
                        }, 2125);
                shadowBox.classList.remove("invisible");

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
        cardReviewList.appendChild(reviewCards());
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

    invite.onclick = share;
    inviteClone.onclick = share;
    infoHub.onclick = share;
    alertModalSmall.onclick = copyShare;
    drawBtn.onclick = drawCard;
    
    socket.on ("new player", function(nickname, id, oldID) {
        socket.emit('update newcomer', gameInfo, id);
        newPlayer(nickname, id, oldID);
        let player = {ID: id, Nickname:nickname, board:undefined, placedBeans: []};
        if (gameInfo.playerList.length === 0) {
            _("invite").remove(_("invite"));
        }
        gameInfo.playerList.push(player);
    });
    
    socket.on ("board claim", function(claimedBoard, nickname, id) {
        for (i=0; i < gameInfo.playerList.length; i++) {
            if (gameInfo.playerList[i].ID === id) {
                gameInfo.playerList[i].board = claimedBoard;
                break;
            }
        }
    });
    
    socket.on ("updateActivity", function(x, y, bool, id) {
        let coordinate = {y:y, x:x};
        for (i=0; i < gameInfo.playerList.length; i++) {
            if (gameInfo.playerList[i].ID === id) {
                let checkedPosition = gameInfo.playerList[i].placedBeans;
                
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
        
    });
    
    socket.on ("player left", function(id) {
        for (var p = 0; p < gameInfo.playerList.length; p++) {
             if (gameInfo.playerList[p].ID == id) {
                 gameInfo.playerList.splice(p,1);
                 if (gameInfo.playerList.length < 1) {
                     playerGraph.appendChild(inviteClone);
                 }
                 break;
             }
        }
    });
    
    shuffleDeck();
    
    function tabSwitch() {
        board_tab_btn.classList.toggle("current-tab");
        drawnCard_tab_btn.classList.toggle("current-tab");
        cardReviewListAlleged.classList.toggle("invisible");
        boardHold.classList.toggle("invisible");
    }
    
    board_tab_btn.addEventListener("click", function(event) {
        tabSwitch();
    })
    drawnCard_tab_btn.addEventListener("click", function(event) {
        tabSwitch();
    })

}

function player() {
    window.onpopstate = function(event) {
    if(event.state === null) {
        event.preventDefault();
        return false;
    }
    else {
        window.location = "/";
    }
    };
    window.onhashchange = function(event) {
        history.replaceState = roomInput;
    }

    storeID();

    const table = _("board");
    const newBoard = _("newBoard");
    const tableCells = table.querySelectorAll('input[type="checkbox"]');
    const currentCard = _('currentCard');
    const winCondition = _('winConditionInfo');
    const announceWin = _("announceWin");
    const boardSelect = _("boardSelect");
    const boardSelectOptions = _("boardSelectOptions");
    const boardSelectOptionsWrap = _("boardSelectOptionsWrap");
    const boardOptions = document.querySelectorAll('input[name="boardNumber"]');
    const firstPage = _("firstPage");
    targetDom();
    let chosenBoard = null;
    let checkedPosition = [];
    let currentWinCondition = "";

    for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
            let col = table.rows[i].cells[j];
            col.addEventListener("click", function() {
                let cell = this.cellIndex;
                let row = this.parentNode.rowIndex;
                socket.emit("activity", cell, row, this.firstElementChild.checked, roomInput);
                });
        }
        
    }

    function clearBeans() {
        tiles = board.getElementsByTagName('input');
        for (var i=0; i<tiles.length; i++) {
            if (tiles[i].type =='checkbox') {
                tiles[i].checked = false;
            }
            
        }
        opponentTiles = playerGraph.getElementsByTagName('td');
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
            topStripe.innerHTML = "Start"
            shadowBox.classList.remove("invisible");
            alertModal.classList.remove("invisible");
            window.setTimeout(function() {
                alertModal.classList.add("invisible");
                shadowBox.classList.add("invisible");
                topStripe.innerHTML = "";
                midStripe.innerHTML = "";
            }, 2500);
            
        }
        else {
            clearBeans();
            currentCard.src="images/blank.svg";
            winConditionInfo.src="images/blank_sqaure.svg";
            disableBoard(true);
            shadowBox.classList.add("invisible");
            boardSelect.classList.remove("invisible");
        }
        
    }
    
    socket.on('game state', function(bool){
        startEnd(bool)
    });
    
    socket.on('current card', function(sentCard){
        currentCard.src = "images/donClemente/" + sentCard + '.jpg';
    });
    
    socket.on('win condition', function(condition){
        currentWinConditon = condition;
        winConditionInfo.src = "images/" + condition + '.svg';
    });
    
    socket.on('win checked', function(bool){
        if (bool) {
            topStripe.innerHTML = "You won!";
            shadowBox.classList.remove("invisible");
            alertModal.classList.remove("invisible");
            window.setTimeout(function() {
                alertModal.classList.add("invisible");
                shadowBox.classList.add("invisible");
                topStripe.innerHTML = "";
            }, 2500);
    
        }
        disableBoard(false);
    });
    
    _("roomNumber").innerHTML = roomInput;

    socket.emit('new player', roomInput, nickname);
    
    socket.on("connect", function() {
        storeID();
        // if has declared win, emit an extra thing, when player rejions see if it has that flag
        console.log("reconnected? " + oldID);
        socket.emit("rejoin room", (roomInput));
        socket.emit('new player', roomInput, nickname, oldID);
        getBeans();
    });



    function getBeans() {
        for (u = 0; u < 4; u++) {
            for (f = 0; f < 4; f++) {
                let col = table.rows[u].cells[f];
                socket.emit("activity", col.cellIndex, col.parentNode.rowIndex, col.firstElementChild.checked, roomInput);
                console.log(col.firstElementChild.checked);
            }
            
        } 
    }

    var boardSelectOptionsContainer = document.createDocumentFragment();
    var ol = document.createElement("ol");
    var li = document.createElement("li");
    var input = document.createElement("input");
    var span = document.createElement("span");
    var label = document.createElement("label");
    label.classList.add("radio-sibling");
    li.classList.add("boardSelect__li");
    ol.classList.add("boardSelect__page");
    span.classList.add("boardSelect__span");
    input.classList.add("boardSelect__input");
    input.setAttribute("type", "radio");
    input.setAttribute("name", "boardNumber");
    li.appendChild(input);
    li.appendChild(label);

    var claimToken = document.createElement("span");
    claimToken.classList.add("claimToken");

    function claimBoard(board, name, id) {
        let boardString = "[value=" + '"' + board + '"' + "]";
        claimedBoard = document.querySelector('input[name="boardNumber"]' + boardString);
        if (claimedBoard.checked) {
            claimedBoard.checked = false;
            newBoard.disabled = true;
        }
        
        if (_(id + "claimed") != null) {
            _(id + "claimed").previousSibling.disabled = false;
            _(id + "claimed").parentElement.classList.remove("claimed");
            _(id + "claimed").remove(_(id + "claimed"));
        }
        let claimTokenO = claimToken.cloneNode('true');
        claimTokenO.innerHTML = name;
        claimTokenO.setAttribute("id", id + "claimed");
        claimedBoard.disabled = true;
        claimedBoard.parentElement.classList.add("claimed");
        claimedBoard.insertAdjacentElement('afterend', claimTokenO);
    }

    for (p=0; p<7; p++) {
        let olO = ol.cloneNode('true');
        olO.setAttribute("id", "page_" + (p+1));
        for (b=0; b<9; b++) {
            let liO = li.cloneNode('true');
            let spanO = span.cloneNode('true');
            let currentBoard = (p*9) + (b+1);
            spanO.innerHTML = "#" + currentBoard;
            liO.children[0].setAttribute("value", currentBoard);
            liO.children[1].setAttribute("for", currentBoard);
            liO.children[1].appendChild(boardConstruct(currentBoard));
            liO.addEventListener('click', function() {
                newBoard.disabled = false;
                socket.emit('claim board', this.firstElementChild.value, nickname, roomInput);
            });
            liO.children[1].appendChild(spanO);
            olO.appendChild(liO);
        }
        boardSelectOptionsContainer.appendChild(olO);
    }
    boardSelectOptions.appendChild(boardSelectOptionsContainer);

    boardSelectOptionsWrap.onscroll = function() {scrollTrack()};
    
    function scrollTrack() {
        let winScroll = boardSelectOptionsWrap.scrollTop;
        let increment = boardSelectOptions.firstElementChild.offsetHeight;
        let scrolled = (Math.floor(winScroll / increment) + 1 );
        if (document.querySelector(".currentPage") === null) {
            firstPage.classList.add("currentPage");
        }
        else {
            document.querySelector(".currentPage").classList.remove("currentPage");
        }
        document.querySelector("#boardSelectPages li:nth-child(" + scrolled + ")").classList.add("currentPage");
    }

    infoHub.onclick = share;
    alertModalSmall.onclick = copyShare;

    function catchUp(gameInfo) {
        disableBoard(!gameInfo.gameState);
        if (!gameInfo.gameState) {
            console.log("this should run whenver there's no current card");
            currentCard.src = "images/blank.svg";
        }
        else {
            currentCard.src = "images/donClemente/" + gameInfo.card + '.jpg';
        }
        winConditionInfo.src = "images/" + gameInfo.goal + '.svg';

        for (e=0; e < gameInfo.playerList.length; e++) {
            iteratedPlayer = gameInfo.playerList[e];
            if (iteratedPlayer.board != null) {
                claimBoard(iteratedPlayer.board, iteratedPlayer.Nickname, iteratedPlayer.ID);
            }

            newPlayer(iteratedPlayer.Nickname, iteratedPlayer.ID);

            for (b=0; b < iteratedPlayer.placedBeans.length; b++) {
                opponentUpdate(iteratedPlayer.placedBeans[b].x, iteratedPlayer.placedBeans[b].y, true, iteratedPlayer.ID)
            }
        }
    }

    socket.on('catch-up', function(gameInfo) {
        catchUp(gameInfo);
    });

    socket.on("board claim", function(board, nickname, id) {
        claimBoard(board, nickname, id);
    });
    
    socket.on("new player", function(nickname, id, oldID) {
        newPlayer(nickname, id, oldID);
    });

    socket.on("fetch beans", function() {
        getBeans();
    });

    socket.on ("player left", function(id) {
        _(id + "claimed").parentElement.classList.remove("claimed");
        _(id + "claimed").previousSibling.disabled = false;
        _(id + "claimed").remove(_(id + "claimed"));
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
    // evt.preventDefault();
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
        window.history.pushState('','', _("roomSearch").value);
        load_page("player");
    }
    else {
        _("errorMsg2").classList.remove("invisible");
        _("errorMsg2").innerHTML = "Enter a nickname";
    }
}

function opponentUpdate(x,y, bool, id) {
    var opponent = _(id).firstElementChild;
    if (bool) {
        opponent.rows[y].cells[x].classList.add("beaned");
    }
    else {
        opponent.rows[y].cells[x].classList.remove("beaned");
    }
    playerGraph.insertBefore(_(id), playerGraph.firstElementChild)
}

socket.on("updateActivity", function(x, y, bool, id) {
    opponentUpdate(x, y, bool, id);
});

socket.on("player left", function(id) {
    _(id).remove(_(id));
});

// _("join").addEventListener('click', function(event) {
// });

_("welcomeForm").onsubmit = submit;

function submit(event) {
    roomInput = _("roomSearch").value;
    roomSearch(roomInput, event);
    event.preventDefault();
}


_("player").addEventListener('click', function(event) {
    nickname = _("nickname").value;
    nameCheck(nickname, event);
});

_("host").addEventListener('click', function(event) {
    load_page("host", event);
    event.preventDefault();
});