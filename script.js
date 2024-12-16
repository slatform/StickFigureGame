const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = { x: 100, y: canvas.height - 150, width: 50, height: 100, dy: 0, isJumping: false, isDucking: false };
let obstacles = [];
let backgroundX = 0;
let gameSpeed = 5;
let gravity = 0.8;
let score = 0;
let isGameOver = false;

// Draw the stick figure
function drawPlayer() {
  ctx.fillStyle = 'black';
  if (player.isDucking) {
    ctx.fillRect(player.x, player.y + 50, player.width, player.height / 2); // Duck position
  } else {
    ctx.fillRect(player.x, player.y, player.width, player.height); // Normal position
  }
}

// Update the player's position
function updatePlayer() {
  player.y += player.dy;

  if (player.y + player.height < canvas.height) {
    player.dy += gravity; // Apply gravity
  } else {
    player.y = canvas.height - player.height; // Stay on the ground
    player.dy = 0;
    player.isJumping = false;
  }
}

// Create obstacles with varying heights and speeds
function createObstacle() {
  let height = Math.random() * 150 + 50;
  obstacles.push({
    x: canvas.width,
    y: canvas.height - height,
    width: Math.random() * 50 + 50,
    height,
    speed: gameSpeed + Math.random() * 3,
  });
}

// Draw and update obstacles
function drawObstacles() {
  ctx.fillStyle = 'red';
  obstacles.forEach((obstacle) => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

function updateObstacles() {
  obstacles.forEach((obstacle, index) => {
    obstacle.x -= obstacle.speed;

    // Remove obstacles that go off-screen
    if (obstacle.x + obstacle.width < 0) {
      obstacles.splice(index, 1);
      score += 10; // Increment score when an obstacle is passed
    }

    // Collision detection
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      isGameOver = true;
    }
  });
}

// Background scrolling
function drawBackground() {
  ctx.fillStyle = '#add8e6';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#228B22';
  ctx.fillRect(0, canvas.height - 20, canvas.width, 20); // Ground
}

// Game loop
function gameLoop() {
  if (isGameOver) {
    document.getElementById('game-over').style.display = 'block';
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawPlayer();
  updatePlayer();
  drawObstacles();
  updateObstacles();

  // Update and display score
  document.getElementById('score').innerText = `Score: ${score}`;

  requestAnimationFrame(gameLoop);
}

// Controls
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && !player.isJumping) {
    player.dy = -15; // Jump force
    player.isJumping = true;
  }
  if (event.code === 'ArrowDown') {
    player.isDucking = true; // Duck
  }
  if (event.code === 'KeyR' && isGameOver) {
    location.reload(); // Restart the game
  }
});

document.addEventListener('keyup', (event) => {
  if (event.code === 'ArrowDown') {
    player.isDucking = false; // Stop ducking
  }
});

// Start the game
setInterval(createObstacle, 2000); // Add obstacles periodically
gameLoop();
