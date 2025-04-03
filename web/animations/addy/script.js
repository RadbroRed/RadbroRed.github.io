let pillImages = [];  // Array to store the loaded images

function preload() {
  // Load the images
  pillImages.push(loadImage('pill1.png'));  // Update path accordingly
  pillImages.push(loadImage('pill2.png'));  // Update path accordingly
  pillImages.push(loadImage('pill3.png'));  // Update path accordingly
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
}

let pills = [];  // Array to hold the falling pills

function draw() {
  background(255, 255, 255, 25);  // Slightly transparent background for a fade effect

  // Create a new pill every frame with a random image and position
  let pill = {
    img: random(pillImages),
    x: random(width),
    y: 0,
    speed: random(1, 5)
  };
  pills.push(pill);

  // Draw each pill and update its position
  for (let i = pills.length - 1; i >= 0; i--) {
    image(pills[i].img, pills[i].x, pills[i].y);
    pills[i].y += pills[i].speed;  // Move pill down

    // Remove pill from array if it moves off the bottom of the screen
    if (pills[i].y > height + 20) {
      pills.splice(i, 1);
    }
  }
}
