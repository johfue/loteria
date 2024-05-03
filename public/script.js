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

var deck = [];

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
    const winConditionInfo = _("winConditionInfo");
}

function generateCardOnBoard(func, param, arg) {
    cardOnBoard = [];
        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                cardOnBoardCheck = cardOnBoard.length;
                while (cardOnBoard.length === cardOnBoardCheck ) {
                    card = (Math.floor(Math.random() * (deck.length - 1 + 1)) + 1);
        
                    if (cardOnBoard.includes(card-1) === false) {
                        cardOnBoard.push(card-1);
                        func(param, arg);
                    }
                }
            }
        }
}

function appendCell(cell, tbl) {
    let cellT = cell.cloneNode(true);
    cellT.firstElementChild.src = "images/donClemente/" + deck[card-1] + '.jpg';
    tbl.rows[i].appendChild(cellT);
}

function drawCell(table) {
    col = table.rows[i].cells[j];
    col.lastElementChild.src = "images/donClemente/" + deck[card-1] + '.jpg';
}

function boardConstruct(seed) {
    Math.seedrandom(seed.toString() + "Q");
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

function newPlayer(nickname, id, oldID, bool) {
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
        
        if (bool) {
            opponentName.setAttribute("id", "player__span--" + id);
            opponentTable.setAttribute("id", "player__table--" + id);
            opponentName.classList.add("player__span--host");
        }
        
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
        playerGraph.appendChild(opponent);
    }
}

const delayList = {
    row: 10000,
    column: 10000,
    diagonal: 6000,
    corners: 3500,
    inside: 3500,
    outside: 3500,
    z: 3500,
    n: 3500,
    blackOut: 3500,
    twoByTwo: 9000,
};

function loopSetWinAnimation(arr) {
    
Promise.resolve().then(function resolver() {
    return setWinAnimation(arr)
    .then(resolver);
}).catch((error) => {
    console.log("Error: " + error);
});
}

function setWinAnimation(arr) {
    return arr.reduce(function(promise, item) {
    return promise.then(function() {
        return launchChain(item);
    });
    // uses this orignal promise to start the chaining.
    }, Promise.resolve());
}

let round = 1;
let currentRound = 1;


function launchChain(rule) {
    return new Promise(function(resolve, reject) {
      
    winConditionInfo.classList.add(rule);
    let currentRound = round;
    setTimeout(function() {
    winConditionInfo.classList.remove(rule);
        if (round > currentRound) {
            reject();
        }
        else {
            resolve();

        }
    }, delayList[rule]);
    
    // animate(winConditionInfo, delay);
    // setTimeout(function() {
    //   console.log(delay);
    //   resolve();
    // }, delay);
  });
}


// common function to apply animations to an element.
function animate(elem, animation) {
    return new Promise((resolve, reject) => {
    function handleAnimationEnd() {
            resolve(elem);
    }
    elem.classList.add(animation);
    setTimeout(function() {
    elem.classList.remove(animation);
        handleAnimationEnd();
    }, delayList[animation]);
    // elem.addEventListener("animationend", handleAnimationEnd, { once: true });
  });
}


function setWinCondition (conditions) {
    // winConditionInfo.setAttribute("class", "winInfo winInfo--host");
    round += 1;
    loopSetWinAnimation(conditions);
    winConditionInfo.style.animationPlayState = 'running';
    winConditionInfo.classList.add("looping");

    // winConditionInfo.classList.add("class", condition);
}

