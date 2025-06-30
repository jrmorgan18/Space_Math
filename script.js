const questionText = document.getElementById('question-text');
const optionsDiv = document.getElementById('options');
const startBtn = document.getElementById('start-btn');
const scoreSpan = document.getElementById('score');
const livesSpan = document.getElementById('lives');
const levelNumberSpan = document.getElementById('level-number');
const speakBtn = document.getElementById('speak-btn');

let levelIndex = 0;
let score = 0;
let lives = 3;
let questionCount = 0;
let currentQuestion = null;
let levelQuestionBank = [];

const canvas = document.getElementById('animation-canvas');
const ctx = canvas.getContext('2d');

const levels = [
    { name: 'Counting by Ones', generator: countOnesQuestions, points: 5 },
    { name: 'Addition', generator: additionQuestions, points: 10 },
    { name: 'Subtraction', generator: subtractionQuestions, points: 10 },
    { name: 'Counting by Fives', generator: countFivesQuestions, points: 15 },
    { name: 'Counting by Tens', generator: countTensQuestions, points: 20 },
    { name: 'Greater or Less Than', generator: compareQuestions, points: 20 },
    { name: 'Multiplication', generator: multiplicationQuestions, points: 25 },
    { name: 'Pattern Matching', generator: patternQuestions, points: 25 }
];

function startGame() {
    levelIndex = 0;
    score = 0;
    lives = 3;
    levelNumberSpan.textContent = levelIndex + 1;
    scoreSpan.textContent = score;
    livesSpan.textContent = lives;
    startBtn.disabled = true;
    nextLevel();
}

function nextLevel() {
    if (levelIndex >= levels.length) {
        questionText.textContent = `You won! Final score: ${score}`;
        startBtn.disabled = false;
        optionsDiv.innerHTML = '';
        return;
    }
    questionCount = 0;
    levelQuestionBank = levels[levelIndex].generator();
    levelNumberSpan.textContent = levelIndex + 1;
    nextQuestion();
}

function nextQuestion() {
    if (questionCount >= 10) {
        levelIndex++;
        animateLevelUp();
        setTimeout(nextLevel, 1000);
        return;
    }
    if (lives <= 0) {
        questionText.textContent = 'Game Over!';
        startBtn.disabled = false;
        optionsDiv.innerHTML = '';
        return;
    }
    currentQuestion = levelQuestionBank[Math.floor(Math.random() * levelQuestionBank.length)];
    questionText.textContent = currentQuestion.question;
    speakBtn.disabled = false;
    renderOptions(currentQuestion.options);
}

function renderOptions(opts) {
    optionsDiv.innerHTML = '';
    opts.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.addEventListener('click', () => handleAnswer(index));
        optionsDiv.appendChild(btn);
    });
}

function handleAnswer(index) {
    const buttons = optionsDiv.querySelectorAll('button');
    if (index === currentQuestion.answer) {
        buttons[index].classList.add('correct');
        score += levels[levelIndex].points;
        scoreSpan.textContent = score;
        animateCorrect();
    } else {
        buttons[index].classList.add('incorrect');
        lives--;
        livesSpan.textContent = lives;
    }
    questionCount++;
    setTimeout(nextQuestion, 800);
}

function speakQuestion() {
    if (!currentQuestion) return;
    const utter = new SpeechSynthesisUtterance(currentQuestion.question);
    speechSynthesis.speak(utter);
}

speakBtn.addEventListener('click', speakQuestion);
startBtn.addEventListener('click', startGame);

function additionQuestions() {
    const q = [];
    for (let i = 0; i < 100; i++) {
        const a = Math.floor(Math.random() * 9) + 1;
        const b = Math.floor(Math.random() * 9) + 1;
        const answer = a + b;
        const options = shuffle([answer, answer + 1, answer - 1]);
        q.push({ question: `${a} + ${b} = ?`, options, answer: options.indexOf(answer) });
    }
    return q;
}

function subtractionQuestions() {
    const q = [];
    for (let i = 0; i < 100; i++) {
        const a = Math.floor(Math.random() * 9) + 1;
        const b = Math.floor(Math.random() * a) + 1;
        const answer = a - b;
        const options = shuffle([answer, answer + 1, answer - 1 >=0 ? answer -1 : answer +2]);
        q.push({ question: `${a} - ${b} = ?`, options, answer: options.indexOf(answer) });
    }
    return q;
}

function multiplicationQuestions() {
    const q = [];
    for (let i = 0; i < 100; i++) {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        const answer = a * b;
        const options = shuffle([answer, answer + a, answer - b > 0 ? answer - b : answer + b]);
        q.push({ question: `${a} x ${b} = ?`, options, answer: options.indexOf(answer) });
    }
    return q;
}

function countOnesQuestions() {
    const q = [];
    for (let i = 1; i <= 100; i++) {
        const next = i + 1;
        const options = shuffle([next, next + 1, next - 1]);
        q.push({ question: `What comes after ${i}?`, options, answer: options.indexOf(next) });
    }
    return q;
}

function countFivesQuestions() {
    const q = [];
    for (let i = 0; i <= 20; i++) {
        const base = i * 5;
        const next = base + 5;
        const options = shuffle([next, next + 5, next - 5]);
        q.push({ question: `Count by 5s: what comes after ${base}?`, options, answer: options.indexOf(next) });
    }
    return q;
}

function countTensQuestions() {
    const q = [];
    for (let i = 0; i <= 20; i++) {
        const base = i * 10;
        const next = base + 10;
        const options = shuffle([next, next + 10, next - 10]);
        q.push({ question: `Count by 10s: what comes after ${base}?`, options, answer: options.indexOf(next) });
    }
    return q;
}

function compareQuestions() {
    const q = [];
    for (let i = 0; i < 100; i++) {
        const a = Math.floor(Math.random() * 90) + 10;
        const b = Math.floor(Math.random() * 90) + 10;
        const answer = a > b ? `${a} > ${b}` : `${a} < ${b}`;
        const opposite = a > b ? `${a} < ${b}` : `${a} > ${b}`;
        const equal = `${a} = ${b}`;
        const options = shuffle([answer, opposite, equal]);
        q.push({ question: `Which is true?`, options, answer: options.indexOf(answer) });
    }
    return q;
}

function patternQuestions() {
    const shapes = ['▲', '■', '●'];
    const q = [];
    for (let i = 0; i < 60; i++) {
        const seq = [];
        const pattern = shapes[Math.floor(Math.random()*shapes.length)];
        for (let j = 0; j < 3; j++) seq.push(pattern);
        const missing = shapes[(shapes.indexOf(pattern)+1)%shapes.length];
        const options = shuffle([pattern, missing, shapes[(shapes.indexOf(pattern)+2)%shapes.length]]);
        q.push({ question: `${seq.join(' ')} ?`, options, answer: options.indexOf(pattern) });
    }
    return q;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function animateCorrect() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(150, 75, 30, 0, Math.PI * 2);
    ctx.fill();
}

function animateLevelUp() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(0, 60, canvas.width, 30);
}
