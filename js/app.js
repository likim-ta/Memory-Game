/*
 * Create a list that holds all of your cards
 */

const cards = ['fa-diamond', 'fa-diamond',
            'fa-paper-plane-o', 'fa-paper-plane-o',
            'fa-anchor', 'fa-anchor',
            'fa-bolt', 'fa-bolt',
            'fa-cube', 'fa-cube',
            'fa-leaf', 'fa-leaf',
            'fa-bicycle', 'fa-bicycle',
            'fa-bomb', 'fa-bomb'];

// declare deck variable
var deck = document.querySelector('.deck');

// declare moves variables
var moves = document.querySelector('.moves');
var moveCounter = 0;

// declare star rating variables
var stars = document.querySelectorAll('.fa-star');
var noOfStars = 0;

// declare variable of restart icon
var restart =  document.querySelector('.restart');

// declare timer variables
var timer = document.querySelector('.timer');
var second = 0;
var minute = 0;
var intervalID;

// declare variable of congratulations modal
var modal = document.querySelector('.modal');

// array of opened cards
var openedCards = [];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function initGame() {
  var shuffledCards;
  var individualCardHTML = '';
  var allCardsHTML = '';

  // reset button
  restart.addEventListener('click', function() {
    initGame();
  });

  // shuffle deck
  shuffledCards = shuffle(cards);

  // generate cards html
  for (let i = 0; i < cards.length; i++) {
    individualCardHTML = `<li class="card" data-card="${shuffledCards[i]}"><i class="fa ${shuffledCards[i]}"></i></li>`;
    allCardsHTML = allCardsHTML + individualCardHTML;
  }

  deck.innerHTML = allCardsHTML;

  // clear opened cards array
  clearOpenedList();

  // reset moves and star rating
  resetMoveCounter();

  // reset timer
  resetTimer();

  // display card's symbol
  displayCard();
}

document.body.onload = initGame();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function displayCard() {
  var card = document.querySelectorAll('.card');
  var gameStarted = false;
  var timer = false;

  card.forEach(function(card) {
    card.addEventListener('click', function() {
      // start timer on the first click
      if (gameStarted == false) {
        startTimer();
        gameStarted = true;
      }

      // do not open more than 2 cards
      if(!timer) {
        // prevent from selecting same card twice
        if((!card.classList.contains("open")) && (!card.classList.contains("show")) && (!card.classList.contains("match"))) {

          // update opened card array
          updateOpenedList(card);

          // open and show the card
          card.classList.add('open','show');

          if(openedCards.length == 2) {
            incrementMoveCounter();
            timer = setTimeout(function() {
              openedCards.forEach(function(card) {
                card.classList.remove('open','show');
                // if the two cards match, they stay turned over
                if(isCardMatched()) {
                  card.classList.add('match');
                }
              })

              // clear opened card array
              clearOpenedList();

              // check if player has won
              createWinningCondition();

              timer = false;

            }, 700);
          }
        }
      }
    })
  })
}

function updateOpenedList(card) {
  openedCards.push(card);
}

function clearOpenedList() {
  openedCards = [];
}

function isCardMatched() {
  var matched = false;

  if(openedCards.length == 2) {
    if(openedCards[0].dataset.card == openedCards[1].dataset.card) {
      matched = true;
    }
  }

  return matched;
}

function incrementMoveCounter() {
  moveCounter++;
  moves.innerHTML = moveCounter;

  starRating();
}

function resetMoveCounter() {
  moveCounter = 0;
  moves.innerHTML = moveCounter;

  starRating();
}

function starRating() {
  if (moveCounter >= 0 && moveCounter <= 14) {
    stars[0].style.display = "initial";
    stars[1].style.display = "initial";
    stars[2].style.display = "initial";
    noOfStars = 3;
  }
  else if (moveCounter > 14 && moveCounter <= 20) {
    stars[2].style.display = "none";
    noOfStars = 2;
  }
  else if (moveCounter > 20) {
    stars[1].style.display = "none";
    noOfStars = 1;
  }
}

function startTimer() {
  intervalID = setInterval(function() {
    second++;
    if(second == 60) {
      minute++;
      second=0;
    }
    timer.innerHTML = minute+"mins "+second+"secs";
  }, 1000);
}

function resetTimer() {
  clearInterval(intervalID);
  second = 0;
  minute = 0;
  timer.innerHTML = minute+"mins "+second+"secs";
}

function createWinningCondition() {
  var matched= document.querySelectorAll('.match');

  if (matched.length == 16) {
    // stop timer when player wins the game
    clearInterval(intervalID);

    // display game information on congratulations modal
    document.querySelector('.finalmove').innerHTML = moveCounter;
    document.querySelector('.totalTime').innerHTML = timer.innerHTML;
    document.querySelector('.starRating').innerHTML = noOfStars;
    modal.classList.add("show");
  }
}

function playAgain() {
  modal.classList.remove("show");
  initGame();
}
