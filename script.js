/**
 * RAIVEN.EXE — FAITHFUL CONCEPT INTERACTION SCRIPT
 * Implements pure concept image features with Web Audio SFX and responsive retro behavior.
 */

// ============================================================
// 1. RETRO WEB AUDIO SOUND SYNTHESIZER
// ============================================================
class RetroSoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    try {
      const saved = localStorage.getItem('raiven_sfx');
      this.enabled = saved !== 'false';
    } catch (e) {}
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    try {
      localStorage.setItem('raiven_sfx', String(this.enabled));
    } catch (e) {}
    return this.enabled;
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  playBlip() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(880, now + 0.05);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  playCoffee() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(640, now + 0.15);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  playBonk() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  playError() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.setValueAtTime(120, now + 0.1);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }
}

const sfx = new RetroSoundEngine();

// ============================================================
// 2. RETRO CHIPTUNE / LO-FI SYNTHESIZER
// ============================================================
class RetroMusicSynth {
  constructor() {
    this.isPlaying = false;
    this.track = 'lofi'; // 'lofi' | 'chaotic'
    this.timer = null;
    this.step = 0;
  }

  toggle(trackName) {
    if (trackName && trackName !== this.track) {
      this.track = trackName;
      if (!this.isPlaying) this.start();
      return true;
    }
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  start() {
    this.isPlaying = true;
    sfx.init();
    this.playStep();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  playStep() {
    if (!this.isPlaying || !sfx.enabled || !sfx.ctx) {
      if (this.isPlaying) {
        this.timer = setTimeout(() => this.playStep(), 300);
      }
      return;
    }

    const ctx = sfx.ctx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (this.track === 'lofi') {
      // Gentle lo-fi pentatonic arpeggio chords
      const notes = [220, 261.63, 293.66, 329.63, 392.00, 440, 523.25, 440];
      const freq = notes[this.step % notes.length];
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
      this.step++;
      this.timer = setTimeout(() => this.playStep(), 320);
    } else {
      // Chaotic chiptune arcade melody
      const chaoticNotes = [330, 493.88, 587.33, 659.25, 880, 587.33, 783.99, 987.77];
      const freq = chaoticNotes[this.step % chaoticNotes.length];
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
      this.step++;
      this.timer = setTimeout(() => this.playStep(), 150);
    }
  }
}

const music = new RetroMusicSynth();

// ============================================================
// 3. APPLICATION STATE & DATA
// ============================================================
const THOUGHTS = [
  "If a tree falls in a forest and no one hears it... does it still give up on its dreams?",
  "Why do we press harder on the remote control when the batteries are almost dead?",
  "What if sleep is our natural state, and being awake is just a temporary glitch?",
  "My brain has 47 tabs open, 4 of them are frozen and where is that music coming from?",
  "Nothing is really lost until your mom can't find it.",
  "Is the s in 'scent' silent or is the c silent?",
  "I am not lazy, I am just in ambient energy conservation mode.",
  "If 24/7 stores are always open, why are there locks on the front doors?"
];

const PIXEL_QUOTES = [
  '"I need a 12-hour nap."',
  '"I have 0 motivation units left."',
  '"Did someone say coffee?"',
  '"Why are you still clicking me?"',
  '"My brain is running on 3% battery."',
  '"Pls don\'t close my window."'
];

const SILLY_QUOTES = [
  '"Cereal is just cold soup."',
  '"Water isn\'t wet, but it makes things wet."',
  '"If I sleep 8 hours tomorrow and 8 hours today, that\'s 16 hours of victory."',
  '"I forgot what I was thinking about 3 seconds ago."',
  '"404: Brain cells not responding."'
];

// Tiered coffee messages that cycle as the energy level increases
const ENERGY_MESSAGES = {
  red: [
    '"Brain running on 3% emergency battery. Barely awake..."',
    '"Current brain status: Loading... please wait."',
    '"Coffee level critically low. System alert in progress."',
    '"Did someone lower my graphics settings? Everything is blurry."',
    '"I am 98% asleep and 2% coffee right now."',
    '"Low battery warning beep sounds in head repeatedly."'
  ],
  yellow: [
    '"First sips absorbed! Neurons tentatively firing signals."',
    '"Caffeine detected in bloodstream. Blink rate returning to normal."',
    '"Entering semi-functional human mode. Might write some code."',
    '"Warm coffee warmth spreading through the internal circuitry."',
    '"Decent vibe acquired. Starting to understand spoken words."',
    '"Tabs open: 47. Brain capacity: 55%. Proceeding with caution."',
    '"Motivation detected: \'Okay, fine, I\'ll actually do it.\'"'
  ],
  green: [
    '"Optimal operating energy achieved! Ready to conquer the world."',
    '"Caffeine peak engaged! Ideas flowing at 120 FPS."',
    '"Feeling unstoppable. Might clean my room or reorganize tabs."',
    '"Pure focus mode unlocked. Music sounds 10x better."',
    '"System running at peak performance. Sleep is just a rumor."',
    '"Can solve complex problems with one eye closed."'
  ],
  max: [
    '"MAX OVERDRIVE: Can perceive the passage of time in 4K!"',
    '"ENERGY OVERFLOW! Seeing the code matrix in the wallpaper!"',
    '"Ultra Caffeine Zen Mode permanently unlocked! ☕⚡"'
  ]
};

let thoughtIndex = 0;
let pressCount = 0;
let energyLevel = 3;
let isEnergyAnimating = false;

// Escalating special messages for the Do Not Press button
const DO_NOT_PRESS_MESSAGES = {
  0: '"Do NOT press it. Seriously."',
  1: '"I literally said DO NOT PRESS."',
  2: '"Why did you click it again? Did you expect a prize?"',
  3: '"Stop it. Nothing is going to happen."',
  4: '"Your curiosity is going to crash this OS."',
  5: '"Warning: Excessive curiosity detected."',
  6: '"A random kitten somewhere just sighed."',
  7: '"Do you also touch wet paint when the sign says \'WET PAINT\'?"',
  8: '"You are wasting precious finger calories."',
  9: '"Okay, seriously, what is your endgame here?"',
  10: '"🏆 Achievement Unlocked: Chronic Button Pusher."',
  11: '"This button does nothing. You know that, right?"',
  12: '"The FBI has been notified of your unauthorized clicks."',
  13: '"13 clicks? You just cursed this browser tab."',
  14: '"Searching for consequences... 0 consequences found."',
  15: '"Are you testing my patience or your mouse sensor?"',
  16: '"Please step away from the big red button."',
  17: '"Go drink some coffee instead. It\'s right above me."',
  18: '"If you keep clicking, I might start charging rent."',
  19: '"My CPU temperature just went up by 0.001°C out of sheer annoyance."',
  20: '"🎉 Milestone: 20 clicks of pure defiance."',
  21: '"Still clicking? Your dedication to disobedience is scary."',
  22: '"System log: User refuses to follow simple instructions."',
  23: '"You are breaking the first rule of Computer Club."',
  24: '"Does this look like a fidget toy to you?"',
  25: '"Quarter-century mark! 25 clicks and zero regrets."',
  30: '"Self-destruct sequence initiated in 99,999 seconds..."',
  35: '"The red button is tired. Let it sleep."',
  40: '"You really thought a secret door would open, huh?"',
  47: '"47 clicks: You have officially reached the concept art number! 🎨"',
  50: '"🔥 Level 50 Rebel: Chaos incarnate."',
  60: '"60 clicks... Have you considered taking up gardening?"',
  69: '"Nice. Now please stop."',
  75: '"Are you macro-clicking or just exceptionally bored?"',
  100: '"💯 100 CLICKS! You win! Your reward is... profound disappointment. 🎁"'
};

const DO_NOT_PRESS_FALLBACKS = [
  '"Still nothing. Still stubbornly clicking."',
  '"Button integrity: severely compromised."',
  '"Pressing it again won\'t make it love you back."',
  '"Your defiance score has broken all recorded records."',
  '"Look at all that free time you have."',
  '"Zero prizes awarded. Just you and a red rectangle."',
  '"The button is questioning its life choices."',
  '"Okay, you win the endurance round. Now what?"'
];

// ============================================================
// 4. MAIN SETUP & DOM BINDINGS
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  // A. Theme Setup (Midnight vs Heatwave)
  const btnMidnight = document.getElementById('btn-vibe-midnight');
  const btnHeatwave = document.getElementById('btn-vibe-heatwave');
  const sysTitle = document.getElementById('sys-title-text');

  function setTheme(theme) {
    if (theme === 'heatwave') {
      document.body.className = 'theme-heatwave';
      document.documentElement.setAttribute('data-theme', 'heatwave');
      btnHeatwave.classList.add('active');
      btnMidnight.classList.remove('active');
      if (sysTitle) sysTitle.textContent = "Raiven's.exe";
      localStorage.setItem('raiven_theme', 'heatwave');
    } else {
      document.body.className = 'theme-midnight';
      document.documentElement.setAttribute('data-theme', 'midnight');
      btnMidnight.classList.add('active');
      btnHeatwave.classList.remove('active');
      if (sysTitle) sysTitle.textContent = "Raiven.exe";
      localStorage.setItem('raiven_theme', 'midnight');
    }
  }

  const savedTheme = localStorage.getItem('raiven_theme') || 'midnight';
  setTheme(savedTheme);

  if (btnMidnight) {
    btnMidnight.addEventListener('click', () => {
      sfx.playClick();
      setTheme('midnight');
    });
  }

  if (btnHeatwave) {
    btnHeatwave.addEventListener('click', () => {
      sfx.playClick();
      setTheme('heatwave');
    });
  }

  // B. SFX Toggle
  const btnSfx = document.getElementById('btn-sfx-toggle');
  const sfxStatus = document.getElementById('sfx-status-text');
  if (btnSfx && sfxStatus) {
    sfxStatus.textContent = sfx.enabled ? 'ON' : 'OFF';
    btnSfx.addEventListener('click', () => {
      const active = sfx.toggle();
      sfxStatus.textContent = active ? 'ON' : 'OFF';
      if (active) sfx.playBlip();
    });
  }

  // C. 3 AM Thought Generator
  const thoughtText = document.getElementById('thought-text');
  const btnNextThought = document.getElementById('btn-next-thought');
  if (btnNextThought && thoughtText) {
    btnNextThought.addEventListener('click', () => {
      sfx.playClick();
      thoughtIndex = (thoughtIndex + 1) % THOUGHTS.length;
      thoughtText.textContent = `"${THOUGHTS[thoughtIndex]}"`;
    });
  }

  // D. Energy Level & Coffee Mug Button
  const btnCoffeeMug = document.getElementById('btn-coffee-mug');
  const batteryFill = document.getElementById('battery-fill');
  const batteryLabel = document.getElementById('battery-label');
  const energyTitle = document.getElementById('energy-title-text');
  const energyStatusMsg = document.getElementById('energy-status-msg');

  // Function to apply colors based on current percentage
  function applyBatteryColor(val) {
    if (!batteryFill || !batteryLabel) return;
    batteryFill.classList.remove('battery-level-red', 'battery-level-yellow', 'battery-level-green');
    batteryLabel.classList.remove('level-red', 'level-yellow', 'level-green');

    if (val < 30) {
      batteryFill.classList.add('battery-level-red');
      batteryLabel.classList.add('level-red');
    } else if (val < 70) {
      batteryFill.classList.add('battery-level-yellow');
      batteryLabel.classList.add('level-yellow');
    } else {
      batteryFill.classList.add('battery-level-green');
      batteryLabel.classList.add('level-green');
    }
  }

  // Function to pick a new message from the current tier
  function updateEnergyMessage(val) {
    if (!energyStatusMsg) return;
    let pool;
    if (val >= 100) {
      pool = ENERGY_MESSAGES.max;
    } else if (val >= 70) {
      pool = ENERGY_MESSAGES.green;
    } else if (val >= 30) {
      pool = ENERGY_MESSAGES.yellow;
    } else {
      pool = ENERGY_MESSAGES.red;
    }
    const randomMsg = pool[Math.floor(Math.random() * pool.length)];

    // Quick subtle pulse on message change
    energyStatusMsg.style.opacity = '0';
    energyStatusMsg.style.transform = 'translateY(2px)';
    setTimeout(() => {
      energyStatusMsg.textContent = randomMsg;
      energyStatusMsg.style.opacity = '1';
      energyStatusMsg.style.transform = 'translateY(0)';
    }, 150);
  }

  // Smooth gradual counter animation from startVal to targetVal
  function animateEnergyIncrease(targetVal) {
    if (isEnergyAnimating) return;
    isEnergyAnimating = true;
    const startVal = energyLevel;
    const startTime = performance.now();
    const duration = 450; // ms for gradual increase

    function frame(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (targetVal - startVal) * eased);

      if (batteryFill) batteryFill.style.width = `${current}%`;
      if (batteryLabel) batteryLabel.textContent = `${current}%`;
      if (energyTitle) energyTitle.textContent = `Energy Level: ${current}%`;
      applyBatteryColor(current);

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        energyLevel = targetVal;
        if (batteryFill) batteryFill.style.width = `${targetVal}%`;
        if (batteryLabel) batteryLabel.textContent = `${targetVal}%`;
        if (energyTitle) energyTitle.textContent = `Energy Level: ${targetVal}%`;
        applyBatteryColor(targetVal);
        updateEnergyMessage(targetVal);
        isEnergyAnimating = false;
      }
    }

