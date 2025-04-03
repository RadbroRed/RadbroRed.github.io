document.addEventListener('DOMContentLoaded', () => {
    const imageFolder = '/single-card/images/';
    const imageCount = 20; // Adjusted to use 20 images
    const images = [];
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');

    // Generate image paths
    for (let i = 1; i <= imageCount; i++) {
        images.push(`${imageFolder}image${i}.png`);
    }

    // Shuffle images
    for (let i = images.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [images[i], images[j]] = [images[j], images[i]];
    }

    // Load images and draw on canvas
    const loadedImages = [];
    images.forEach((src, index) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            loadedImages.push(img);
            if (loadedImages.length === images.length) {
                drawImages();
            }
        };
    });

    function drawImages() {
        const imgWidth = canvas.width / 5; // Adjust grid size
        const imgHeight = canvas.height / 5; // Adjust grid size
        let imgIndex = 0;

        for (let y = 0; y < canvas.height; y += imgHeight) {
            for (let x = 0; x < canvas.width; x += imgWidth) {
                ctx.drawImage(loadedImages[imgIndex], x, y, imgWidth, imgHeight);
                imgIndex = (imgIndex + 1) % loadedImages.length;
            }
        }
    }

    // Resize canvas to fill window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (loadedImages.length === images.length) {
            drawImages();
        }
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
});
