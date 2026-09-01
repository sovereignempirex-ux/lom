/* ============================================
   LOMINGFI — The Legend of Dragon Raja
   Crystal Palace Birthday Celebration
   JavaScript Logic
   ============================================ */

// ===== GLOBAL STATE =====
let currentScene = 1;
let totalScenes = 8;
let introSkipped = false;
let musicPlaying = false;
let dragonMode = false;
let countdownInterval = null;
let gameScores = {
  crystal: 0,
  dragon: 0,
  crown: 0,
  energy: 0
};

// ===== BACKGROUND CANVAS ANIMATION =====
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas.getContext('2d');
let particles = [];
let crystals = [];
let stars = [];
let auroraWaves = [];

function resizeCanvas() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle class
class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * bgCanvas.width;
    this.y = Math.random() * bgCanvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.2;
    this.hue = Math.random() > 0.5 ? 190 : 270; // Blue or violet
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > bgCanvas.width || this.y < 0 || this.y > bgCanvas.height) {
      this.reset();
    }
  }
  draw() {
    bgCtx.beginPath();
    bgCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    bgCtx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.opacity})`;
    bgCtx.fill();
    bgCtx.shadowBlur = 10;
    bgCtx.shadowColor = `hsla(${this.hue}, 100%, 50%, 0.5)`;
  }
}

// Crystal shard class
class Crystal {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * bgCanvas.width;
    this.y = Math.random() * bgCanvas.height;
    this.size = Math.random() * 15 + 5;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.01;
    this.speedY = -Math.random() * 0.3 - 0.1;
    this.opacity = Math.random() * 0.3 + 0.1;
  }
  update() {
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;
    if (this.y < -50) {
      this.y = bgCanvas.height + 50;
      this.x = Math.random() * bgCanvas.width;
    }
  }
  draw() {
    bgCtx.save();
    bgCtx.translate(this.x, this.y);
    bgCtx.rotate(this.rotation);
    bgCtx.beginPath();
    bgCtx.moveTo(0, -this.size);
    bgCtx.lineTo(this.size * 0.6, 0);
    bgCtx.lineTo(0, this.size);
    bgCtx.lineTo(-this.size * 0.6, 0);
    bgCtx.closePath();
    bgCtx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
    bgCtx.fill();
    bgCtx.strokeStyle = `rgba(0, 212, 255, ${this.opacity * 1.5})`;
    bgCtx.lineWidth = 1;
    bgCtx.stroke();
    bgCtx.restore();
  }
}

// Star class
class Star {
  constructor() {
    this.x = Math.random() * bgCanvas.width;
    this.y = Math.random() * bgCanvas.height;
    this.size = Math.random() * 2;
    this.opacity = Math.random();
    this.twinkleSpeed = Math.random() * 0.02 + 0.005;
  }
  update() {
    this.opacity += this.twinkleSpeed;
    if (this.opacity > 1 || this.opacity < 0.2) {
      this.twinkleSpeed = -this.twinkleSpeed;
    }
  }
  draw() {
    bgCtx.beginPath();
    bgCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    bgCtx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    bgCtx.fill();
  }
}

// Aurora wave
class AuroraWave {
  constructor(offset) {
    this.offset = offset;
    this.time = 0;
  }
  update() {
    this.time += 0.005;
  }
  draw() {
    bgCtx.beginPath();
    for (let x = 0; x < bgCanvas.width; x += 5) {
      const y = bgCanvas.height * 0.3 + 
                Math.sin(x * 0.003 + this.time + this.offset) * 80 +
                Math.sin(x * 0.007 + this.time * 1.5) * 40;
      if (x === 0) bgCtx.moveTo(x, y);
      else bgCtx.lineTo(x, y);
    }
    bgCtx.lineTo(bgCanvas.width, bgCanvas.height);
    bgCtx.lineTo(0, bgCanvas.height);
    bgCtx.closePath();
    const gradient = bgCtx.createLinearGradient(0, 0, 0, bgCanvas.height);
    gradient.addColorStop(0, 'rgba(0, 212, 255, 0)');
    gradient.addColorStop(0.3, `rgba(0, 212, 255, ${0.03 + this.offset * 0.01})`);
    gradient.addColorStop(0.5, `rgba(157, 78, 221, ${0.02 + this.offset * 0.01})`);
    gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
    bgCtx.fillStyle = gradient;
    bgCtx.fill();
  }
}

// Initialize background elements
function initBackground() {
  particles = [];
  crystals = [];
  stars = [];
  auroraWaves = [];

  for (let i = 0; i < 80; i++) particles.push(new Particle());
  for (let i = 0; i < 20; i++) crystals.push(new Crystal());
  for (let i = 0; i < 150; i++) stars.push(new Star());
  for (let i = 0; i < 3; i++) auroraWaves.push(new AuroraWave(i));
}

function animateBackground() {
  bgCtx.fillStyle = 'rgba(5, 5, 16, 0.15)';
  bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

  stars.forEach(star => { star.update(); star.draw(); });
  auroraWaves.forEach(wave => { wave.update(); wave.draw(); });
  particles.forEach(p => { p.update(); p.draw(); });
  crystals.forEach(c => { c.update(); c.draw(); });

  requestAnimationFrame(animateBackground);
}

initBackground();
animateBackground();

// ===== PARTICLE OVERLAY FOR EFFECTS =====
const particleCanvas = document.getElementById('particle-overlay');
const particleCtx = particleCanvas.getContext('2d');
let effectParticles = [];

function resizeParticleCanvas() {
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
}
resizeParticleCanvas();
window.addEventListener('resize', resizeParticleCanvas);

class EffectParticle {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.life = 1;
    this.decay = Math.random() * 0.01 + 0.005;

    if (type === 'confetti') {
      this.vx = (Math.random() - 0.5) * 10;
      this.vy = Math.random() * -10 - 5;
      this.gravity = 0.2;
      this.size = Math.random() * 8 + 4;
      this.color = ['#00d4ff', '#9d4edd', '#00f5d4', '#ffd700', '#ff006e'][Math.floor(Math.random() * 5)];
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.2;
    } else if (type === 'explosion') {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 15 + 5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.gravity = 0.1;
      this.size = Math.random() * 6 + 2;
      this.color = `hsl(${Math.random() * 60 + 180}, 100%, 70%)`;
    } else if (type === 'heart') {
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = -Math.random() * 3 - 1;
      this.gravity = 0.02;
      this.size = Math.random() * 20 + 10;
      this.color = '#ff006e';
    }
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.life -= this.decay;
    if (this.type === 'confetti') {
      this.rotation += this.rotationSpeed;
    }
  }
  draw() {
    particleCtx.save();
    particleCtx.globalAlpha = this.life;
    particleCtx.translate(this.x, this.y);

    if (this.type === 'confetti') {
      particleCtx.rotate(this.rotation);
      particleCtx.fillStyle = this.color;
      particleCtx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
    } else if (this.type === 'heart') {
      particleCtx.fillStyle = this.color;
      particleCtx.font = `${this.size}px Arial`;
      particleCtx.fillText('❤️', -this.size/2, 0);
    } else {
      particleCtx.beginPath();
      particleCtx.arc(0, 0, this.size, 0, Math.PI * 2);
      particleCtx.fillStyle = this.color;
      particleCtx.shadowBlur = 10;
      particleCtx.shadowColor = this.color;
      particleCtx.fill();
    }
    particleCtx.restore();
  }
}

function spawnParticles(x, y, count, type) {
  for (let i = 0; i < count; i++) {
    effectParticles.push(new EffectParticle(x, y, type));
  }
}

function animateEffects() {
  particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
  effectParticles = effectParticles.filter(p => p.life > 0);
  effectParticles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateEffects);
}
animateEffects();

// ===== CINEMATIC SEQUENCE =====
const sceneDurations = [0, 16000, 6000, 10000, 7000, 7000, 8000, 8000, 18000];

function showScene(num) {
  document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
  const scene = document.getElementById(`scene-0${num}`);
  if (scene) scene.classList.add('active');
  currentScene = num;
}

function nextScene() {
  if (introSkipped) return;
  if (currentScene < totalScenes) {
    showScene(currentScene + 1);
    setTimeout(nextScene, sceneDurations[currentScene]);
  } else {
    endIntro();
  }
}

function endIntro() {
  introSkipped = true;
  const container = document.getElementById('cinematic-container');
  container.style.opacity = '0';
  container.style.pointerEvents = 'none';
  setTimeout(() => {
    container.style.display = 'none';
    document.getElementById('main-website').classList.add('visible');
    startBirthdaySequence();
    showAIAssistant();
  }, 1500);
}

function skipIntro() {
  introSkipped = true;
  endIntro();
}

// Keyboard skip
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !introSkipped) {
    skipIntro();
  }
});

// Start cinematic after 2 seconds
setTimeout(() => {
  if (!introSkipped) {
    showScene(1);
    setTimeout(nextScene, sceneDurations[1]);
  }
}, 2000);

// ===== BIRTHDAY SEQUENCE =====
function startBirthdaySequence() {
  const countdownEl = document.getElementById('countdown');
  const revealEl = document.getElementById('birthday-reveal');
  let count = 15;

  countdownEl.classList.add('active');

  countdownInterval = setInterval(() => {
    countdownEl.textContent = count;
    count--;

    if (count < 0) {
      clearInterval(countdownInterval);
      countdownEl.style.display = 'none';
      blowCandles();

      setTimeout(() => {
        triggerExplosion();
        setTimeout(() => {
          revealEl.classList.add('active');
          spawnConfetti();
        }, 800);
      }, 2500);
    }
  }, 1000);
}

function blowCandles() {
  document.querySelectorAll('.candle').forEach((candle, i) => {
    setTimeout(() => {
      candle.classList.add('out');
      createSmoke(candle);
    }, i * 300);
  });
}

function createSmoke(element) {
  const rect = element.getBoundingClientRect();
  for (let i = 0; i < 5; i++) {
    const smoke = document.createElement('div');
    smoke.className = 'smoke-particle';
    smoke.style.left = rect.left + rect.width/2 + (Math.random() - 0.5) * 20 + 'px';
    smoke.style.top = rect.top + 'px';
    smoke.style.width = Math.random() * 20 + 10 + 'px';
    smoke.style.height = smoke.style.width;
    document.body.appendChild(smoke);
    setTimeout(() => smoke.remove(), 3000);
  }
}

function triggerExplosion() {
  const flash = document.getElementById('explosion-flash');
  flash.classList.add('active');
  setTimeout(() => flash.classList.remove('active'), 500);

  spawnParticles(window.innerWidth/2, window.innerHeight/2, 100, 'explosion');
  spawnParticles(window.innerWidth/2, window.innerHeight/2, 50, 'confetti');
}

function spawnConfetti() {
  const colors = ['#00d4ff', '#9d4edd', '#00f5d4', '#ffd700', '#ff006e', '#fff'];
  for (let i = 0; i < 150; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
    confetti.style.animationDelay = Math.random() * 2 + 's';
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 5000);
  }
}

// Add confetti fall animation dynamically
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
  @keyframes confettiFall {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
`;
document.head.appendChild(confettiStyle);