    requestAnimationFrame(frame);
  }

  if (btnCoffeeMug) {
    btnCoffeeMug.addEventListener('click', () => {
      sfx.playCoffee();

      // Fun button press shake/steam bounce
      btnCoffeeMug.style.transform = 'scale(0.97)';
      setTimeout(() => {
        btnCoffeeMug.style.transform = '';
      }, 120);

      if (energyLevel >= 100) {
        // If already at 100%, reset back to 3% with a crash message so user can play again!
        sfx.playBonk();
        energyLevel = 3;
        if (batteryFill) batteryFill.style.width = '3%';
        if (batteryLabel) batteryLabel.textContent = '3%';
        if (energyTitle) energyTitle.textContent = 'Energy Level: 3%';
        applyBatteryColor(3);
        if (energyStatusMsg) {
          energyStatusMsg.textContent = '"Caffeine crash! Energy plummeted to 3%. Time to brew another mug!"';
        }
      } else {
        const nextVal = Math.min(100, energyLevel + 10);
        animateEnergyIncrease(nextVal);
      }
    });
  }

  // E. Do Not Press Button
  const btnDoNotPress = document.getElementById('btn-do-not-press');
  const doNotPressCount = document.getElementById('do-not-press-count');
  const doNotPressSubtext = document.getElementById('do-not-press-subtext');
  const doNotPressMsg = document.getElementById('do-not-press-msg');

  if (btnDoNotPress && doNotPressCount) {
    btnDoNotPress.addEventListener('click', () => {
      sfx.playBonk();
      pressCount++;

      // Shake animation on button
      btnDoNotPress.classList.remove('shaking');
      void btnDoNotPress.offsetWidth; // force reflow
      btnDoNotPress.classList.add('shaking');

      // Update counter and pluralization
      doNotPressCount.textContent = pressCount;
      if (doNotPressSubtext) {
        doNotPressSubtext.innerHTML = pressCount === 1
          ? 'You pressed this <span id="do-not-press-count">1</span> time for no reason.'
          : `You pressed this <span id="do-not-press-count">${pressCount}</span> times for no reason.`;
      }

      // Determine special message
      let msg = DO_NOT_PRESS_MESSAGES[pressCount];
      if (!msg) {
        const fallbackIdx = (pressCount) % DO_NOT_PRESS_FALLBACKS.length;
        msg = DO_NOT_PRESS_FALLBACKS[fallbackIdx];
      }

      // Smooth text transition
      if (doNotPressMsg) {
        doNotPressMsg.style.opacity = '0';
        doNotPressMsg.style.transform = 'scale(0.96)';
        setTimeout(() => {
          doNotPressMsg.textContent = msg;
          doNotPressMsg.style.opacity = '1';
          doNotPressMsg.style.transform = 'scale(1)';
        }, 80);
      }
    });
  }

  // F. Motivation Not Found Error Window
  const btnRetry = document.getElementById('btn-motivation-retry');
  const btnIgnore = document.getElementById('btn-motivation-ignore');
  const winMotivation = document.getElementById('win-motivation');

  if (btnRetry) {
    btnRetry.addEventListener('click', () => {
      sfx.playError();
      alert("Searching neural network for motivation...\nResult: 0 motivation units found. Try coffee instead.");
    });
  }

  if (btnIgnore) {
    btnIgnore.addEventListener('click', () => {
      sfx.playClick();
      alert("Procrastination mode permanently engaged.");
    });
  }

  // G. Music Player (Lo-Fi / Chaotic)
  const btnLofi = document.getElementById('btn-track-lofi');
  const btnChaotic = document.getElementById('btn-track-chaotic');
  const btnMusicToggle = document.getElementById('btn-music-toggle');
  const trackTitle = document.getElementById('music-track-title');

  function updateMusicUI() {
    if (music.isPlaying) {
      btnMusicToggle.textContent = '⏸ Pause';
    } else {
      btnMusicToggle.textContent = '▶ Play';
    }
    if (music.track === 'lofi') {
      btnLofi.classList.add('active');
      btnChaotic.classList.remove('active');
      trackTitle.textContent = 'Lo-Fi Midnight Vibes';
    } else {
      btnChaotic.classList.add('active');
      btnLofi.classList.remove('active');
      trackTitle.textContent = 'Chaotic 8-Bit Chiptune';
    }
  }

  if (btnMusicToggle) {
    btnMusicToggle.addEventListener('click', () => {
      music.toggle();
      updateMusicUI();
    });
  }

  if (btnLofi) {
    btnLofi.addEventListener('click', () => {
      sfx.playClick();
      music.toggle('lofi');
      updateMusicUI();
    });
  }

  if (btnChaotic) {
    btnChaotic.addEventListener('click', () => {
      sfx.playClick();
      music.toggle('chaotic');
      updateMusicUI();
    });
  }

  // H. Fun Counter (Visit Counter)
  const visitCountDisp = document.getElementById('visit-count');
  if (visitCountDisp) {
    let visits = 1;
    try {
      const stored = parseInt(localStorage.getItem('raiven_visits') || '0', 10);
      visits = stored + 1;
      localStorage.setItem('raiven_visits', String(visits));
    } catch (e) {}
    visitCountDisp.textContent = visits;
  }

  // I. Pixel Character Companion
  const pixelSprite = document.getElementById('pixel-sprite');
  const pixelSpeechText = document.getElementById('pixel-speech-text');
  const optClickMe = document.getElementById('opt-click-me');
  const optSayStupid = document.getElementById('opt-say-stupid');
  const optFallOver = document.getElementById('opt-fall-over');

  let isFallen = false;

  function setPixelQuote(msg) {
    if (pixelSpeechText) {
      pixelSpeechText.textContent = msg;
    }
  }

  if (optClickMe) {
    optClickMe.addEventListener('click', () => {
      sfx.playBlip();
      const quote = PIXEL_QUOTES[Math.floor(Math.random() * PIXEL_QUOTES.length)];
      setPixelQuote(quote);
    });
  }

  if (optSayStupid) {
    optSayStupid.addEventListener('click', () => {
      sfx.playBlip();
      const quote = SILLY_QUOTES[Math.floor(Math.random() * SILLY_QUOTES.length)];
      setPixelQuote(quote);
    });
  }

  if (optFallOver) {
    optFallOver.addEventListener('click', () => {
      if (isFallen) return;
      isFallen = true;
      sfx.playBonk();
      if (pixelSprite) pixelSprite.src = 'assets/character/dead.png';
      setPixelQuote('*bonk* ...I have fallen and I cannot get up.');

      setTimeout(() => {
        if (pixelSprite) pixelSprite.src = 'assets/character/idle.png';
        setPixelQuote('"Okay, I survived."');
        isFallen = false;
      }, 2500);
    });
  }

  if (pixelSprite) {
    pixelSprite.addEventListener('click', () => {
      sfx.playBlip();
      const quote = PIXEL_QUOTES[Math.floor(Math.random() * PIXEL_QUOTES.length)];
      setPixelQuote(quote);
    });
  }

  // J. Interactive Stickers
  const stickers = document.querySelectorAll('.sticker-item');
  stickers.forEach((sticker) => {
    sticker.addEventListener('click', () => {
      sfx.playBlip();
      sticker.style.transform = 'scale(1.3) rotate(8deg)';
      setTimeout(() => {
        sticker.style.transform = '';
      }, 250);
    });
  });

  // K. Quick Links Interactions
  const linkGithub = document.getElementById('link-github-repo');
  const linkAnime = document.getElementById('link-anime-list');
  const linkRandom = document.getElementById('link-random-stuff');
  const linkAbout = document.getElementById('link-about-me');

  if (linkGithub) {
    linkGithub.addEventListener('click', () => {
      sfx.playClick();
      window.open('https://github.com', '_blank');
    });
  }

  if (linkAnime) {
    linkAnime.addEventListener('click', () => {
      sfx.playClick();
      alert("Anime List:\n1. Steins;Gate\n2. Mob Psycho 100\n3. Hunter x Hunter\n4. Gurren Lagann");
    });
  }

  if (linkRandom) {
    linkRandom.addEventListener('click', () => {
      sfx.playClick();
      alert("Random fact: Bananas are technically curved berries.");
    });
  }

  if (linkAbout) {
    linkAbout.addEventListener('click', () => {
      sfx.playClick();
      alert("Raiven:\n15 years old, based in Dhaka, Bangladesh.\nEnjoys anime, lo-fi beats, and coding at 3 AM.");
    });
  }

  // L. Social Pills
  const btnSpotify = document.getElementById('btn-social-spotify');
  const btnYoutube = document.getElementById('btn-social-youtube');
  const btnEmail = document.getElementById('btn-social-email');

  if (btnSpotify) {
    btnSpotify.addEventListener('click', () => {
      sfx.playClick();
      window.open('https://spotify.com', '_blank');
    });
  }
  if (btnYoutube) {
    btnYoutube.addEventListener('click', () => {
      sfx.playClick();
      window.open('https://youtube.com', '_blank');
    });
  }
  if (btnEmail) {
    btnEmail.addEventListener('click', () => {
      sfx.playClick();
      alert("Email: raiven.v.vale@gmail.com");
    });
  }

  // M. Trash Desktop & Taskbar Shortcuts
  const desktopTrash = document.getElementById('desktop-trash');
  const taskbarTrash = document.getElementById('taskbar-trash');
  function handleTrash() {
    sfx.playClick();
    alert("Recycle Bin:\nNothing important here... just discarded sleep schedules and deleted motivation.");
  }
  if (desktopTrash) desktopTrash.addEventListener('click', handleTrash);
  if (taskbarTrash) taskbarTrash.addEventListener('click', handleTrash);

  // N. Start Button
  const btnStart = document.getElementById('btn-start');
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      sfx.playClick();
      alert("RAIVEN OS v0.1.0\nReady for new features.");
    });
  }

  // O. Window Controls (Minimize / Maximize / Close)
  document.querySelectorAll('.win-btn-close').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      sfx.playClick();
      const win = e.target.closest('.retro-window');
      if (win) {
        win.style.display = 'none';
        setTimeout(() => {
          win.style.display = '';
        }, 3000);
      }
    });
  });

  document.querySelectorAll('.win-btn-min').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      sfx.playClick();
      const win = e.target.closest('.retro-window');
      if (win) {
        const body = win.querySelector('.window-body');
        if (body) {
          body.style.display = body.style.display === 'none' ? '' : 'none';
        }
      }
    });
  });

  // P. Real-time Live Clock
  const clockDisp = document.getElementById('taskbar-clock');
  function updateClock() {
    if (!clockDisp) return;
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hoursStr = String(hours).padStart(2, '0');
    clockDisp.textContent = `${hoursStr}:${minutes} ${ampm}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

});
