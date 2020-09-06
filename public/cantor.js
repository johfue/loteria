function _(x) {
	return document.getElementById(x);
}

const deck = _("deck");
const currentCard = _("currentCard");
const boardChooseList = document.querySelectorAll('input[name="winCondition"]');
const start = _("start");

for (n=0; n<boardChooseList.length; n++) {
    boardChooseList[n].addEventListener('change', function() {
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
        deck.disabled = true;
        start.disabled = false;
    }
}

start.onclick = startGame;
deck.onclick = drawCard;
window.onload = shuffleDeck;