// ===== HERO PARALLAX =====
const heroContent = document.getElementById('hero-content');
document.addEventListener('mousemove', (e) => {
  if (!heroContent) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  heroContent.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
});

// ===== CHAT SYSTEM =====
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const typingIndicator = document.getElementById('typing-indicator');

const blessingResponses = [
  "✨ Your blessing has been received by the Crystal Palace!",
  "🐉 The Dragon acknowledges your wishes!",
  "👑 A royal blessing for the Legend!",
  "💎 Your message shines like crystal!",
  "🔥 The legend grows stronger with your wishes!"
];

function handleChatKey(e) {
  if (e.key === 'Enter') sendMessage();
}

function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  addMessage(text, 'outgoing', 'You');
  chatInput.value = '';

  // Show typing
  typingIndicator.classList.add('active');

  setTimeout(() => {
    typingIndicator.classList.remove('active');
    const response = blessingResponses[Math.floor(Math.random() * blessingResponses.length)];
    addMessage(response, 'incoming', 'LOMINGFI');
    spawnHeartParticles();
  }, 1500);
}

function addMessage(text, type, author) {
  const msg = document.createElement('div');
  msg.className = `message message-${type}`;
  msg.innerHTML = `
    <div class="message-author">${author}</div>
    <div>${escapeHtml(text)}</div>
    <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
    <div class="reaction-bar">
      <button class="reaction-btn" onclick="addReaction(this)">❤️</button>
      <button class="reaction-btn" onclick="addReaction(this)">🔥</button>
      <button class="reaction-btn" onclick="addReaction(this)">🎉</button>
      <button class="reaction-btn" onclick="addReaction(this)">👑</button>
    </div>
  `;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function addReaction(btn) {
  btn.style.transform = 'scale(1.4)';
  setTimeout(() => btn.style.transform = 'scale(1)', 200);
  spawnHeartParticles();
}

function spawnHeartParticles() {
  const rect = chatMessages.getBoundingClientRect();
  spawnParticles(rect.left + rect.width/2, rect.top + rect.height/2, 10, 'heart');
}

// ===== MYSTERY GIFT =====
const giftMessages = [
  "🎁 A legendary sword forged from starlight awaits you, LOMINGFI. May it cut through all obstacles in your path!",
  "💎 You have found the Crystal of Eternal Wisdom. Your legend shall never be forgotten.",
  "🐉 The Dragon's Blessing: 'May your flames burn brighter than any star in the cosmos.'",
  "👑 The Crown of Legends fits only you, Ahmed. Rule your year with pride and power!",
  "✨ A thousand crystal shards form a constellation in your name. The universe remembers its heroes.",
  "🔮 The Oracle speaks: 'This year brings power beyond imagination. The legend continues.'",
  "⚡ Thunder and lightning bow to your will. Charge forward, unstoppable force!",
  "🌟 From the depths of the Crystal Palace: 'Happy Birthday to the one who makes legends look small.'"
];

let giftOpened = false;

function openGift() {
  if (giftOpened) return;
  giftOpened = true;

  const box = document.getElementById('gift-box');
  const msg = document.getElementById('gift-message');
  const text = document.getElementById('gift-text');

  box.style.transform = 'scale(1.2) rotateY(360deg)';
  box.style.transition = 'transform 0.8s';

  setTimeout(() => {
    spawnParticles(window.innerWidth/2, window.innerHeight/2, 30, 'confetti');
    text.textContent = giftMessages[Math.floor(Math.random() * giftMessages.length)];
    msg.classList.add('active');
    showAchievement('🎁', 'Mystery Unlocked!', 'You opened the Legendary Crystal Box!');
  }, 600);
}

// ===== DRAGON MODE =====
function toggleDragonMode() {
  dragonMode = !dragonMode;
  const toggle = document.getElementById('dragon-toggle');
  const silhouette = document.getElementById('dragon-silhouette');
  const status = document.getElementById('dragon-status');

  toggle.classList.toggle('active');
  silhouette.classList.toggle('active');
  document.body.classList.toggle('dragon-active');

  if (dragonMode) {
    status.textContent = 'DRAGON MODE: ACTIVE 🔥';
    status.style.color = 'var(--dragon-red)';
    showAchievement('🐉', 'Dragon Unleashed!', 'The ancient power flows through the palace!');

    // Change background particles to red
    particles.forEach(p => { p.hue = Math.random() > 0.5 ? 340 : 220; });
  } else {
    status.textContent = 'DRAGON MODE: OFFLINE';
    status.style.color = 'var(--crystal-blue)';
    particles.forEach(p => { p.hue = Math.random() > 0.5 ? 190 : 270; });
  }
}

// ===== TIMELINE SCROLL ANIMATION =====
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.3 });

