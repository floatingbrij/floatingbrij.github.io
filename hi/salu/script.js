
// ============ FLOATING HEARTS ============
function createFloatingHearts() {
    const container = document.getElementById('floatingHearts');
    const hearts = ['💕', '💗', '💖', '💝', '💓', '♥️', '🩷', '🌸', '✨', '🦋'];

    for (let i = 0; i < 30; i++) {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 20 + 12) + 'px';
        heart.style.animationDuration = (Math.random() * 10 + 8) + 's';
        heart.style.animationDelay = (Math.random() * 15) + 's';
        container.appendChild(heart);
    }
}

createFloatingHearts();

// ============ BACKGROUND MUSIC ============
const bgMusic = document.getElementById('bgMusic');
const musicControl = document.getElementById('musicControl');
let isPlaying = false;

musicControl.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicControl.textContent = '🎵';
        musicControl.classList.remove('playing');
    } else {
        bgMusic.play().catch(() => {
            console.log('Autoplay blocked, user interaction needed');
        });
        musicControl.textContent = '🎶';
        musicControl.classList.add('playing');
    }
    isPlaying = !isPlaying;
});

// ============ SCROLL FADE-IN ANIMATION ============
const fadeElements = document.querySelectorAll('.fade-in');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

fadeElements.forEach(el => observer.observe(el));

// ============ VALENTINE BUTTONS ============
const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
const valentineQuestion = document.getElementById('valentineQuestion');
const valentineButtons = document.getElementById('valentineButtons');
const yesResponse = document.getElementById('yesResponse');

// Make No button run away
let noClickCount = 0;

btnNo.addEventListener('mouseover', moveNoButton);
btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
});
btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
});

function moveNoButton() {
    noClickCount++;

    const card = document.getElementById('valentineCard');
    const cardRect = card.getBoundingClientRect();

    const maxX = cardRect.width - btnNo.offsetWidth - 40;
    const maxY = 200;

    const randomX = Math.random() * maxX - maxX / 2;
    const randomY = Math.random() * maxY - maxY / 2;

    btnNo.style.position = 'relative';
    btnNo.style.left = randomX + 'px';
    btnNo.style.top = randomY + 'px';

    // Change text based on attempts
    const noTexts = [
        'No 😢',
        'Are you sure? 🥺',
        'Really?? 😭',
        'Think again! 💔',
        'Pleeease? 🥹',
        'Don\'t do this 😿',
        'I\'ll cry! 😢',
        'Pretty please? 🌸',
        'Last chance! 💕',
        'You can\'t click me! 😝'
    ];

    btnNo.textContent = noTexts[Math.min(noClickCount, noTexts.length - 1)];

    // Make yes button bigger each time
    const scale = 1 + (noClickCount * 0.1);
    btnYes.style.transform = `scale(${Math.min(scale, 1.8)})`;
}

// Yes button click
btnYes.addEventListener('click', () => {
    // Cross out the question
    valentineQuestion.classList.add('crossed');

    // Hide buttons
    valentineButtons.style.display = 'none';

    // Show response
    yesResponse.style.display = 'block';

    // Launch confetti!
    launchConfetti();

    // Add extra floating hearts
    createCelebrationHearts();
});

// ============ CONFETTI ============
function launchConfetti() {
    const colors = ['#e91e63', '#ff6090', '#f48fb1', '#ce93d8', '#9c27b0', '#ff4081', '#f50057', '#ff80ab', '#ea80fc', '#ffd54f', '#ff8a65'];
    const shapes = ['circle', 'square', 'triangle'];

    for (let i = 0; i < 150; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti-piece');
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = (Math.random() * 10 + 5) + 'px';
            confetti.style.height = (Math.random() * 10 + 5) + 'px';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';

            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            if (shape === 'circle') {
                confetti.style.borderRadius = '50%';
            } else if (shape === 'triangle') {
                confetti.style.width = '0';
                confetti.style.height = '0';
                confetti.style.backgroundColor = 'transparent';
                confetti.style.borderLeft = '6px solid transparent';
                confetti.style.borderRight = '6px solid transparent';
                confetti.style.borderBottom = '12px solid ' + colors[Math.floor(Math.random() * colors.length)];
            }

            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 5000);
        }, i * 30);
    }
}

function createCelebrationHearts() {
    const container = document.getElementById('floatingHearts');
    const hearts = ['💕', '💗', '💖', '💝', '🎉', '✨', '🥳', '💍', '🎊'];

    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 25 + 15) + 'px';
        heart.style.animationDuration = (Math.random() * 6 + 4) + 's';
        heart.style.animationDelay = '0s';
        container.appendChild(heart);
    }
}
