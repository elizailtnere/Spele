const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20; // size of the snake and food
const canvasSize = 600;

canvas.width = canvasSize;
canvas.height = canvasSize;

let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let food = {
    x: Math.floor(Math.random() * 29 + 1) * box,
    y: Math.floor(Math.random() * 29 + 1) * box,
};

let score = 0;
let highestScore = localStorage.getItem('highestScore') ? localStorage.getItem('highestScore') : 0;
let d;

// Get retry button
const retryButton = document.getElementById("retryButton");

// Add event listener to retry button
retryButton.addEventListener("click", () => {
    location.reload();
});

// Control the snake
document.addEventListener("keydown", direction);

function direction(event) {
    let key = event.keyCode;
    if (key == 37 && d != "RIGHT") {
        d = "LEFT";
    } else if (key == 38 && d != "DOWN") {
        d = "UP";
    } else if (key == 39 && d != "LEFT") {
        d = "RIGHT";
    } else if (key == 40 && d != "UP") {
        d = "DOWN";
    }
}

// Check collision function
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

// Draw everything to the canvas
function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 29 + 1) * box,
            y: Math.floor(Math.random() * 29 + 1) * box,
        };
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY,
    };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvasSize || snakeY >= canvasSize || collision(newHead, snake)) {
        if (score > highestScore) {
            highestScore = score;
            localStorage.setItem('highestScore', highestScore);
        }
        clearInterval(game);
        retryButton.style.display = "block";
    }

    snake.unshift(newHead);

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Rezultāts: " + score, box, 1.5 * box);
    ctx.fillText("Labākais rezultāts: " + highestScore, box, 3.5 * box);
}

let game = setInterval(draw, 100);

