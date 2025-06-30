const levels = [
    {
        name: 'Launch Pad',
        points: 5,
        generator: () => generateAddition(0, 9)
    },
    {
        name: 'Moon Mission',
        points: 10,
        generator: () => generateAddition(10, 20)
    },
    {
        name: 'Asteroid Subtraction',
        points: 10,
        generator: () => generateSubtraction(0, 20)
    },
    {
        name: 'Mars Multiplication',
        points: 15,
        generator: () => generateMultiplication(2, 3)
    },
    {
        name: 'Jupiter Multiplication',
        points: 20,
        generator: () => generateMultiplication(2, 10)
    },
    {
        name: 'Pattern Planet',
        points: 15,
        generator: () => generatePatterns()
    },
    {
        name: 'Galaxy Count',
        points: 10,
        generator: () => generateCounting()
    },
    {
        name: 'Comet Compare',
        points: 15,
        generator: () => generateComparison()
    }
];

let currentLevel = 0;
let questionBank = [];
let currentQuestion = 0;
let score = 0;
let lives = 3;

const pointsEl = document.getElementById('points');
const livesEl = document.getElementById('lives');
const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const startBtn = document.getElementById('start-btn');
const speakBtn = document.getElementById('speak-btn');
const rocketEl = document.getElementById('rocket');

startBtn.addEventListener('click', startGame);
speakBtn.addEventListener('click', () => speak(questionEl.textContent));

function startGame() {
    score = 0;
    lives = 3;
    currentLevel = 0;
    moveRocket(0);
    nextLevel();
}

function nextLevel() {
    if (currentLevel >= levels.length) {
        questionEl.textContent = 'Congratulations! You explored all planets!';
        startBtn.textContent = 'Play Again';
        startBtn.style.display = 'inline-block';
        speakBtn.disabled = true;
        return;
    }
    const level = levels[currentLevel];
    questionBank = level.generator();
    shuffle(questionBank);
    currentQuestion = 0;
    lives = 3;
    updateScoreboard();
    startBtn.style.display = 'none';
    speakBtn.disabled = false;
    questionEl.textContent = `Level ${currentLevel + 1}: ${level.name}`;
    setTimeout(showQuestion, 1000);
}

function showQuestion() {
    if (currentQuestion >= 10) {
        currentLevel++;
        moveRocket(currentLevel);
        setTimeout(() => {
            questionEl.textContent = 'Level Complete!';
            startBtn.style.display = 'inline-block';
            startBtn.textContent = 'Next Level';
        }, 500);
        return;
    }
    const q = questionBank[currentQuestion];
    questionEl.textContent = q.text;
    choicesEl.innerHTML = '';
    const opts = shuffle([...q.choices]);
    opts.forEach(opt => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.onclick = () => handleAnswer(opt === q.answer);
        choicesEl.appendChild(btn);
    });
}

function handleAnswer(correct) {
    if (correct) {
        score += levels[currentLevel].points;
        animateStar();
    } else {
        lives--;
    }
    currentQuestion++;
    if (lives <= 0) {
        questionEl.textContent = 'Out of lives! Try again.';
        startBtn.textContent = 'Restart Level';
        startBtn.style.display = 'inline-block';
        speakBtn.disabled = true;
        return;
    }
    updateScoreboard();
    showQuestion();
}

function updateScoreboard() {
    pointsEl.textContent = `Points: ${score}`;
    livesEl.textContent = 'Lives: ' + '\uD83D\uDC7E'.repeat(lives);
}

function animateStar() {
    const star = document.createElement('div');
    star.textContent = '⭐';
    star.className = 'star';
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 1000);
}

function moveRocket(level) {
    rocketEl.style.left = `${level * 50}px`;
}

function speak(text) {
    const utter = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utter);
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAddition(min, max) {
    const qs = [];
    for (let i = 0; i < 50; i++) {
        const a = randInt(min, max);
        const b = randInt(min, max);
        const answer = a + b;
        const wrong1 = answer + randInt(1, 3);
        const wrong2 = answer - randInt(1, 3);
        qs.push({ text: `What is ${a} + ${b}?`, choices: [answer, wrong1, wrong2], answer });
    }
    return qs;
}

function generateSubtraction(min, max) {
    const qs = [];
    for (let i = 0; i < 50; i++) {
        const a = randInt(min, max);
        const b = randInt(min, Math.min(a, max));
        const answer = a - b;
        const wrong1 = answer + randInt(1, 3);
        const wrong2 = Math.max(0, answer - randInt(1, 3));
        qs.push({ text: `What is ${a} - ${b}?`, choices: [answer, wrong1, wrong2], answer });
    }
    return qs;
}

function generateMultiplication(min, max) {
    const qs = [];
    for (let i = 0; i < 50; i++) {
        const a = randInt(min, max);
        const b = randInt(min, max);
        const answer = a * b;
        const wrong1 = answer + randInt(1, 5);
        const wrong2 = answer - randInt(1, Math.min(5, answer));
        qs.push({ text: `What is ${a} \u00D7 ${b}?`, choices: [answer, wrong1, wrong2], answer });
    }
    return qs;
}

function generatePatterns() {
    const qs = [];
    for (let i = 0; i < 50; i++) {
        const start = randInt(1, 10);
        const step = randInt(1, 5);
        const missingIndex = randInt(1, 4);
        const sequence = [];
        for (let j = 0; j < 5; j++) {
            sequence.push(start + step * j);
        }
        const answer = sequence[missingIndex];
        sequence[missingIndex] = '__';
        const wrong1 = answer + step;
        const wrong2 = Math.max(0, answer - step);
        qs.push({ text: `Fill in the blank: ${sequence.join(', ')}`, choices: [answer, wrong1, wrong2], answer });
    }
    return qs;
}

function generateCounting() {
    const qs = [];
    for (let i = 0; i < 50; i++) {
        const type = randInt(1, 3);
        if (type === 1) {
            const n = randInt(0, 199);
            qs.push({
                text: `What number comes after ${n}?`,
                choices: [n + 1, n + 2, n + 3],
                answer: n + 1
            });
        } else if (type === 2) {
            const n = randInt(0, 20) * 5;
            qs.push({
                text: `Count by fives: ${n}, ${n + 5}, __`,
                choices: [n + 10, n + 15, n + 20],
                answer: n + 10
            });
        } else {
            const n = randInt(0, 20) * 10;
            qs.push({
                text: `Count by tens: ${n}, ${n + 10}, __`,
                choices: [n + 20, n + 30, n + 40],
                answer: n + 20
            });
        }
    }
    return qs;
}

function generateComparison() {
    const qs = [];
    for (let i = 0; i < 50; i++) {
        const a = randInt(10, 99);
        const b = randInt(10, 99);
        const correct = a > b ? `${a} > ${b}` : `${a} < ${b}`;
        const wrong = a > b ? `${a} < ${b}` : `${a} > ${b}`;
        const equal = `${a} = ${b}`;
        qs.push({
            text: 'Choose the correct statement:',
            choices: [correct, wrong, equal],
            answer: correct
        });
    }
    return qs;
}
