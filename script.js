const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = { x: 50, y: canvas.height - 150, width: 50, height: 100, dy: 0, isJumping: false };
let obstacles = [];
let gameSpeed = 5;
let gravity = 0.5;

function drawPlayer() {
  ctx.fillStyle = 'white'; // Player color
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function updatePlayer() {
  player.y += player.dy;
  if (player.y + player.height < canvas.height) {
    player.dy += gravity;
  } else {
    player.y = canvas.height - player.height;
    player.isJumping = false;
  }
}

function createObstacle() {
  let height = Math.random() * (canvas.height / 2) + 50;
  let yPos = Math.random() > 0.5 ? canvas.height - height : 0;
  obstacles.push({ x: canvas.width, y: yPos, width: 50, height });
}

function drawObstacles() {
  ctx.fillStyle = 'red'; // Obstacle color
  obstacles.forEach((obstacle) => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

function updateObstacles() {
  obstacles.forEach((obstacle, index) => {
    obstacle.x -= gameSpeed;
    if (obstacle.x + obstacle.width < 0) {
      obstacles.splice(index, 1);
    }
  });
}

function detectCollision() {
  obstacles.forEach((obstacle) => {
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      alert('Game Over');
      document.location.reload();
    }
  });
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  updatePlayer();
  drawObstacles();
  updateObstacles();
  detectCollision();
  requestAnimationFrame(gameLoop);
}

// Controls
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && !player.isJumping) {
    player.dy = -15; // Jump force
    player.isJumping = true;
  }
  if (event.code === 'ArrowDown') {
    player.height = 50; // Duck
  }
});

document.addEventListener('keyup', (event) => {
  if (event.code === 'ArrowDown') {
    player.height = 100; // Stand up
  }
});

// Start the game
setInterval(createObstacle, 2000); // Add obstacles periodically
gameLoop();