timelineItems.forEach(item => timelineObserver.observe(item));

// ===== MINI GAMES =====
function showAchievement(icon, title, desc) {
  const ach = document.getElementById('achievement');
  document.getElementById('achievement-icon').textContent = icon;
  document.getElementById('achievement-title').textContent = title;
  document.getElementById('achievement-desc').textContent = desc;
  ach.classList.add('active');
  setTimeout(() => ach.classList.remove('active'), 3000);
}

// Crystal Catch Game
function startCrystalCatch() {
  const canvas = document.getElementById('crystal-game');
  canvas.classList.add('active');
  canvas.innerHTML = '';

  const gameCanvas = document.createElement('canvas');
  gameCanvas.width = canvas.offsetWidth;
  gameCanvas.height = 300;
  canvas.appendChild(gameCanvas);
  const ctx = gameCanvas.getContext('2d');

  let score = 0;
  let timeLeft = 15;
  let gameCrystals = [];
  let mouseX = gameCanvas.width / 2;

  gameCanvas.addEventListener('mousemove', (e) => {
    const rect = gameCanvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
  });

  function spawnGameCrystal() {
    gameCrystals.push({
      x: Math.random() * gameCanvas.width,
      y: -20,
      size: 15,
      speed: Math.random() * 3 + 2
    });
  }

  const gameInterval = setInterval(() => {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Draw catcher
    ctx.fillStyle = 'rgba(0, 212, 255, 0.5)';
    ctx.fillRect(mouseX - 30, gameCanvas.height - 20, 60, 10);

    // Spawn crystals
    if (Math.random() < 0.1) spawnGameCrystal();

    // Update crystals
    gameCrystals = gameCrystals.filter(c => {
      c.y += c.speed;

      // Draw crystal
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.beginPath();
      ctx.moveTo(0, -c.size);
      ctx.lineTo(c.size * 0.6, 0);
      ctx.lineTo(0, c.size);
      ctx.lineTo(-c.size * 0.6, 0);
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 212, 255, 0.8)';
      ctx.fill();
      ctx.restore();

      // Check collision
      if (c.y > gameCanvas.height - 30 && c.y < gameCanvas.height - 10 &&
          c.x > mouseX - 40 && c.x < mouseX + 40) {
        score++;
        return false;
      }

      return c.y < gameCanvas.height + 20;
    });

    // Draw score
    ctx.fillStyle = '#fff';
    ctx.font = '20px Orbitron';
    ctx.fillText(`Crystals: ${score}`, 10, 30);
    ctx.fillText(`Time: ${timeLeft}`, gameCanvas.width - 100, 30);
  }, 1000/60);

  const timerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(gameInterval);
      clearInterval(timerInterval);
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = '30px Orbitron';
      ctx.textAlign = 'center';
      ctx.fillText(`Game Over! Score: ${score}`, gameCanvas.width/2, gameCanvas.height/2);
      ctx.textAlign = 'left';

      if (score >= 10) {
        showAchievement('💎', 'Crystal Master!', `You caught ${score} crystals!`);
      }
    }
  }, 1000);
}

