const levelPoints = [10, 15, 20, 30, 40, 50];
const totalLevels = 6;
let game = {
  level: 1,
  score: 0,
  lives: 3,
  questions: [],
  current: 0
};

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const levelEl = document.getElementById('level');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const startBtn = document.getElementById('start');
const rocketEl = document.getElementById('rocket');
const readBtn = document.getElementById('read');

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestions(level) {
  const qs = [];
  for (let i = 0; i < 60; i++) {
    let q = {}; 
    switch (level) {
      case 1: {
        const n = rand(0, 199);
        const answer = n + 1;
        const opts = shuffle([answer, n + rand(2,3), n + rand(4,5)]);
        q = {text: `What number comes after ${n}?`, opts, answer};
        break;
      }
      case 2: {
        const base = rand(0, 19) * 5;
        const answer = base + 5;
        const opts = shuffle([answer, base, answer + 5]);
        q = {text: `Counting by fives: what comes after ${base}?`, opts, answer};
        break;
      }
      case 3: {
        const base = rand(0, 19) * 10;
        const answer = base + 10;
        const opts = shuffle([answer, base + 20, base]);
        q = {text: `Counting by tens: what comes after ${base}?`, opts, answer};
        break;
      }
      case 4: {
        if (Math.random() < 0.5) {
          const a = rand(1,20);
          const b = rand(1,9);
          const answer = a + b;
          const opts = shuffle([answer, answer + rand(1,3), Math.abs(answer - rand(1,3))]);
          q = {text: `${a} + ${b} = ?`, opts, answer};
        } else {
          const a = rand(5,20);
          const b = rand(1, Math.min(9,a));
          const answer = a - b;
          const opts = shuffle([answer, answer + rand(1,3), Math.abs(answer - rand(1,3))]);
          q = {text: `${a} - ${b} = ?`, opts, answer};
        }
        break;
      }
      case 5: {
        const a = rand(2,10);
        const b = rand(0,10);
        const answer = a * b;
        const opts = shuffle([answer, answer + a, Math.abs(answer - a)]);
        q = {text: `${a} × ${b} = ?`, opts, answer};
        break;
      }
      case 6: {
        if (Math.random() < 0.5) {
          // greater/less
          const a = rand(10,99);
          const b = rand(10,99);
          const ans = a > b ? `${a} > ${b}` : `${a} < ${b}`;
          const wrong = a > b ? `${a} < ${b}` : `${a} > ${b}`;
          const eq = `${a} = ${b}`;
          const opts = shuffle([ans, wrong, eq]);
          q = {text: 'Which is correct?', opts, answer: ans};
        } else {
          // simple pattern
          const start = rand(1,10);
          const step = rand(1,5);
          const answer = start + 2 * step;
          const opts = shuffle([answer, start + step, start + 3*step]);
          q = {text: `Fill the pattern: ${start}, ${start+step}, ?, ${start+3*step}`, opts, answer};
        }
        break;
      }
    }
    qs.push(q);
  }
  return qs;
}

function speak(text) {
  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utter);
  }
}

function showQuestion() {
  if (game.current >= 10) {
    levelComplete();
    return;
  }
  const q = game.questions[game.current];
  questionEl.textContent = q.text;
  optionsEl.innerHTML = '';
  q.opts.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.addEventListener('click', () => selectAnswer(opt));
    optionsEl.appendChild(btn);
  });
}

function selectAnswer(opt) {
  const q = game.questions[game.current];
  if (opt === q.answer) {
    game.score += levelPoints[game.level-1];
    scoreEl.textContent = `Score: ${game.score}`;
    rocketEl.classList.add('correct');
    setTimeout(() => rocketEl.classList.remove('correct'), 500);
  } else {
    game.lives -= 1;
    livesEl.textContent = `Lives: ${game.lives}`;
    if (game.lives <= 0) {
      questionEl.textContent = 'Game Over!';
      optionsEl.innerHTML = '';
      startBtn.textContent = 'Retry Level';
      startBtn.style.display = 'block';
      return;
    }
  }
  game.current += 1;
  showQuestion();
}

function levelComplete() {
  questionEl.textContent = 'Level Complete!';
  optionsEl.innerHTML = '';
  rocketEl.classList.add('level-complete');
  setTimeout(() => {
    rocketEl.classList.remove('level-complete');
    game.level += 1;
    if (game.level > totalLevels) {
      questionEl.textContent = `Congratulations! Final score: ${game.score}`;
      startBtn.style.display = 'none';
    } else {
      startBtn.textContent = 'Next Level';
      startBtn.style.display = 'block';
    }
  }, 2000);
}

function startGame() {
  startBtn.style.display = 'none';
  levelEl.textContent = `Level: ${game.level}`;
  livesEl.textContent = 'Lives: 3';
  game.lives = 3;
  game.questions = shuffle(generateQuestions(game.level));
  game.current = 0;
  showQuestion();
}

startBtn.addEventListener('click', startGame);
readBtn.addEventListener('click', () => speak(questionEl.textContent));
