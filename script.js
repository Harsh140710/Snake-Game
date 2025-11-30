const board = document.querySelector(".board");
const startBtn = document.querySelector(".start-game");
const modal = document.querySelector(".modal");
const restartGameModal = document.querySelector(".over-game");
const restartBtn = document.querySelector(".btn-restart");

const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = `00:00`;

const blockHeight = 50;
const blockWeight = 50;
const cols = Math.floor(board.clientWidth / blockWeight);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null;
let timeIntervalId = null;

const blockArray = [];
let snake = [
  {
    x: 1,
    y: 3,
  },
];
let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

let direction = "right";

// render grid of the according screen size
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blockArray[`${i}-${j}`] = block;
  }
}

// key events
addEventListener("keydown", (e) => {
  if (e.key == "ArrowUp") {
    direction = "up";
  } else if (e.key == "ArrowRight") {
    direction = "right";
  } else if (e.key == "ArrowLeft") {
    direction = "left";
  } else if (e.key == "ArrowDown") {
    direction = "down";
  }
});

function renderSnake() {
  let head = null;
    highScoreElement.innerText = localStorage.getItem('highScore')
  // render food
  blockArray[`${food.x}-${food.y}`].classList.add("food");

  // change snakes direction using keys
  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  }

  // food consume logic
  if (head.x == food.x && head.y == food.y) {
    blockArray[`${food.x}-${food.y}`].classList.remove("food");
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    blockArray[`${food.x}-${food.y}`].classList.add("food");

    snake.unshift(head);

    score += 10;
    scoreElement.innerText = score;

    if (score >= highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore.toString());
    }
  }

  // restart game logic when snake touch the boundry
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    clearInterval(intervalId);

    modal.style.display = "flex";
    startBtn.style.display = "none";
    restartGameModal.style.display = "flex";
    score = 0;
    return;
  }

  // remove snake back color
  snake.forEach((segment) => {
    blockArray[`${segment.x}-${segment.y}`].classList.remove("fill");
  });

  // move from the front side ( Face side )
  snake.unshift(head);
  snake.pop();

  // add snake color at the front
  snake.forEach((segment) => {
    blockArray[`${segment.x}-${segment.y}`].classList.add("fill");
  });
}

// start game
startBtn.addEventListener("click", () => {
  intervalId = setInterval(() => {
    modal.style.display = "none";
    renderSnake();
  }, 500);
  timeIntervalId = setInterval(() => {
    let [minutes, seconds] = time.split(':').map(Number)
    if(seconds == 59){
        minutes += 1
        seconds = 0
    } else {
        seconds += 1
    }

    time = `${minutes}:${seconds}`
    timeElement.innerText = time
  }, 1000)
});

// restart btn with function
restartBtn.addEventListener("click", restartGame);

function restartGame() {
  blockArray[`${food.x}-${food.y}`].classList.remove("food");
  snake.forEach((segment) => {
    blockArray[`${segment.x}-${segment.y}`].classList.remove("fill");
  });

  modal.style.display = "none";
  direction = "right";
  snake = [
    {
      x: 1,
      y: 3,
    },
  ];

  food = {
    x: Math.floor(Math.random()) * rows,
    y: Math.floor(Math.random()) * cols,
  };

  score = 0;

  scoreElement.innerText = 0;
  highScoreElement.innerText = highScore;
  intervalId = setInterval(() => renderSnake(), 500);
}