// Find the Dragon Game
function startFindDragon() {
  const canvas = document.getElementById('dragon-game');
  canvas.classList.add('active');
  canvas.innerHTML = '';

  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(5, 1fr)';
  grid.style.gap = '10px';
  grid.style.padding = '20px';
  canvas.appendChild(grid);

  let found = false;
  let attempts = 0;
  const dragonIndex = Math.floor(Math.random() * 25);

  for (let i = 0; i < 25; i++) {
    const cell = document.createElement('div');
    cell.style.width = '100%';
    cell.style.aspectRatio = '1';
    cell.style.background = 'rgba(0,212,255,0.1)';
    cell.style.border = '1px solid rgba(0,212,255,0.3)';
    cell.style.borderRadius = '10px';
    cell.style.cursor = 'pointer';
    cell.style.display = 'flex';
    cell.style.alignItems = 'center';
    cell.style.justifyContent = 'center';
    cell.style.fontSize = '1.5rem';
    cell.style.transition = 'all 0.3s';
    cell.textContent = '✨';

    cell.addEventListener('click', () => {
      if (found) return;
      attempts++;

      if (i === dragonIndex) {
        found = true;
        cell.textContent = '🐉';
        cell.style.background = 'rgba(255,0,110,0.3)';
        cell.style.borderColor = '#ff006e';
        cell.style.transform = 'scale(1.2)';
        showAchievement('🐉', 'Dragon Found!', `You found the dragon in ${attempts} attempts!`);
      } else {
        cell.textContent = '💨';
        cell.style.background = 'rgba(255,255,255,0.05)';
        cell.style.pointerEvents = 'none';
      }
    });

    grid.appendChild(cell);
  }
}

