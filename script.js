const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
  x: 100,
  y: canvas.height - 150,
  width: 50,
  height: 100,
  dy: 0,
  isJumping: false,
};
let obstacles = [];
let gameSpeed = 5;
let gravity = 0.8;
let score = 0;
let isGameOver = false;

// Adjusted maximum jump height
const maxJumpHeight = -15;

// Draw the stick figure
function drawPlayer() {
  ctx.fillStyle = 'black';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Update the player's position
function updatePlayer() {
  player.y += player.dy;

  // Apply gravity
  if (player.y + player.height < canvas.height) {
    player.dy += gravity;
  } else {
    // Reset to the ground
    player.y = canvas.height - player.height;
    player.dy = 0;
    player.isJumping = false;
  }
}

// Create ground obstacles
function createObstacle() {
  const width = Math.random() * 50 + 30; // Random width between 30 and 80
  const height = Math.random() * 30 + 30; // Random height between 30 and 60
  obstacles.push({
    x: canvas.width,
    y: canvas.height - height, // Place obstacles on the ground
    width,
    height,
    speed: gameSpeed + Math.random() * 2, // Vary obstacle speed slightly
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

// Background and ground
function drawBackground() {
  ctx.fillStyle = '#add8e6'; // Light blue background
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#228B22'; // Green ground
  ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
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
  if (event.code === 'Space') {
    if (player.y + player.height === canvas.height || player.dy < maxJumpHeight) {
      player.dy = maxJumpHeight; // Apply jump force on every press
    }
    player.isJumping = true;
  }
  if (event.code === 'KeyR' && isGameOver) {
    location.reload(); // Restart the game
  }
});

// Start the game
setInterval(createObstacle, 2000); // Add obstacles periodically
gameLoop();
