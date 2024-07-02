// Retrieve the canvas element from the HTML document and get its 2D drawing context.
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Initialize game variables
let playerX = 50; // Initial x position of the player
let playerY = canvas.height - 50; // Initial y position of the player
let playerWidth = 60; // Width of the player (3x original size)
let playerHeight = 60; // Height of the player (3x original size)
let playerSpeed = 2; // Speed at which the player moves
let jumpStrength = 10; // Initial jump velocity
let gravity = 0.33; // Gravity affecting the player
let velocityY = 0; // Vertical velocity of the player
let isJumping = false; // Flag to check if the player is jumping
let floorHeight = 20; // Height of the floor
let stars = []; // Array to hold star objects
let obstacles = []; // Array to hold obstacle objects
let mapPosition = 0; // Position of the map
let lastTime = 0; // Last time the game loop was run
let scrollSpeed = 0.5; // Adjust this value for slower scrolling
let points = 0; // Points counter
let gameOver = false; // Flag to check if the game is over
const minObstacleDistance = 200; // Minimum distance between obstacles

// Load the player character image
const playerImage = new Image();
playerImage.src = 'milady.png';

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

// Add event listener to restart button to reset the game
restartButton.addEventListener('click', function() {
    resetGame();
});

// Function to draw the player on the canvas
function drawPlayer() {
    ctx.save(); // Save the current context state
    ctx.translate(50 + playerWidth / 2, playerY + playerHeight / 2); // Move the context to the player's center
    ctx.scale(-1, 1); // Flip the context horizontally
    ctx.drawImage(playerImage, -playerWidth / 2, -playerHeight / 2, playerWidth, playerHeight); // Draw the image
    ctx.restore(); // Restore the context to its original state
}

// Function to draw the floor on the canvas
function drawFloor() {
    ctx.fillStyle = 'green';
    ctx.fillRect(0, canvas.height - floorHeight, canvas.width, floorHeight);
}

// Function to draw the background, including stars, on the canvas
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

// Function to draw points on the canvas
function drawPoints() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Points: ${points}`, 10, 30);
    ctx.fillText('Controls: Space or ArrowUp to Jump', 10, 60); // Added controls text
}

// Function to draw obstacles on the canvas
function drawObstacles() {
    ctx.fillStyle = 'blue';
    for (let obstacle of obstacles) {
        ctx.fillRect(obstacle.x - mapPosition, obstacle.y, obstacle.width, obstacle.height);
    }
}

// Function to generate stars
function generateStars() {
    stars = [];
    for (let i = 0; i < 100; i++) {
        stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height });
    }
}

// Function to generate obstacles
function generateObstacle() {
    let obstacleHeight = 20; // Fixed height for obstacles
    let obstacleY = canvas.height - floorHeight - obstacleHeight; // Position on the floor
    let lastObstacleX = obstacles.length > 0 ? obstacles[obstacles.length - 1].x : canvas.width;
    let obstacleX = lastObstacleX + minObstacleDistance + Math.random() * 200; // Ensure minimum distance between obstacles
    obstacles.push({
        x: obstacleX,
        y: obstacleY,
        width: 20,
        height: obstacleHeight
    });
}

// Function to check for collision with obstacles
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

// Main game loop function
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
        scrollSpeed = 0.33;
    } else if (points >= 500) {
        scrollSpeed = 0.22;
    } else if (points >= 300) {
        scrollSpeed = 0.2;
    } else if (points >= 69) {
        scrollSpeed = 0.15;
    } else {
        scrollSpeed = 0.08;
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

// Function to reset the game state
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

// Initialize game by generating stars and obstacles, and starting the game loop
generateStars();
generateObstacle();
requestAnimationFrame(update);

// Event listeners for jump
document.addEventListener('keydown', function(event) {
    if ((event.key === ' ' || event.key === 'ArrowUp') && playerY + playerHeight >= canvas.height - floorHeight) {
        isJumping = true;
    }
});