function host() {

    var link = document.createElement('meta');
    link.setAttribute('property', 'og:url');
    link.content = document.location;
    document.getElementsByTagName('head')[0].appendChild(link);

    window.onpopstate = function(event) {
        window.location = "/";
    };
    const drawBtn = _("drawBtn");
    const currentCard = _("currentCard");
    const winConditionBtn = _("winConditionBtn");
    const winCondition = document.querySelectorAll('input[name="winCondition"]');
    let currentWincondition = [];
    const gameSettings = _("gameSettings");
    const winConditionInfo = _("winConditionInfo");
    const roomNumber = Math.floor(Math.random() * (999999 - 100000 + 1) ) + 100000;
    // const roomNumber = Math.floor(Math.random() * (999999 - 100000 + 1) ) + 100000;
    const invite = _("invite");
    const inviteClone = invite.cloneNode("true");
    const boardHold = _("boardHold");
    const board_tab_btn = _("board-tab-btn");
    const drawnCard_tab_btn = _("drawnCard-tab-btn");
    const allegedWinner = _("allegedWinner");
    const cardReview = _("cardReview");
    const cardReviewList = _("cardReviewList");
    const cardReviewListAlleged = _("cardReviewListAlleged");
    const allegedBtnWrap = _("alleged__btnWrap");
    const allegedWinnerh2 = _("allegedWinner__h2");
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
        socket.emit("rejoin room", roomNumber);
        socket.emit("resync", roomNumber);
        socket.emit('current card', currentCard, roomNumber);
    });

    var gameInfo = {
        gameState: false,
        card: true,
        goal: "blank",
        playerList: [],
    };
    
    socket.emit('new room', roomNumber);

    socket.on('room clear', function(r){
        console.log("room clear")
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
        for (var i=0; i<deck.length; i++) {
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
        let currentWinCondition = [];
        let selectedWinConditions = document.querySelectorAll('input[name="winCondition"]:checked');
        // if (selectedWinConditions.length === 1) {
        //     currentWinCondition = selectedWinConditions.value;
        // }
        
        // else {
        for (n=0; n<selectedWinConditions.length; n++) {
            currentWinCondition.push(selectedWinConditions[n].value);
        }
        // }
        
        // winConditionInfo.src =  "images/" + currentWinCondition + ".svg";
        setWinCondition(currentWinCondition);

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
        drawnCards = [];
        gameInfo.card = true;
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
    
    const confirmBtn = document.createElement("button");
    confirmBtn.setAttribute("class", "primaryBtn modal__btn");
    const denyBtn = document.createElement("button");
    denyBtn.setAttribute("class", "denyBtn modal__btn");
    const closeBtn = document.createElement("button");
    closeBtn.setAttribute("class", "secondaryBtn modal__btn");
    
    confirmBtn.innerHTML = "Yes";
    denyBtn.innerHTML = "No";
    closeBtn.innerHTML = "Close";

    confirmBtn.addEventListener('click', function(event) {
        boardChecked(true);
    });
    denyBtn.addEventListener('click', function(event) {
        boardChecked(false);
    });
    closeBtn.addEventListener('click', function(event) {
        allegedWinner.classList.add("invisible");
        shadowBox.classList.add("invisible");
    });
    
    function checkBoardRender(id) {
        let checked = [];
        let board = "";
        for (n=0; n < gameInfo.playerList.length; n++) {
            if (gameInfo.playerList[n].ID === id) {
                _("allegedWinnerName").innerHTML = gameInfo.playerList[n].Nickname;
                checked = gameInfo.playerList[n].placedBeans;
                board = gameInfo.playerList[n].board;
                break;
            }
        }

        var allegedBoard = boardConstruct(board);

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
        _("allegedWinner__h2").innerHTML = "";
        _("alleged__btnWrap").innerHTML = "";

        let allegedBtns = document.createDocumentFragment()

        if (_("player__table--" + id).classList.contains("winnerGlow")) {
            _("allegedWinner__h2").innerHTML = '<span class="modal__span">Do we have a </span><br>winner?';
            allegedBtns.appendChild(confirmBtn);
            allegedBtns.appendChild(denyBtn);
        }
        
        else {
            allegedBtns.appendChild(closeBtn);
        }
        
        _("alleged__btnWrap").appendChild(allegedBtns)

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

        socket.on("sync checked", function(nickname, id, oldID) {
            allegedWinnerID = id;
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
        _("player__table--" + allegedWinnerID).classList.remove("winnerGlow")
        allegedWinner.classList.add("invisible");
        allegedWinnerID = null;
        
    }

    function endGame() {
        currentCard.src = "images/blank.svg";
        for (r=0; r < gameInfo.playerList.length; r++) {
            gameInfo.playerList[r].placedBeans = [];
        }
        drawBtn.disabled = true;
        reviewBtn.disabled = true;
        winConditionBtn.disabled = false;
        winConditionInfo.animatio
        winConditionInfo.style.animationPlayState = 'paused';
        for (n=0; n<winCondition.length; n++) {
            winCondition[n].disabled = false;
        }
        alertModal.classList.add("invisible");
        gameSettings.classList.remove("invisible");
        opponentTiles = playerGraph.getElementsByTagName('td');
        losers = playerGraph.querySelectorAll(".winnerGlow");
        for (u=0; u < losers.length; u++) {
            losers[u].classList.remove("winnerGlow");
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
            currentCard.src = "images/donClemente/" + deck[cardDrawn-1] + ".jpg";
            gameInfo.card = deck[cardDrawn-1];
            drawnCards.push(deck[cardDrawn-1]);
            
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
        _("player__table--" + id).classList.add("winnerGlow");
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
        socket.emit('update newcomer', gameInfo, id, deck);
        newPlayer(nickname, id, oldID, true);
        
        let joiningPlayer = _("player__span--" + id);
        
        _(id).addEventListener('click', function(event) {
            checkBoardRender(id);
        });
        joiningPlayer.addEventListener('click', function(event) {
            socket.emit("remove player", nickname, id, roomNumber);
            event.stopPropagation();
        });        // var checkBtn = document.createElement("button");
        // checkBtn.addEventListener('click', function(event) {
        //     checkBoardRender(id);

        // });

        // var removeBtn = document.createElement("button");
        // removeBtn.addEventListener('click', function(event) {
        //     socket.emit("remove player", nickname, id, roomNumber);
        // });
        
        // checkRemoveBtns = document.createDocumentFragment();
        // checkRemoveBtns.appendChild(checkBtn);
        // checkRemoveBtns.appendChild(removeBtn);
        // _(id).appendChild(checkRemoveBtns);
        
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
    var link = document.createElement('meta');
    link.setAttribute('property', 'og:url');
    link.content = document.location;
    document.getElementsByTagName('head')[0].appendChild(link);

    document.getElementsByTagName('head')[0].appendChild(link);
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
    let currentWinCondition = [];

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
        Math.seedrandom(chosenBoard + "Q");
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
    
    beingChecked = false;

    announceWin.addEventListener('click', function(event) {
        event.preventDefault();
        disableBoard(true);
        socket.emit("announce win", chosenBoard, roomInput);
        beingChecked = true;
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
            winConditionInfo.style.animationPlayState = "paused";
            disableBoard(true);
            shadowBox.classList.add("invisible");
            boardSelect.classList.remove("invisible");
            beingChecked = false;
        }
        
    }
    
    socket.on('game state', function(bool){
        startEnd(bool)
    });
    
    socket.on('current card', function(sentCard){
        currentCard.src = "images/donClemente/" + deck[sentCard-1] + '.jpg';
    });
    
    socket.on('win condition', function(condition){
        winConditionInfo.setAttribute("class", "winInfo winInfo--player");
        setWinCondition(condition);
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
        beingChecked = false;
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

    socket.on("resync", function() {
        if (!caughtUp) {
            socket.emit('new player', roomInput, nickname, oldID);
        }
        if (beingChecked) {
            socket.emit('sync checked', roomInput, nickname, oldID);
        }
        getBeans();
    });

    socket.on("kick out", function() {
        location.reload();
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
    function generateBoardOptions() {
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

}

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

    caughtUp = false;

    function catchUp(gameInfo, deckList) {
        deck = deckList;
        generateBoardOptions();
        disableBoard(!gameInfo.gameState);
        if (typeof gameInfo.card == "boolean") {
            currentCard.src = "images/blank.svg";
        }
        else {
            currentCard.src = "images/donClemente/" + deck[gameInfo.card-1] + '.jpg';
        }
        winConditionInfo.setAttribute("class", "winInfo winInfo--player");
        setWinCondition(gameInfo.goal);
                // setWinCondition(gameInfo.goal);

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

        caughtUp = true;

    }

    socket.on('catch-up', function(gameInfo, cardList) {
        catchUp(gameInfo, cardList);
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
    console.log(room)
    socket.emit("room check", room);
    socket.on('room join', function(bool, bool2){
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
        socket.emit('check nickname', nickname, _("roomSearch").value);
    }
    else {
        _("errorMsg2").classList.remove("invisible");
        _("errorMsg2").innerHTML = "Enter a nickname";
    }

}

socket.on("name clear", function(bool) {
    if (bool) {
        window.history.pushState('','', roomInput);
        load_page("player");
    }
    else {
        _("errorMsg2").classList.remove("invisible");
        _("errorMsg2").innerHTML = "Choose a different nickname";
    }
});


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

    var deckSelectOptionsContainer = document.createDocumentFragment();
    var li = document.createElement("li");
    var input = document.createElement("input");
    var img = document.createElement("img");
    var label = document.createElement("label");
    li.classList.add("deckSelect__li");
    input.classList.add("deckSelect__input");
    img.classList.add("deckSelect__img");
    input.setAttribute("type", "checkbox");
    input.setAttribute("name", "cardNumber");
    label.appendChild(img);
    li.appendChild(input);
    li.appendChild(label);
    checkChecker = true;

    if (!localStorage.getItem('listCookie')) {
        checkChecker = true;
    }
    else {
        checkChecker = false;
        retrieveList = localStorage.getItem('listCookie').split(" ");
    }

        for (c=1; c<55; c++) {
            let liO = li.cloneNode('true');

            liO.children[0].setAttribute("value", c);
            liO.children[1].setAttribute("for", c);
            if (checkChecker) {
                liO.children[0].setAttribute("checked", "checked");
            }
            else {
                if (retrieveList.includes(String(c))) {
                    liO.children[0].setAttribute("checked", "checked");
                }
            }

            liO.children[1].children[0].src = "images/donClemente/" + c + '.jpg';
            
            deckSelectOptionsContainer.appendChild(liO);
        }

    _("cardSelectList").appendChild(deckSelectOptionsContainer);

    if (!localStorage.getItem('deckCookie')) {
       _("deck1").checked = true;
    }
    else {
        retrieveCookie = localStorage.getItem('deckCookie');
        document.querySelector('input[value=' + retrieveCookie + ']').checked = true;
    }

    _("welcomeForm").classList.add("invisible");
    _("host").classList.add("invisible");
    _("deckSettings").classList.remove("invisible");

_("deckSettings__label--Edit").addEventListener('click', function(event) {
    _("cardReview").classList.remove("invisible");
    shadowBox.classList.remove("invisible");
});

_("closeSelect").addEventListener('click', function(event) {
    _("cardReview").classList.add("invisible");
    shadowBox.classList.add("invisible");
});
    
});

_("deckSelectBtn").addEventListener('click', function(event) {
    currentDeck = document.querySelector('input[name="deckOption"]:checked').value;
    
    if (currentDeck === "classic") {
        deck = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54];
    }
    
    else if (currentDeck === "school") {
        deck = [1,2,3,4,5,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,27,28,29,30,31,32,33,34,35,37,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55];
    }
   
    else {
        selectedCards = document.querySelectorAll('input[name="cardNumber"]:checked');
        deck = [];
        for (f=0; f<selectedCards.length; f++) {
            deck.push(selectedCards[f].value);
        }
        localStorage.setItem('listCookie', deck.join(" "));
    }
    
    localStorage.setItem('deckCookie', currentDeck);

    load_page("host", event);
    event.preventDefault();
});