// Crown Click Game
function startCrownClick() {
  const canvas = document.getElementById('crown-game');
  canvas.classList.add('active');
  canvas.innerHTML = '';

  const gameArea = document.createElement('div');
  gameArea.style.position = 'relative';
  gameArea.style.width = '100%';
  gameArea.style.height = '300px';
  gameArea.style.overflow = 'hidden';
  canvas.appendChild(gameArea);

  let score = 0;
  let timeLeft = 10;
  let crown = null;

  function spawnCrown() {
    if (crown) crown.remove();
    crown = document.createElement('div');
    crown.textContent = '👑';
    crown.style.position = 'absolute';
    crown.style.fontSize = '3rem';
    crown.style.cursor = 'pointer';
    crown.style.transition = 'transform 0.1s';
    crown.style.left = Math.random() * (gameArea.offsetWidth - 50) + 'px';
    crown.style.top = Math.random() * (gameArea.offsetHeight - 50) + 'px';

    crown.addEventListener('click', () => {
      score++;
      crown.style.transform = 'scale(1.5)';
      setTimeout(() => spawnCrown(), 100);
    });

    gameArea.appendChild(crown);
  }

  spawnCrown();

  const timer = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(timer);
      if (crown) crown.remove();
      gameArea.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-family:Orbitron;font-size:1.5rem;color:#fff;">Score: ${score}</div>`;

      if (score >= 8) {
        showAchievement('👑', 'Royal Clicker!', `You clicked the crown ${score} times!`);
      }
    }
  }, 1000);
}

