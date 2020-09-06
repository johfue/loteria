function _(x) {
	return document.getElementById(x);
}

var table = _("board");

// var chooseBoard = _("chooseBoard");

function clearBeans() {
    tiles = document.getElementsByTagName('input');
    for (var i=0; i<tiles.length; i++) {
        if (tiles[i].type =='checkbox') {
            console.log(3);
            tiles[i].checked = false;
        }
        
    }
}

function drawTable() {
    clearBeans();
    cardOnBoard = [];
    for (var i = 0, row; row = table.rows[i]; i++) {
      for (var j = 0, col; col = row.cells[j]; j++) {
            //iterate through columns
            //columns would be accessed using the "col" variable assigned in the for loop
            cardOnBoardCheck = cardOnBoard.length;
            
            while (cardOnBoard.length === cardOnBoardCheck ) {
            card = (Math.floor(Math.random() * (54 - 1 + 1)) + 1);

                if (cardOnBoard.includes(card) === false) {
                    cardOnBoard.push(card);
                    // col.lastElementChild.src = card + '.jpg';
                    col.lastElementChild.src = "https://picsum.photos/seed/" + card + '/125/175.jpg';

                }

            }
        }
    }

}

function pickBoard(evt) {
    evt.preventDefault();
    console.log(evt);
    var chosenBoard = document.querySelector('input[name="boardNumber"]:checked').value;
    // var chosenBoard = chooseBoard.options[chooseBoard.selectedIndex].value;
    Math.seedrandom(chosenBoard);
    drawTable();
}

_("newBoard").onclick = pickBoard;

window.onload = drawTable;
