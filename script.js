/* ============================================
   Valentine's Day Website - Interactive Logic
   ============================================ */

// Photo collection
const photos = [
    'photos/WhatsApp Image 2026-02-04 at 09.57.28.jpeg',
    'photos/WhatsApp Image 2026-02-04 at 09.57.28 (1).jpeg',
    'photos/WhatsApp Image 2026-02-04 at 09.57.28 (2).jpeg',
    'photos/WhatsApp Image 2026-02-04 at 09.57.28 (3).jpeg',
    'photos/WhatsApp Image 2026-02-04 at 09.57.28 (4).jpeg',
    'photos/WhatsApp Image 2026-02-04 at 09.57.28 (5).jpeg',
    'photos/WhatsApp Image 2026-02-04 at 09.57.28 (6).jpeg',
    'photos/WhatsApp Image 2026-02-04 at 09.57.28 (7).jpeg',
    'photos/WhatsApp Image 2026-02-04 at 09.57.28 (8).jpeg',
    'photos/WhatsApp Image 2026-02-04 at 09.57.28 (9).jpeg',
    'photos/WhatsApp Image 2026-02-04 at 09.57.28 (10).jpeg',
    'photos/WhatsApp Image 2026-02-04 at 09.57.29.jpeg',
    'photos/WhatsApp Image 2026-02-04 at 09.57.29 (1).jpeg',
    'photos/WhatsApp Image 2026-02-04 at 09.57.31.jpeg',
    'photos/WhatsApp Image 2026-02-04 at 09.57.32.jpeg',
    'photos/WhatsApp Image 2026-02-04 at 09.57.33.jpeg',
    'photos/WhatsApp Image 2026-02-04 at 09.57.34.jpeg'
];

// State
let currentPhotoIndex = 0;
let noClickCount = 0;
let questionScale = 1;
let yesBtnScale = 1;
let noBtnScale = 1;

// DOM Elements
const envelope = document.getElementById('envelope');
const clickPrompt = document.getElementById('click-prompt');
const question = document.getElementById('question');
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const celebration = document.getElementById('celebration');
const photoCarousel = document.getElementById('photo-carousel');
const confettiContainer = document.getElementById('confetti');
const heartsExplosion = document.getElementById('hearts-explosion');
const photoBackground = document.querySelector('.photo-background');
const photoCurrent = document.querySelector('.photo-current');
const photoNext = document.querySelector('.photo-next');

// Preload images
function preloadImages() {
    photos.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    
    // Set initial background photo
    photoCurrent.style.backgroundImage = `url('${photos[0]}')`;
});

// Envelope click handler
envelope.addEventListener('click', () => {
    if (envelope.classList.contains('opened')) return;
    
    envelope.classList.add('opened');
    
    // Remove the click prompt completely
    clickPrompt.style.display = 'none';
    
    // Show background after a short delay
    setTimeout(() => {
        photoBackground.classList.add('visible');
    }, 800);
});

// No button click handler
btnNo.addEventListener('click', (e) => {
    e.stopPropagation();
    noClickCount++;
    
    // Increase question size
    questionScale += 0.15;
    question.style.transform = `scale(${questionScale})`;
    
    // Increase Yes button size
    yesBtnScale += 0.15;
    btnYes.style.transform = `scale(${yesBtnScale})`;
    
    // Cycle to next photo
    cyclePhoto();
    
    // Make the No button run away!
    runAwayNoButton();
});

// Make the No button run to a random position on screen
function runAwayNoButton() {
    // First time: move button out of the letter and make it fixed
    if (!btnNo.classList.contains('running')) {
        const rect = btnNo.getBoundingClientRect();
        
        // Move button to body so it's not constrained by the letter
        document.body.appendChild(btnNo);
        
        // Set initial position
        btnNo.style.left = rect.left + 'px';
        btnNo.style.top = rect.top + 'px';
        btnNo.classList.add('running');
        
        // Small delay to let the fixed positioning take effect
        setTimeout(() => moveToRandomPosition(), 100);
    } else {
        moveToRandomPosition();
    }
}

function moveToRandomPosition() {
    // Get actual button dimensions
    const btnRect = btnNo.getBoundingClientRect();
    const btnWidth = btnRect.width || 100;
    const btnHeight = btnRect.height || 40;
    
    // Get viewport dimensions with safe padding for mobile
    const padding = 20;
    const safeTop = padding;
    const safeBottom = window.innerHeight - btnHeight - padding;
    const safeLeft = padding;
    const safeRight = window.innerWidth - btnWidth - padding;
    
    // Generate random position within safe bounds
    const randomX = safeLeft + Math.random() * (safeRight - safeLeft);
    const randomY = safeTop + Math.random() * (safeBottom - safeTop);
    
    // Ensure values are valid
    const finalX = Math.max(safeLeft, Math.min(randomX, safeRight));
    const finalY = Math.max(safeTop, Math.min(randomY, safeBottom));
    
    // Move the button
    btnNo.style.left = finalX + 'px';
    btnNo.style.top = finalY + 'px';
    
    // Shrink it a little each time (but keep it visible on mobile!)
    noBtnScale = Math.max(0.7, noBtnScale - 0.04);
    btnNo.style.transform = `scale(${noBtnScale})`;
}