// Energy Collect Game
function startEnergyCollect() {
  const canvas = document.getElementById('energy-game');
  canvas.classList.add('active');
  canvas.innerHTML = '';

  const gameCanvas = document.createElement('canvas');
  gameCanvas.width = canvas.offsetWidth;
  gameCanvas.height = 300;
  canvas.appendChild(gameCanvas);
  const ctx = gameCanvas.getContext('2d');

  let score = 0;
  let timeLeft = 20;
  let orbs = [];
  let player = { x: gameCanvas.width/2, y: gameCanvas.height/2, size: 15 };

  const keys = {};
  window.addEventListener('keydown', (e) => keys[e.key] = true);
  window.addEventListener('keyup', (e) => keys[e.key] = false);

  function spawnOrb() {
    orbs.push({
      x: Math.random() * (gameCanvas.width - 30) + 15,
      y: Math.random() * (gameCanvas.height - 30) + 15,
      size: 10,
      hue: Math.random() * 60 + 180
    });
  }

  for (let i = 0; i < 5; i++) spawnOrb();

  const gameInterval = setInterval(() => {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Move player
    if (keys['ArrowUp'] || keys['w']) player.y -= 4;
    if (keys['ArrowDown'] || keys['s']) player.y += 4;
    if (keys['ArrowLeft'] || keys['a']) player.x -= 4;
    if (keys['ArrowRight'] || keys['d']) player.x += 4;

    player.x = Math.max(player.size, Math.min(gameCanvas.width - player.size, player.x));
    player.y = Math.max(player.size, Math.min(gameCanvas.height - player.size, player.y));

    // Draw player
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 212, 255, 0.8)';
    ctx.fill();
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw orbs
    orbs = orbs.filter(orb => {
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${orb.hue}, 100%, 70%, 0.8)`;
      ctx.fill();
      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsla(${orb.hue}, 100%, 50%, 0.5)`;

      const dist = Math.hypot(player.x - orb.x, player.y - orb.y);
      if (dist < player.size + orb.size) {
        score++;
        spawnOrb();
        return false;
      }
      return true;
    });

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff';
    ctx.font = '16px Orbitron';
    ctx.fillText(`Energy: ${score}`, 10, 25);
    ctx.fillText(`Time: ${timeLeft}`, gameCanvas.width - 100, 25);

    // Controls hint
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '12px Inter';
    ctx.fillText('Use WASD or Arrow Keys to move', 10, gameCanvas.height - 10);
  }, 1000/60);

  const timerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(gameInterval);
      clearInterval(timerInterval);
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = '24px Orbitron';
      ctx.textAlign = 'center';
      ctx.fillText(`Energy Collected: ${score}`, gameCanvas.width/2, gameCanvas.height/2);
      ctx.textAlign = 'left';

      if (score >= 15) {
        showAchievement('⚡', 'Energy Master!', `You collected ${score} energy orbs!`);
      }
    }
  }, 1000);
}

