const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let playerX = 50;
let playerY = canvas.height - 50;
let playerWidth = 20;
let playerHeight = 20;
let playerSpeed = 2; // Speed at which the player moves
let jumpStrength = 10; // Initial jump velocity
let gravity = 0.33; // Gravity affecting the player
let velocityY = 0; // Vertical velocity of the player
let isJumping = false;
let floorHeight = 20; // Height of the floor
let stars = [];
let obstacles = [];
let mapPosition = 0; // Position of the map
let lastTime = 0;
let scrollSpeed = 0.5; // Adjust this value for slower scrolling
let points = 0; // Points counter
let gameOver = false;
const minObstacleDistance = 200; // Minimum distance between obstacles

// Create restart button
const restartButton = document.createElement('button');
restartButton.innerText = 'Restart';
restartButton.style.position = 'absolute';
restartButton.style.top = '50%';
restartButton.style.left = '50%';
restartButton.style.transform = 'translate(-50%, -50%)';
restartButton.style.padding = '10px 20px';
restartButton.style.fontSize = '20px';
restartButton.style.display = 'none';
document.body.appendChild(restartButton);

restartButton.addEventListener('click', function() {
    resetGame();
});

function drawPlayer() {
    ctx.fillStyle = 'red';
    ctx.fillRect(50, playerY, playerWidth, playerHeight);
}

function drawFloor() {
    ctx.fillStyle = 'green';
    ctx.fillRect(0, canvas.height - floorHeight, canvas.width, floorHeight);
}

function drawBackground() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    ctx.fillStyle = 'white';
    for (let star of stars) {
        let starX = (star.x - mapPosition) % canvas.width;
        if (starX < 0) starX += canvas.width;
        ctx.fillRect(starX, star.y, 2, 2);
    }
}

function drawPoints() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Points: ${points}`, 10, 30);
}

function drawObstacles() {
    ctx.fillStyle = 'blue';
    for (let obstacle of obstacles) {
        ctx.fillRect(obstacle.x - mapPosition, obstacle.y, obstacle.width, obstacle.height);
    }
}

function generateStars() {
    stars = [];
    for (let i = 0; i < 100; i++) {
        stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height });
    }
}

function generateObstacle() {
    let obstacleHeight = Math.random() < 0.5 ? 20 : 100; // Random height for obstacles
    let obstacleY = obstacleHeight === 20 ? canvas.height - floorHeight - obstacleHeight : canvas.height - floorHeight - 150; // Position above or on the floor
    let lastObstacleX = obstacles.length > 0 ? obstacles[obstacles.length - 1].x : canvas.width;
    let obstacleX = lastObstacleX + minObstacleDistance + Math.random() * 200; // Ensure minimum distance between obstacles
    obstacles.push({
        x: obstacleX,
        y: obstacleY,
        width: 20,
        height: obstacleHeight
    });
}

function checkCollision() {
    for (let obstacle of obstacles) {
        if (
            50 < obstacle.x - mapPosition + obstacle.width &&
            50 + playerWidth > obstacle.x - mapPosition &&
            playerY < obstacle.y + obstacle.height &&
            playerY + playerHeight > obstacle.y
        ) {
            return true;
        }
    }
    return false;
}

function update(timestamp) {
    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        restartButton.style.display = 'block';
        return;
    }

    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update map position based on scroll speed
    mapPosition += scrollSpeed * deltaTime;

    // Update points based on map position
    points = Math.floor(mapPosition / 10);

    // Increase scroll speed at specific checkpoints
    if (points >= 1000) {
        scrollSpeed = 0.69;
    } else if (points >= 777) {
        scrollSpeed = 0.5;
    } else if (points >= 500) {
        scrollSpeed = 0.4;
    } else if (points >= 300) {
        scrollSpeed = 0.3;
    } else if (points >= 100) {
        scrollSpeed = 0.2;
    } else {
        scrollSpeed = 0.1;
    }

    // Generate new obstacles as needed
    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x - mapPosition < canvas.width) {
        generateObstacle();
    }

    // Handle player jump
    if (isJumping) {
        velocityY = -jumpStrength;
        isJumping = false;
    }

    // Apply gravity
    velocityY += gravity;
    playerY += velocityY;

    // Check collision with the floor
    if (playerY + playerHeight > canvas.height - floorHeight) {
        playerY = canvas.height - floorHeight - playerHeight;
        velocityY = 0;
    }

    // Check for collisions with obstacles
    if (checkCollision()) {
        gameOver = true;
    }

    // Draw background
    drawBackground();

    // Draw floor
    drawFloor();

    // Draw obstacles
    drawObstacles();

    // Draw player
    drawPlayer();

    // Draw points
    drawPoints();

    requestAnimationFrame(update);
}

function resetGame() {
    playerY = canvas.height - 50;
    velocityY = 0;
    isJumping = false;
    mapPosition = 0;
    points = 0;
    scrollSpeed = 0.05; // Reset scroll speed
    gameOver = false;
    stars = [];
    obstacles = [];
    generateStars();
    restartButton.style.display = 'none';
    requestAnimationFrame(update);
}

generateStars();
generateObstacle();
requestAnimationFrame(update);

// Event listeners for jump
document.addEventListener('keydown', function(event) {
    if ((event.key === ' ' || event.key === 'ArrowUp') && playerY + playerHeight >= canvas.height - floorHeight) {
        isJumping = true;
    }
});