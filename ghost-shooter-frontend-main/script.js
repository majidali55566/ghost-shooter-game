const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "./login.html";
}
document.getElementById("user-name").innerHTML = localStorage.getItem("rollno");

let gameContainer = document.getElementById("gameContainer");
let menu = document.getElementById("game-menu");
let difficultyMenu = document.getElementById("difficulty-level-menu");
let scoreBox = document.getElementById("scoreBox");
let chanceBox = document.getElementById("chanceBox");
let totalChances = document.getElementById("totalChances");
let gameOverScreen = document.getElementById("gameOverScreen");
let gameWinScreen = document.getElementById("gameWinScreen");
let quitScreen = document.getElementById("quitScreen");
let playAgainBtn = document.getElementById("playAgainBtn");
let restartBtn = document.getElementById("restartBtn");
let gameStartBtn = document.getElementById("gameStart");
let difficultyBtn = document.getElementById("defficultyLevel");
let easyBtn = document.getElementById("easy");
let mediumBtn = document.getElementById("medium");
let hardBtn = document.getElementById("hard");
let quitBtn = document.getElementById("quitGame");
let mainMenuBtn = document.getElementById("main-menu");
let mainMenuBtn2 = document.getElementById("main-menu2");

let allGhostsKey = [];
let setChance = 1;
let setScore = 100;
let speed = 50;

gameStartBtn.onclick = function () {
  menu.style.display = "none";
  difficultyMenu.style.display = "none";
  startGame();
};

difficultyBtn.onclick = function () {
  menu.style.display = "none";
  difficultyMenu.style.display = "flex";
};

easyBtn.onclick = function () {
  menu.style.display = "flex";
  difficultyMenu.style.display = "none";
  setChance = 10;
  setScore = 1000;
  speed = 100;
};

mediumBtn.onclick = function () {
  menu.style.display = "flex";
  difficultyMenu.style.display = "none";
  setChance = 5;
  setScore = 1000;
  speed = 70;
};

hardBtn.onclick = function () {
  menu.style.display = "flex";
  difficultyMenu.style.display = "none";
  setChance = 5;
  setScore = 1000;
  speed = 50;
};

quitBtn.onclick = function () {
  fetchTopScores();
  quitScreen.style.display = "flex";
  difficultyMenu.style.display = "none";
  gameWinScreen.style.display = "none";
  gameOverScreen.style.display = "none";
  menu.style.display = "none";
};

mainMenuBtn.onclick = function () {
  gameWinScreen.style.display = "none";
  // gameOverScreen.style.display = "none";
  menu.style.display = "flex";
};

mainMenuBtn2.onclick = function () {
  // gameWinScreen.style.display = "none";
  gameOverScreen.style.display = "none";
  menu.style.display = "flex";
};

quitScreen.onclick = function () {
  quitScreen.style.display = "none";
  menu.style.display = "flex";
};

playAgainBtn.onclick = function () {
  gameOverScreen.style.display = "none";
  startGame();
};

restartBtn.onclick = function () {
  gameWinScreen.style.display = "none";
  startGame();
};
// difficultyMenu.style.display = "none";
// quitScreen.style.display = "none";
// gameWinScreen.style.display = "none";
// gameOverScreen.style.display = "flex";
// menu.style.display = "none";

function startGame() {
  let score = 0;
  let maxScore = setScore;
  scoreBox.innerText = score;
  let chances = setChance;
  totalChances.innerText = chances;
  chanceBox.innerText = chances;
  gameOverScreen.style.display = "none";
  gameWinScreen.style.display = "none";
  quitScreen.style.display = "none";
  let ghostCreate = setInterval(() => {
    let ghost = document.createElement("img");
    ghost.src = "/assets/images/ghost.png";
    ghost.className = "ghost-icon";
    ghost.style.bottom = "0px";
    ghost.style.left = Math.random() * gameContainer.offsetWidth + "px";

    ghost.onclick = function () {
      score += 5;
      scoreBox.innerText = score;
      ghost.remove();
    };

    let movingKey = setInterval(() => {
      ghost.style.bottom = parseInt(ghost.style.bottom) + 1 + "px";

      let ghostBottom = ghost.offsetTop + ghost.offsetHeight;

      if (ghostBottom < 0) {
        --chances;
        chanceBox.innerText = chances;
        ghost.remove();
        if (chances == 0) {
          clearInterval(ghostCreate);
          gameOverScreen.style.display = "flex";
          for (let key of allGhostsKey) {
            clearInterval(key);
          }
          let ghosts = document.querySelectorAll(".ghost-icon");

          for (let ghost of ghosts) {
            ghost.remove();
          }
          saveScore(score); // Save score when the game is over
        }
      } else if (score == maxScore) {
        clearInterval(ghostCreate);
        gameWinScreen.style.display = "flex";
        for (let key of allGhostsKey) {
          clearInterval(key);
        }
        let ghosts = document.querySelectorAll(".ghost-icon");

        for (let ghost of ghosts) {
          ghost.remove();
        }
      }
    }, Math.random() * speed);

    allGhostsKey.push(movingKey);

    gameContainer.appendChild(ghost);
  }, 500);
}

function saveScore(score) {
  const rollno = localStorage.getItem("rollno"); // You might want to dynamically get this based on the logged-in user
  console.log(rollno);
  fetch(`https://scoreapi-z32i.onrender.com/api/scores/submit/${rollno}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ score }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Score saved:", data);
      
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function fetchTopScores() {
  fetch("https://scoreapi-z32i.onrender.com/api/scores/top", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Top scores", data);
      displayTopScores(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function displayTopScores(scores) {
  let scoresContainer = document.getElementById("top-score-container");

  // Clear previous scores
  while (scoresContainer.firstChild) {
    scoresContainer.removeChild(scoresContainer.firstChild);
  }

  scores.forEach((score) => {
    let scoreElement = document.createElement("div");
    scoreElement.className = "top-score";

    let userId = score.userId ? score.userId.rollno : "Unknown"; // Check if userId exists
    let scoreValue = score.score;

    let scoreParagraph = document.createElement("h1");
    scoreParagraph.innerText = `${userId}: ${scoreValue}`;

    scoreElement.appendChild(scoreParagraph);
    scoresContainer.appendChild(scoreElement);
  });
}