// ===== TERMINAL / SEARCH SYSTEM =====
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const searchResults = document.getElementById('search-results');

const commands = {
  'help': 'Available commands: home, birthday, chat, gifts, timeline, games, dragon, about',
  'home': 'Navigating to Home...',
  'birthday': 'Navigating to Birthday Celebration...',
  'chat': 'Opening Birthday Messages...',
  'gifts': 'Opening Legendary Gifts...',
  'timeline': 'Loading Memory Timeline...',
  'games': 'Launching Playground...',
  'dragon': 'Toggling Dragon Mode...',
  'about': 'LOMINGFI — The Legend of Dragon Raja. Created for Ahmed.',
  'clear': 'CLEAR'
};

const sectionMap = {
  'home': 'hero',
  'birthday': 'birthday',
  'chat': 'chat',
  'gifts': 'gifts',
  'timeline': 'timeline',
  'games': 'games',
  'dragon': 'dragon'
};

function handleTerminalKey(e) {
  if (e.key === 'Enter') {
    const cmd = terminalInput.value.trim().toLowerCase();
    terminalInput.value = '';

    const line = document.createElement('div');
    line.innerHTML = `<span style="color:var(--violet)">lomingfi@palace:~$</span> ${escapeHtml(cmd)}`;
    terminalOutput.appendChild(line);

    if (cmd === 'clear') {
      terminalOutput.innerHTML = '';
      return;
    }

    if (commands[cmd]) {
      const response = document.createElement('div');
      response.textContent = commands[cmd];
      response.style.color = 'var(--cyan)';
      terminalOutput.appendChild(response);

      if (sectionMap[cmd]) {
        setTimeout(() => {
          document.getElementById(sectionMap[cmd]).scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }

      if (cmd === 'dragon') {
        toggleDragonMode();
      }
    } else {
      // Search mode
      const results = Object.keys(commands).filter(k => k.includes(cmd) || commands[k].toLowerCase().includes(cmd));
      if (results.length > 0) {
        searchResults.innerHTML = results.map(r => 
          `<div class="search-result-item" onclick="navigateTo('${r}')">${commands[r]}</div>`
        ).join('');
        searchResults.classList.add('active');
      } else {
        const error = document.createElement('div');
        error.textContent = `Command not found: ${cmd}. Type 'help' for available commands.`;
        error.style.color = '#ff5f56';
        terminalOutput.appendChild(error);
        searchResults.classList.remove('active');
      }
    }

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }
}

function navigateTo(cmd) {
  if (sectionMap[cmd]) {
    document.getElementById(sectionMap[cmd]).scrollIntoView({ behavior: 'smooth' });
  }
  searchResults.classList.remove('active');
}

// ===== MUSIC VISUALIZER =====
let visualizerInterval = null;

function toggleMusic() {
  musicPlaying = !musicPlaying;
  const btn = document.getElementById('play-btn');
  btn.textContent = musicPlaying ? '⏸' : '▶';

  if (musicPlaying) {
    visualizerInterval = setInterval(() => {
      document.querySelectorAll('.viz-bar').forEach(bar => {
        bar.style.height = Math.random() * 30 + 5 + 'px';
      });
    }, 100);
  } else {
    clearInterval(visualizerInterval);
    document.querySelectorAll('.viz-bar').forEach(bar => {
      bar.style.height = '5px';
    });
  }
}

function setVolume(val) {
  // Volume control visual feedback
  const bars = document.querySelectorAll('.viz-bar');
  bars.forEach(bar => {
    bar.style.opacity = val / 100;
  });
}

// ===== AI ASSISTANT =====
const aiMessages = [
  "Welcome, LOMINGFI.",
  "Tonight...",
  "This world belongs to you."
];

function showAIAssistant() {
  const assistant = document.getElementById('ai-assistant');
  const textContainer = document.getElementById('ai-text');

  setTimeout(() => {
    assistant.classList.add('active');

    aiMessages.forEach((msg, i) => {
      setTimeout(() => {
        const span = document.createElement('span');
        span.textContent = msg;
        span.style.animationDelay = '0s';
        textContainer.appendChild(span);
      }, i * 2000);
    });

    setTimeout(() => {
      assistant.classList.remove('active');
    }, 8000);
  }, 3000);
}

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ===== SCROLL REVEAL FOR SECTIONS =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(40px)';
  section.style.transition = 'all 0.8s ease';
  revealObserver.observe(section);
});

