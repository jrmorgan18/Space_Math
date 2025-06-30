const levels = [
  {name: "Addition Basics", type: "addEasy", points: 10},
  {name: "Addition Advanced", type: "addHard", points: 15},
  {name: "Subtraction", type: "sub", points: 15},
  {name: "Multiplication", type: "mult", points: 20},
  {name: "Pattern Matching", type: "pattern", points: 15},
  {name: "Count by Ones", type: "count1", points: 10},
  {name: "Count by Fives", type: "count5", points: 10},
  {name: "Count by Tens", type: "count10", points: 15},
  {name: "Greater vs Less", type: "compare", points: 15}
];

let currentLevel = 0;
let questions = [];
let questionIndex = 0;
let score = 0;
let lives = 3;

const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const speakBtn = document.getElementById('speak-btn');
const messageEl = document.getElementById('message');
const rocketEl = document.getElementById('rocket');
const planetEl = document.getElementById('planet');
const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const questionArea = document.getElementById('question-area');

startBtn.addEventListener('click', () => {
  startScreen.classList.add('hidden');
  startLevel();
});

speakBtn.addEventListener('click', () => {
  const text = questionEl.textContent;
  const utter = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utter);
});

function startLevel() {
  lives = 3;
  scoreEl.textContent = `Score: ${score}`;
  livesEl.textContent = `Lives: ${lives}`;
  messageEl.textContent = `Level ${currentLevel + 1}: ${levels[currentLevel].name}`;
  rocketEl.classList.remove('level-complete');
  questions = generateQuestions(levels[currentLevel].type);
  questionIndex = 0;
  showQuestion();
  questionArea.classList.remove('hidden');
}

function showQuestion() {
  if (questionIndex >= 10) {
    levelComplete();
    return;
  }
  const q = questions[questionIndex];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = '';
  shuffle(q.options).forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.addEventListener('click', () => answerQuestion(q, opt, btn));
    optionsEl.appendChild(btn);
  });
}

function answerQuestion(q, opt, btn) {
  if (opt === q.answer) {
    score += levels[currentLevel].points;
    scoreEl.textContent = `Score: ${score}`;
    btn.classList.add('correct-animation');
    setTimeout(() => {
      questionIndex++;
      showQuestion();
    }, 500);
  } else {
    lives--;
    livesEl.textContent = `Lives: ${lives}`;
    if (lives === 0) {
      messageEl.textContent = 'Mission Failed! Restarting level...';
      setTimeout(startLevel, 1500);
    }
  }
}

function levelComplete() {
  messageEl.textContent = 'Level Complete! Traveling to next planet...';
  rocketEl.classList.add('level-complete');
  setTimeout(() => {
    currentLevel++;
    if (currentLevel >= levels.length) {
      messageEl.textContent = `Congratulations! Final Score: ${score}`;
      questionArea.classList.add('hidden');
    } else {
      startLevel();
    }
  }, 3000);
}

function generateQuestions(type) {
  const list = [];
  for (let i = 0; i < 50; i++) {
    switch(type) {
      case 'addEasy':
        const a1 = rand(1,9);
        const b1 = rand(1,9);
        list.push(makeQA(`${a1} + ${b1} = ?`, a1 + b1));
        break;
      case 'addHard':
        const a2 = rand(10,99);
        const b2 = rand(1,20);
        list.push(makeQA(`${a2} + ${b2} = ?`, a2 + b2));
        break;
      case 'sub':
        const a3 = rand(5,20);
        const b3 = rand(1,a3);
        list.push(makeQA(`${a3} - ${b3} = ?`, a3 - b3));
        break;
      case 'mult':
        const num = rand(2,10);
        const table = rand(2,10);
        list.push(makeQA(`${num} x ${table} = ?`, num * table));
        break;
      case 'pattern':
        const start = rand(1,5);
        const step = rand(1,5);
        const seq = `${start}, ${start+step}, ${start+2*step}, ?`;
        list.push(makeQA(`What comes next? ${seq}`, start+3*step));
        break;
      case 'count1':
        const c1 = rand(1,199);
        list.push(makeQA(`What number comes after ${c1}?`, c1+1));
        break;
      case 'count5':
        const c5 = rand(0,95);
        const next5 = c5 + 5 - (c5 % 5);
        list.push(makeQA(`Counting by fives, what comes after ${next5}?`, next5 + 5));
        break;
      case 'count10':
        const c10 = rand(0,190);
        const next10 = c10 + 10 - (c10 % 10);
        list.push(makeQA(`Counting by tens, what comes after ${next10}?`, next10 + 10));
        break;
      case 'compare':
        const x = rand(10,99);
        const y = rand(10,99);
        const ans = x > y ? '>' : '<';
        list.push({question: `${x} __ ${y}`, options: ['>', '<', '='], answer: ans});
        break;
    }
  }
  return shuffle(list);
}

function makeQA(text, answer) {
  const wrong1 = answer + rand(-3,3);
  const wrong2 = answer + rand(1,5);
  const opts = shuffle([answer, wrong1 === answer ? answer+2 : wrong1, wrong2 === answer ? answer+3 : wrong2]);
  return {question: text, options: opts, answer};
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
