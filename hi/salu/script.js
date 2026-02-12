
// Mark that JS is running (used for graceful CSS fallbacks)
document.documentElement.classList.add('js');

// ============ FLOATING HEARTS ============
function createFloatingHearts() {
    const container = document.getElementById('floatingHearts');
    const hearts = ['💕', '💗', '💖', '💝', '💓', '♥️', '🩷', '🌸', '✨', '🦋'];

    if (!container) return;

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

// ============ GIF FALLBACKS ============
// Some Giphy "v1" URLs can fail (blocked/expired). If an image fails to load,
// swap it to a cute emoji placeholder so the layout never looks broken.
document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', () => {
        // Avoid infinite loops if the fallback also fails
        if (img.dataset.fallbackApplied === 'true') return;
        img.dataset.fallbackApplied = 'true';

        // Keep sizing consistent with existing styles
        img.alt = img.alt || 'cute';
        img.src =
            'data:image/svg+xml;charset=UTF-8,' +
            encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="420" height="260" viewBox="0 0 420 260">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff0f7"/>
      <stop offset="0.5" stop-color="#ffe1ee"/>
      <stop offset="1" stop-color="#f8bbd0"/>
    </linearGradient>
    <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#e91e63" flood-opacity="0.18"/>
    </filter>
  </defs>
  <rect x="16" y="16" rx="28" ry="28" width="388" height="228" fill="url(#g)" filter="url(#s)"/>
  <text x="210" y="120" text-anchor="middle" font-size="56">💕</text>
  <text x="210" y="168" text-anchor="middle" font-family="system-ui,Segoe UI,Arial" font-size="18" fill="#ad1457">
    gif didn’t load but love did
  </text>
</svg>`);
    });
});

// ============ BACKGROUND MUSIC ============
const bgMusic = document.getElementById('bgMusic');
const musicControl = document.getElementById('musicControl');
let isPlaying = false;

if (bgMusic && musicControl) {
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
}

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

// If this page variant doesn't include the valentine section, stop here gracefully.
if (!btnYes || !btnNo || !valentineQuestion || !valentineButtons || !yesResponse) {
    // Still keep fade-in / hearts working.
    // eslint-disable-next-line no-useless-return
    return;
}

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

// ============ SLIDING PUZZLE (IMAGE 24) ============
const puzzleContainer = document.getElementById('puzzleGrid');
const puzzleStatus = document.getElementById('puzzleStatus');

if (puzzleContainer && puzzleStatus) {
    const size = 3;
    const total = size * size;
    let board = [];
    let emptyIndex = total - 1;
    let moves = 0;

    function initBoard() {
        board = [];
        for (let i = 0; i < total - 1; i++) {
            board.push(i);
        }
        board.push(null); // last is empty
        emptyIndex = total - 1;
    }

    function isSolvable(arr) {
        const flat = arr.filter((x) => x !== null);
        let inv = 0;
        for (let i = 0; i < flat.length; i++) {
            for (let j = i + 1; j < flat.length; j++) {
                if (flat[i] > flat[j]) inv++;
            }
        }
        // 3x3 puzzle: solvable when inversion count is even
        return inv % 2 === 0;
    }

    function shuffleBoard() {
        let shuffled;
        do {
            shuffled = [...board];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
        } while (!isSolvable(shuffled) || shuffled.every((v, idx) => v === board[idx]));

        board = shuffled;
        emptyIndex = board.indexOf(null);
    }

    function isAdjacent(i1, i2) {
        const r1 = Math.floor(i1 / size);
        const c1 = i1 % size;
        const r2 = Math.floor(i2 / size);
        const c2 = i2 % size;
        return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
    }

    function handleTileClick(pos) {
        if (!isAdjacent(pos, emptyIndex)) return;

        [board[pos], board[emptyIndex]] = [board[emptyIndex], board[pos]];
        emptyIndex = pos;
        moves += 1;
        updateStatus();
        render();

        if (isSolved()) {
            onSolved();
        }
    }

    function isSolved() {
        for (let i = 0; i < total - 1; i++) {
            if (board[i] !== i) return false;
        }
        return board[total - 1] === null;
    }

    function updateStatus() {
        puzzleStatus.textContent = `Moves: ${moves}`;
    }

    function render() {
        puzzleContainer.innerHTML = '';

        board.forEach((piece, index) => {
            const tile = document.createElement('button');
            tile.type = 'button';
            tile.className = 'puzzle-tile';
            tile.dataset.index = index.toString();

            if (piece === null) {
                tile.classList.add('puzzle-empty');
                tile.setAttribute('aria-label', 'Empty space');
            } else {
                const row = Math.floor(piece / size);
                const col = piece % size;

                tile.style.backgroundPosition = `${(col / (size - 1)) * 100}% ${(row / (size - 1)) * 100}%`;
                tile.setAttribute('aria-label', 'Puzzle piece');
                tile.addEventListener('click', () => handleTileClick(index));
            }

            puzzleContainer.appendChild(tile);
        });
    }

    function onSolved() {
        const root = document.documentElement;
        root.classList.add('puzzle-solved');
        puzzleStatus.textContent = 'Solved! Scroll a little down for your question 💕';
    }

    initBoard();
    shuffleBoard();
    moves = 0;
    updateStatus();
    render();
}