// ===== MOUSE GLOW EFFECT =====
document.addEventListener('mousemove', (e) => {
  const cursor = document.querySelector('.cursor-glow');
  if (!cursor) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0,212,255,0.08), transparent 70%);
      pointer-events: none;
      z-index: 9990;
      transform: translate(-50%, -50%);
      transition: left 0.1s, top 0.1s;
    `;
    document.body.appendChild(glow);
  }
  const glow = document.querySelector('.cursor-glow');
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

// ===== INITIAL WELCOME MESSAGE IN CHAT =====
setTimeout(() => {
  if (!introSkipped) return;
  const messages = [
    { text: "🎉 The Crystal Palace is now open for celebration!", author: "System", delay: 1000 },
    { text: "✨ Send your blessings to the Legend!", author: "System", delay: 3000 },
    { text: "🐉 The dragon watches over this sacred day...", author: "Oracle", delay: 6000 }
  ];

  messages.forEach(m => {
    setTimeout(() => addMessage(m.text, 'incoming', m.author), m.delay);
  });
}, 10000);

console.log('%c🔮 LOMINGFI — The Legend of Dragon Raja', 'color: #00d4ff; font-size: 20px; font-family: Orbitron;');
console.log('%c✨ Crystal Palace Birthday System Initialized', 'color: #9d4edd; font-size: 14px;');
