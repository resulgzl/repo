let snake = {
    x: 160,
    y: 160,
    dx: 0,
    dy: 0,
    cells: [],
    maxCells: 4
};

let food = {
    x: 320,
    y: 320
};

let canvas, ctx;
let score = 0;
let gridSize = 16;
let count = 0;

const snakeHead1 = new Image();
const snakeHead2 = new Image();
snakeHead1.src = 'images/head1.jpg';  // İlk kafa resmi
snakeHead2.src = 'images/head2.jpg';  // İkinci kafa resmi
let currentHead = snakeHead1;

function startSnakeGame() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('snakeContainer').style.display = 'block';
    
    canvas = document.getElementById('snakeCanvas');
    ctx = canvas.getContext('2d');
    
    // Ekran boyutuna göre canvas'ı ayarla
    const containerWidth = document.getElementById('snakeContainer').clientWidth;
    canvas.width = Math.min(400, containerWidth - 40);
    canvas.height = Math.min(400, containerWidth - 40);
    
    // Grid boyutunu canvas'a göre ayarla
    gridSize = Math.floor(canvas.width / 25);
    
    // Oyunu sıfırla
    snake.x = gridSize * 10;
    snake.y = gridSize * 10;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = gridSize;
    snake.dy = 0;
    score = 0;
    
    // Yemeği rastgele konumlandır
    food.x = getRandomInt(0, canvas.width/gridSize) * gridSize;
    food.y = getRandomInt(0, canvas.height/gridSize) * gridSize;
    
    document.getElementById('snakeScore').textContent = score;
    
    // Klavye kontrolleri
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' && snake.dx === 0) {
            snake.dx = -gridSize;
            snake.dy = 0;
            currentHead = snakeHead1;
        }
        else if (e.key === 'ArrowUp' && snake.dy === 0) {
            snake.dx = 0;
            snake.dy = -gridSize;
            currentHead = snakeHead2;
        }
        else if (e.key === 'ArrowRight' && snake.dx === 0) {
            snake.dx = gridSize;
            snake.dy = 0;
            currentHead = snakeHead1;
        }
        else if (e.key === 'ArrowDown' && snake.dy === 0) {
            snake.dx = 0;
            snake.dy = gridSize;
            currentHead = snakeHead2;
        }
    });
    
    // Mobil kontrol butonları
    const handleButton = (direction) => {
        if (direction === 'up' && snake.dy === 0) {
            snake.dx = 0;
            snake.dy = -gridSize;
            currentHead = snakeHead2;
        } else if (direction === 'down' && snake.dy === 0) {
            snake.dx = 0;
            snake.dy = gridSize;
            currentHead = snakeHead2;
        } else if (direction === 'left' && snake.dx === 0) {
            snake.dx = -gridSize;
            snake.dy = 0;
            currentHead = snakeHead1;
        } else if (direction === 'right' && snake.dx === 0) {
            snake.dx = gridSize;
            snake.dy = 0;
            currentHead = snakeHead1;
        }
    };

    ['up', 'down', 'left', 'right'].forEach(direction => {
        const btn = document.getElementById(`${direction}Btn`);
        ['touchstart', 'mousedown'].forEach(eventType => {
            btn.addEventListener(eventType, (e) => {
                e.preventDefault();
                handleButton(direction);
            });
        });
    });
    
    // Oyun döngüsünü başlat
    requestAnimationFrame(loop);
}

function loop() {
    if (document.getElementById('snakeContainer').style.display === 'none') {
        return;
    }
    
    requestAnimationFrame(loop);
    
    if (++count < 4) {
        return;
    }
    
    count = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    snake.x += snake.dx;
    snake.y += snake.dy;
    
    if (snake.x < 0) {
        snake.x = canvas.width - gridSize;
    }
    else if (snake.x >= canvas.width) {
        snake.x = 0;
    }
    
    if (snake.y < 0) {
        snake.y = canvas.height - gridSize;
    }
    else if (snake.y >= canvas.height) {
        snake.y = 0;
    }
    
    snake.cells.unshift({x: snake.x, y: snake.y});
    
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }
    
    // Yemeği çiz
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize-1, gridSize-1);
    
    // Yılanı çiz
    snake.cells.forEach(function(cell, index) {
        if (index === 0) {
            // Kafa resmini çiz
            ctx.drawImage(currentHead, cell.x, cell.y, gridSize-1, gridSize-1);
        } else {
            ctx.fillStyle = '#2196F3';
            ctx.fillRect(cell.x, cell.y, gridSize-1, gridSize-1);
        }
        
        // Yemek kontrolü
        if (cell.x === food.x && cell.y === food.y) {
            snake.maxCells++;
            score += 10;
            document.getElementById('snakeScore').textContent = score;
            food.x = getRandomInt(0, canvas.width/gridSize) * gridSize;
            food.y = getRandomInt(0, canvas.height/gridSize) * gridSize;
        }
        
        // Çarpışma kontrolü
        for (let i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                alert(`Oyun Bitti! Skorunuz: ${score}`);
                startSnakeGame();
                return;
            }
        }
    });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
} 