// Also run away on hover for extra fun (desktop only)
btnNo.addEventListener('mouseenter', () => {
    if (noClickCount > 0 && !isTouchDevice()) {
        runAwayNoButton();
    }
});

// Handle touch devices
btnNo.addEventListener('touchstart', (e) => {
    if (noClickCount > 0) {
        e.preventDefault();
        e.stopPropagation();
        
        // Run away and update state
        noClickCount++;
        questionScale += 0.15;
        question.style.transform = `scale(${questionScale})`;
        yesBtnScale += 0.15;
        btnYes.style.transform = `scale(${yesBtnScale})`;
        cyclePhoto();
        runAwayNoButton();
    }
}, { passive: false });

// Detect touch device
function isTouchDevice() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
}

// Handle orientation change and resize
window.addEventListener('resize', () => {
    // If the No button is running, make sure it's still in bounds
    if (btnNo.classList.contains('running')) {
        const rect = btnNo.getBoundingClientRect();
        const padding = 20;
        
        // Check if button is off screen and move it back
        if (rect.right > window.innerWidth - padding || 
            rect.bottom > window.innerHeight - padding ||
            rect.left < padding ||
            rect.top < padding) {
            moveToRandomPosition();
        }
    }
});

// Cycle background photo
function cyclePhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
    const nextPhoto = photos[currentPhotoIndex];
    
    // Set next photo
    photoNext.style.backgroundImage = `url('${nextPhoto}')`;
    
    // Crossfade
    photoCurrent.style.opacity = '0';
    photoNext.style.opacity = '1';
    
    // After transition, swap layers
    setTimeout(() => {
        photoCurrent.style.backgroundImage = `url('${nextPhoto}')`;
        photoCurrent.style.opacity = '1';
        photoNext.style.opacity = '0';
    }, 1000);
}

// Yes button click handler
btnYes.addEventListener('click', (e) => {
    e.stopPropagation();
    showCelebration();
});

// Show celebration
function showCelebration() {
    celebration.classList.add('active');
    
    // Create confetti
    createConfetti();
    
    // Create heart explosion
    createHeartsExplosion();
    
    // Show photos in carousel
    showPhotoCarousel();
}

// Create confetti effect
function createConfetti() {
    const colors = ['#e8919c', '#c25b6a', '#f8e1e7', '#b76e79', '#722f37', '#ffd700'];
    const shapes = ['square', 'circle'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = shapes[Math.floor(Math.random() * shapes.length)] === 'circle' ? '50%' : '2px';
            confetti.style.width = (Math.random() * 10 + 5) + 'px';
            confetti.style.height = (Math.random() * 10 + 5) + 'px';
            confetti.style.animationDuration = (Math.random() * 2 + 3) + 's';
            confetti.style.animationDelay = (Math.random() * 0.5) + 's';
            
            confettiContainer.appendChild(confetti);
            
            // Remove after animation
            setTimeout(() => confetti.remove(), 5000);
        }, i * 30);
    }
}

// Create hearts explosion effect
function createHeartsExplosion() {
    const heartSymbols = ['♥', '❤', '💕', '💖', '💗', '💓'];
    
    for (let i = 0; i < 30; i++) {
        const heart = document.createElement('div');
        heart.className = 'explosion-heart';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        
        // Random direction
        const angle = (Math.random() * 360) * (Math.PI / 180);
        const distance = Math.random() * 300 + 100;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        heart.style.setProperty('--x', x + 'px');
        heart.style.setProperty('--y', y + 'px');
        heart.style.fontSize = (Math.random() * 2 + 1) + 'rem';
        heart.style.animationDelay = (Math.random() * 0.3) + 's';
        
        // Custom animation with dynamic endpoint
        heart.style.animation = `explode-heart-${i} 2s ease-out forwards`;
        
        // Add custom keyframes for this heart
        const keyframes = `
            @keyframes explode-heart-${i} {
                0% {
                    transform: translate(0, 0) scale(0);
                    opacity: 1;
                }
                50% {
                    opacity: 1;
                }
                100% {
                    transform: translate(${x}px, ${y}px) scale(1.5);
                    opacity: 0;
                }
            }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);
        
        heartsExplosion.appendChild(heart);
        
        // Remove after animation
        setTimeout(() => heart.remove(), 2500);
    }
}

// Show photos in carousel
function showPhotoCarousel() {
    // Clear existing
    photoCarousel.innerHTML = '';
    
    // Add each photo with staggered animation
    photos.forEach((photo, index) => {
        setTimeout(() => {
            const img = document.createElement('img');
            img.src = photo;
            img.alt = 'Our memory';
            img.style.animationDelay = `${index * 0.1}s`;
            photoCarousel.appendChild(img);
        }, index * 100);
    });
}

// Prevent letter content clicks from closing envelope
document.querySelector('.letter-content').addEventListener('click', (e) => {
    e.stopPropagation();
});

// Prevent double-tap zoom on buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('touchend', (e) => {
        e.preventDefault();
    }, { passive: false });
});

// Handle Yes button on touch
btnYes.addEventListener('touchstart', (e) => {
    e.stopPropagation();
}, { passive: true });

btnYes.addEventListener('touchend', (e) => {
    e.preventDefault();
    e.stopPropagation();
    showCelebration();
}, { passive: false });
