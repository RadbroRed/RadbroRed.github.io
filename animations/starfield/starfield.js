let sketch = function(p) {
    let stars = [];
    let speed;
    let camX = 0;
    let camY = 0;
  
    p.setup = function() {
      p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
      p.canvas.id = 'starfield-canvas'; // Add an id to the canvasa
      speed = 1; // Increase speed
  
      // Create a random set of stars with cyberpunk colors
      for (let i = 0; i < 800; i++) {
        stars[i] = new Star();
      }
    };
  
    p.draw = function() {
        p.background(0);
        // Removed camX and camY calculations
        p.camera(0, 0, (p.height / 2) / p.tan(p.PI/6), 0, 0, 0, 0, 1, 0);
      
        for (let i = 0; i < stars.length; i++) {
          stars[i].update();
          stars[i].show();
        }
      };

    class Star {
      constructor() {
        this.x = p.random(-p.width, p.width);
        this.y = p.random(-p.height, p.height);
        this.z = p.random(p.width);
        this.pz = this.z;
        this.color = p.color(p.random(100, 200), p.random(100, 200), p.random(100, 200), p.random(100, 255)); // Cyberpunk color
      }
  
      update() {
        this.z = this.z - speed;
  
        if (this.z < 1) {
          this.z = p.width;
          this.x = p.random(-p.width, p.width);
          this.y = p.random(-p.height, p.height);
          this.pz = this.z;
        }
      }
  
      show() {
        p.fill(this.color);
        p.noStroke();
  
        let sx = p.map(this.x / this.z, 0, 1, 0, p.width);
        let sy = p.map(this.y / this.z, 0, 1, 0, p.height);
  
        let r = p.map(this.z, 0, p.width, 8, 0); // Smaller stars for streak effect
        p.ellipse(sx, sy, r, r);
  
        let px = p.map(this.x / this.pz, 0, 1, 0, p.width);
        let py = p.map(this.y / this.pz, 0, 1, 0, p.height);
  
        this.pz = this.z;
  
        p.stroke(this.color);
        p.line(px, py, sx, sy);
      }
    }
  
    p.windowResized = function() {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
  };
  
  new p5(sketch, 'starfield'); // Create the sketch in the #starfield div