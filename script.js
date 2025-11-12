// Theme toggle
(function () {
  const btn = document.getElementById("themeToggle");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const stored = localStorage.getItem("theme");
  const apply = (mode) => {
    document.documentElement.dataset.theme = mode;
    btn.textContent = mode === "dark" ? "☀" : "☾";
  };
  const init = stored || (prefersDark ? "dark" : "light");
  apply(init);
  btn.addEventListener("click", () => {
    const next = (document.documentElement.dataset.theme === "dark") ? "light" : "dark";
    localStorage.setItem("theme", next);
    apply(next);
  });
  // Year
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

// Lightbox for gallery
(function () {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  const lbImg = lightbox.querySelector("img");
  const lbCaption = lightbox.querySelector(".lightbox-caption");
  const close = lightbox.querySelector(".lightbox-close");
  document.querySelectorAll(".gallery figure").forEach((fig) => {
    const img = fig.querySelector("img");
    const caption = fig.querySelector("figcaption")?.textContent || "";
    img.addEventListener("click", () => {
      lbImg.src = img.src || img.getAttribute("data-src") || "";
      lbCaption.textContent = caption;
      lightbox.hidden = false;
    });
  });
  close.addEventListener("click", () => (lightbox.hidden = true));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.hidden = true;
  });
})();

// Rock Paper Scissors
(function () {
  const el = document.getElementById("rps");
  if (!el) return;
  const status = el.querySelector(".rps-status");
  el.querySelectorAll("[data-move]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const moves = ["rock", "paper", "scissors"];
      const player = btn.dataset.move;
      const cpu = moves[Math.floor(Math.random() * 3)];
      const outcome =
        player === cpu ? "Draw" :
        (player === "rock" && cpu === "scissors") ||
        (player === "paper" && cpu === "rock") ||
        (player === "scissors" && cpu === "paper") ? "You win!" : "You lose!";
      status.textContent = `You: ${player} • CPU: ${cpu} — ${outcome}`;
    });
  });
})();

// Tic Tac Toe (vs simple AI)
(function () {
  const root = document.getElementById("tictactoe");
  if (!root) return;
  const cells = Array.from(root.querySelectorAll(".board button"));
  const status = root.querySelector(".ttt-status");
  const reset = root.querySelector("#tttReset");
  let board, turn, done;
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  function start() {
    board = Array(9).fill("");
    turn = "X";
    done = false;
    cells.forEach((c, i) => { c.textContent = ""; c.disabled = false; });
    status.textContent = "Player X's turn";
  }
  function check() {
    for (const [a,b,c] of wins) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    if (board.every(Boolean)) return "draw";
    return null;
  }
  function aiMove() {
    const empty = board.map((v,i)=>v?null:i).filter(v=>v!==null);
    if (empty.length === 0) return;
    const i = empty[Math.floor(Math.random()*empty.length)];
    board[i] = "O"; cells[i].textContent = "O";
  }
  cells.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      if (done || board[i]) return;
      board[i] = turn; btn.textContent = turn;
      let res = check();
      if (res) {
        done = true;
        cells.forEach(c=>c.disabled = true);
        status.textContent = res === "draw" ? "Draw game!" : `Player ${res} wins!`;
        return;
      }
      // AI
      aiMove();
      res = check();
      if (res) {
        done = true;
        cells.forEach(c=>c.disabled = true);
        status.textContent = res === "draw" ? "Draw game!" : `Player ${res} wins!`;
        return;
      }
      status.textContent = "Player X's turn";
    });
  });
  reset.addEventListener("click", start);
  start();
})();

// Hangman
(function () {
  const root = document.getElementById("hangman");
  if (!root) return;
  const wordEl = root.querySelector(".hm-word");
  const lettersEl = root.querySelector(".hm-letters");
  const status = root.querySelector(".hm-status");
  const reset = root.querySelector("#hmReset");
  const words = ["javascript","portfolio","andrew","website","coding","react","design","memory","hangman","tic"];
  let word, guessed, lives;
  function draw() {
    wordEl.textContent = word.split("").map(ch => guessed.has(ch) ? ch.toUpperCase() : "_").join(" ");
    status.textContent = `${lives} lives`;
  }
  function start() {
    word = words[Math.floor(Math.random()*words.length)];
    guessed = new Set();
    lives = 6;
    lettersEl.innerHTML = "";
    for (let i=65;i<=90;i++) {
      const b = document.createElement("button");
      const ch = String.fromCharCode(i);
      b.textContent = ch;
      b.addEventListener("click", () => {
        if (guessed.has(ch.toLowerCase()) || lives <= 0) return;
        guessed.add(ch.toLowerCase());
        if (!word.includes(ch.toLowerCase())) lives--;
        draw();
        b.disabled = true;
        if (word.split("").every(c => guessed.has(c))) {
          status.textContent = "You solved it!";
          lettersEl.querySelectorAll("button").forEach(x=>x.disabled = true);
        } else if (lives === 0) {
          status.textContent = `Out of lives! Word: ${word.toUpperCase()}`;
          lettersEl.querySelectorAll("button").forEach(x=>x.disabled = true);
        }
      });
      lettersEl.appendChild(b);
    }
    draw();
  }
  reset.addEventListener("click", start);
  start();
})();

// Quiz
(function () {
  const root = document.getElementById("quiz");
  if (!root) return;
  const qText = root.querySelector(".q-text");
  const qOpts = root.querySelector(".q-options");
  const qNext = root.querySelector("#qNext");
  const qProg = root.querySelector(".q-progress");
  const qs = [
    { q: "Which HTML tag links a stylesheet?", a: ["<style>", "<link>", "<script>", "<css>"], i: 1 },
    { q: "What does CSS stand for?", a: ["Creative Style System", "Cascading Style Sheets", "Computer Styling Syntax", "Color Sheet System"], i: 1 },
    { q: "Which is NOT a JavaScript primitive?", a: ["number", "boolean", "object", "string"], i: 2 },
  ];
  let idx = 0, locked = false;
  function render() {
    const item = qs[idx];
    qText.textContent = item.q;
    qOpts.innerHTML = "";
    item.a.forEach((opt, i) => {
      const b = document.createElement("button");
      b.textContent = opt;
      b.addEventListener("click", () => {
        if (locked) return;
        locked = true;
        if (i === item.i) b.classList.add("correct");
        else b.classList.add("wrong");
      });
      qOpts.appendChild(b);
    });
    qProg.textContent = `Question ${idx+1} of ${qs.length}`;
    locked = false;
  }
  qNext.addEventListener("click", () => {
    idx = (idx + 1) % qs.length;
    render();
  });
  render();
})();

