const images = [
    './images/1.jpg',
    './images/2.jpg',
    './images/3.jpg',
    './images/4.jpg',
    './images/5.jpg'
];

let cards = [...images, ...images];
let moves = 0;
let flippedCards = [];
let matchedPairs = 0;
let currentImageIndex = 0;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createCard(imageUrl, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    
    // Resim div'i oluştur
    const imgDiv = document.createElement('div');
    imgDiv.className = 'card-face card-front';
    
    // Arka yüz div'i
    const backDiv = document.createElement('div');
    backDiv.className = 'card-face card-back';
    backDiv.innerHTML = '🎴';
    
    // Resmi background olarak ayarla
    imgDiv.style.backgroundImage = `url(${imageUrl})`;
    
    card.appendChild(backDiv);
    card.appendChild(imgDiv);
    card.addEventListener('click', flipCard);
    
    return card;
}

function flipCard() {
    if (flippedCards.length === 2) return;
    if (this.classList.contains('flipped')) return;

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves').textContent = moves;
        checkMatch();
    }
}

function showSuccessImage(isGameEnd = false) {
    const successOverlay = document.createElement('div');
    successOverlay.className = 'success-overlay';
    
    const successImg = document.createElement('img');
    successImg.src = './images/yes.jpg';
    
    // Resim yükleme hatası kontrolü
    successImg.onerror = function() {
        console.error('Başarı resmi yüklenemedi');
        successImg.src = './images/yes.jpg';
    };
    
    successOverlay.appendChild(successImg);
    document.body.appendChild(successOverlay);
    
    if (!isGameEnd) {
        setTimeout(() => {
            successOverlay.remove();
        }, 3000);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const match = cards[card1.dataset.index] === cards[card2.dataset.index];

    if (match) {
        matchedPairs++;
        flippedCards = [];
        
        setTimeout(() => {
            card1.style.transition = 'opacity 0.5s ease-out';
            card2.style.transition = 'opacity 0.5s ease-out';
            card1.style.opacity = '0';
            card2.style.opacity = '0';
            
            setTimeout(() => {
                card1.remove();
                card2.remove();
                
                showSuccessImage(false);
                
                if (matchedPairs === images.length) {
                    setTimeout(() => {
                        showSuccessImage(true);
                        setTimeout(() => {
                            alert(`Tebrikler! Oyunu ${moves} hamlede bitirdiniz!`);
                            resetGame();
                        }, 3500);
                    }, 3000);
                }
            }, 500);
        }, 1000);
        
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function resetGame() {
    const existingOverlay = document.querySelector('.success-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    moves = 0;
    matchedPairs = 0;
    flippedCards = [];
    document.getElementById('moves').textContent = moves;
    initializeGame();
}

function initializeGame() {
    cards = shuffle(cards);
    const gameBoard = document.getElementById('gameBoard');
    
    cards.forEach((imageUrl, index) => {
        const card = createCard(imageUrl, index);
        gameBoard.appendChild(card);
    });
}

function showMainMenu() {
    document.getElementById('mainMenu').style.display = 'block';
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('gallery').style.display = 'none';
    document.getElementById('about').style.display = 'none';
}

function startMatchGame() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    resetGame();
}

function showGallery() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('gallery').style.display = 'block';
    
    const galleryGrid = document.querySelector('.gallery-grid');
    galleryGrid.innerHTML = '';
    
    images.forEach((imagePath, index) => {
        const img = document.createElement('img');
        img.src = imagePath;
        img.onclick = () => showFullImage(index);
        galleryGrid.appendChild(img);
    });
}

function showFullImage(index) {
    currentImageIndex = index;
    
    const overlay = document.createElement('div');
    overlay.className = 'full-image-overlay';
    
    const container = document.createElement('div');
    container.className = 'full-image-container';
    
    const img = document.createElement('img');
    img.src = images[currentImageIndex];
    
    const prevButton = document.createElement('button');
    prevButton.className = 'nav-button prev-button';
    prevButton.innerHTML = '←';
    prevButton.onclick = showPrevImage;
    
    const nextButton = document.createElement('button');
    nextButton.className = 'nav-button next-button';
    nextButton.innerHTML = '→';
    nextButton.onclick = showNextImage;
    
    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '×';
    closeButton.onclick = () => overlay.remove();
    
    container.appendChild(img);
    overlay.appendChild(prevButton);
    overlay.appendChild(nextButton);
    overlay.appendChild(closeButton);
    overlay.appendChild(container);
    
    document.body.appendChild(overlay);
    
    // ESC tuşu ile kapatma
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') overlay.remove();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    });
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateFullImage();
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateFullImage();
}

function updateFullImage() {
    const img = document.querySelector('.full-image-container img');
    if (img) {
        img.src = images[currentImageIndex];
    }
}

function showAbout() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('about').style.display = 'block';
}

// Sayfa yüklendiğinde sadece ana menüyü göster, oyunu başlatma
window.onload = function() {
    showMainMenu();
}; 