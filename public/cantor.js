function _(x) {
	return document.getElementById(x);
}

var socket = io();


const deck = _("deck");
const currentCard = _("currentCard");
const winCondition = document.querySelectorAll('input[name="winCondition"]');
const start = _("start");

for (n=0; n<winCondition.length; n++) {
    winCondition[n].addEventListener('change', function() {
        start.disabled = false;
    });
}

function shuffleDeck() {
    deckList = [];
    for (var i=0; i<54; i++) {
        deckList.push(i+1);
    }
}

function startGame(evt) {
    evt.preventDefault();
    currentCard.src = "";
    shuffleDeck();
    deck.disabled = false;
    start.disabled = true;
    currentWinCondition = document.querySelector('input[name="winCondition"]:checked').value;
    socket.emit('game state', true);
    socket.emit('win condition', currentWinCondition);
    for (n=0; n<winCondition.length; n++) {
        winCondition[n].disabled = true;
    }
    socket.emit('game state', true);
}

function endGame() {
    deck.disabled = true;
    start.disabled = false;
    for (n=0; n<winCondition.length; n++) {
        winCondition[n].disabled = false;
    }
    socket.emit('game state', false);
}

function drawCard(evt) {
    evt.preventDefault();
    cardDrawn = deckList[(Math.floor(Math.random() * (deckList.length - 1 + 1)))];
    
    currentCard.src = "https://picsum.photos/seed/" + cardDrawn + "/125/175.jpg";
    
    deckList = deckList.filter(function(item) {
        return item !== cardDrawn;
        }
    );

    if (deckList.length <= 0) {
        endGame();
    }
    else {
        socket.emit('current card', cardDrawn);
    }
    
}

start.onclick = startGame;
deck.onclick = drawCard;
window.onload = shuffleDeck;