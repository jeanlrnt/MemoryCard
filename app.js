const grid = document.querySelector('.grid');
const fruits = [
    'apple',
    'banana',
    'brocoli',
    'cherry',
    'pepper',
    'straw'
];

fruits.forEach(fruit => {
    for (let i = 0; i < 2; i++) {
        grid.innerHTML += `
        <div class="card" data-attr="${fruit}">
            <div class="double-face">
                <div class="face">
                    <img src="ressources/${fruit}.svg" alt="${fruit}" />
                </div>
                <div class="back">
                    <img src="ressources/question.svg" />
                </div>
            </div>
        </div>
    `;
    }
});

const cards = document.querySelectorAll('.card');

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function shuffleCards() {
    shuffleArray(cards).forEach(card => grid.appendChild(card));
}

shuffleCards();

cards.forEach(card => card.addEventListener('click', flipCard));

let lock = false;
let cardsFlipped = [];
function flipCard(e) {
    if (lock) return;

    saveCard(e.target.children[0], e.target.getAttribute('data-attr'));

    if (cardsFlipped.length === 2) result();
}

function saveCard(card, fruit) {
    if (card === cardsFlipped[0]?.card) return;

    card.classList.add('active');
    cardsFlipped.push({card, fruit});
}

function result() {
    saveTriesNumber();

    if (cardsFlipped[0].fruit === cardsFlipped[1].fruit) {
        cardsFlipped.forEach(card => card.card.parentElement.removeEventListener('click', flipCard));
        cardsFlipped = [];
        return;
    }

    lock = true;
    setTimeout(() => {
        cardsFlipped.forEach(card => card.card.classList.remove('active'));
        cardsFlipped = [];
        lock = false;
    }, 1000);
}

const innerCards = [...document.querySelectorAll('.double-face')];
const advice = document.querySelector('.advice');
const score = document.querySelector('.score .count');

let tries = 0;
function saveTriesNumber() {
    tries++;
    const checkForEnd = innerCards.filter(card => {
        console.log(card.classList.contains('active'));
        return !card.classList.contains('active');
    });
    if (!checkForEnd.length) {
        console.log(checkForEnd.length);
        advice.textContent = 'Bravo ! Appuyez sur la touche "espace" pour rejouer.';
        score.textContent = tries;
        return;
    }
    score.textContent = tries;
}

window.addEventListener('keydown', handleRestart);

let shuffleLock = false;
function handleRestart(e) {
    e.preventDefault();
    if (e.keyCode === 32) {
        innerCards.forEach(card => card.classList.remove('active'));
        cards.forEach(card => card.addEventListener('click', flipCard));
        tries = 0;
        score.textContent = tries;
        advice.textContent = 'Tentez de gagner avec le moins d\'essais possible.';
        if (lock) return;
        shuffleLock = true;
        setTimeout(() => {
            shuffleCards();
            shuffleLock = false;
        }, 600);
    }
}