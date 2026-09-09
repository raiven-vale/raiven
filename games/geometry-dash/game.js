// ============================================================
// GEOMETRY DASH // RAIVEN
// Original browser game engine
// ============================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let W = window.innerWidth;
let H = window.innerHeight;

let currentLevel = 0;
let level = null;

let gameState = "menu";
let cameraX = 0;
let lastTime = 0;

let inputHeld = false;
let inputPressed = false;

let particles = [];
let objects = [];

let unlocked = Number(
    localStorage.getItem("raivenGeometryUnlocked") || 1
);


// ============================================================
// CANVAS
// ============================================================

function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();


// ============================================================
// DOM
// ============================================================

const menu = document.getElementById("menu");
const levelSelect = document.getElementById("levelSelect");
const pauseScreen = document.getElementById("pauseScreen");
const deathScreen = document.getElementById("deathScreen");
const completeScreen = document.getElementById("completeScreen");

const playButton = document.getElementById("playButton");
const levelsButton = document.getElementById("levelsButton");
const backButton = document.getElementById("backButton");

const pauseButton = document.getElementById("pauseButton");
const resumeButton = document.getElementById("resumeButton");
const restartButton = document.getElementById("restartButton");
const pauseMenuButton = document.getElementById("pauseMenuButton");

const tryAgainButton = document.getElementById("tryAgainButton");
const deathMenuButton = document.getElementById("deathMenuButton");

const nextButton = document.getElementById("nextButton");
const completeMenuButton =
    document.getElementById("completeMenuButton");

const levelName = document.getElementById("levelName");
const progress = document.getElementById("progress");
const progressText = document.getElementById("progressText");
const deathProgress = document.getElementById("deathProgress");
const completeName = document.getElementById("completeName");


// ============================================================
// PLAYER
// ============================================================

const player = {

    x: 220,
    y: 0,

    size: 32,

    velocityY: 0,

    gravity: 1,

    jumpPower: -16,

    rotation: 0,

    mode: "cube",

    grounded: false,

    alive: true,

    dual: false,

    secondY: 0,
    secondVelocityY: 0

};


// ============================================================
// LEVEL OBJECT
// ============================================================

function createObject(type, x, y, width = 40, height = 40, extra = {}) {

    return {
        type,
        x,
        y,
        width,
        height,
        ...extra
    };

}


// ============================================================
// LEVEL GENERATION
// ============================================================

function createLevel(levelData) {

    objects = [];

    const groundY = H - 90;

    // --------------------------------------------------------
    // IMPORTANT:
    // Ground extends across the ENTIRE level.
    // --------------------------------------------------------

    objects.push(
        createObject(
            "block",
            -1000,
            groundY,
            levelData.length + 3000,
            1000
        )
    );


    // Decorative floor line

    objects.push(
        createObject(
            "floorLine",
            -1000,
            groundY,
            levelData.length + 3000,
            4
        )
    );


    // --------------------------------------------------------
    // Generate pattern
    // --------------------------------------------------------

    generatePattern(
        levelData.pattern,
        levelData.length,
        groundY
    );


    // --------------------------------------------------------
    // Finish
    // --------------------------------------------------------

    objects.push(
        createObject(
            "finish",
            levelData.length - 450,
            groundY - 300,
            80,
            300
        )
    );

}


// ============================================================
// PATTERN GENERATOR
// ============================================================

function generatePattern(pattern, length, groundY) {

    let x = 650;

    while (x < length - 700) {

        switch (pattern) {

            case "basic":
                basicPattern(x, groundY);
                break;

            case "basic2":
                basicPattern2(x, groundY);
                break;

            case "ball":
                ballPattern(x, groundY);
                break;

            case "spikes":
                spikePattern(x, groundY);
                break;

            case "ship":
                shipPattern(x, groundY);
                break;

            case "dense":
                densePattern(x, groundY);
                break;

            case "ufo":
                ufoPattern(x, groundY);
                break;

            case "gravity":
                gravityPattern(x, groundY);
                break;

            case "dense2":
                dense2Pattern(x, groundY);
                break;

            case "ship2":
                ship2Pattern(x, groundY);
                break;

            case "dual":
                dualPattern(x, groundY);
                break;

            case "robot":
                robotPattern(x, groundY);
                break;

            case "spider":
                spiderPattern(x, groundY);
                break;

            case "redline":
                redlinePattern(x, groundY);
                break;

            case "ship3":
                ship3Pattern(x, groundY);
                break;

            case "dual2":
                dual2Pattern(x, groundY);
                break;

            case "robot2":
                robot2Pattern(x, groundY);
                break;

            case "spider2":
                spider2Pattern(x, groundY);
                break;

            case "insane":
                insanePattern(x, groundY);
                break;

            case "insaneShip":
                insaneShipPattern(x, groundY);
                break;

            case "zero":
                zeroPattern(x, groundY);
                break;

            case "final":
                finalPattern(x, groundY);
                break;

            default:
                basicPattern(x, groundY);
        }

        x += 500;

    }

}


// ============================================================
// BASIC PATTERNS
// ============================================================

function spike(x, groundY, count = 1) {

    for (let i = 0; i < count; i++) {

        objects.push(
            createObject(
                "spike",
                x + i * 34,
                groundY - 34,
                34,
                34
            )
        );

    }

}


function block(x, groundY, width = 60, height = 60) {

    objects.push(
        createObject(
            "block",
            x,
            groundY - height,
            width,
            height
        )
    );

}


function orb(x, y, type = "jump") {

    objects.push(
        createObject(
            "orb",
            x,
            y,
            32,
            32,
            { orbType: type }
        )
    );

}


function pad(x, groundY) {

    objects.push(
        createObject(
            "pad",
            x,
            groundY - 14,
            48,
            14
        )
    );

}


function portal(x, y, mode) {

    objects.push(
        createObject(
            "portal",
            x,
            y,
            50,
            110,
            { mode }
        )
    );

}


function basicPattern(x, groundY) {

    spike(x, groundY, 1);

    if (Math.floor(x / 500) % 2 === 0) {
        spike(x + 170, groundY, 2);
    }

    block(x + 300, groundY, 60, 80);

}


function basicPattern2(x, groundY) {

    spike(x, groundY, 2);

    block(x + 130, groundY, 70, 70);

    spike(x + 270, groundY, 3);

    orb(
        x + 380,
        groundY - 110
    );

}


function ballPattern(x, groundY) {

    portal(
        x,
        groundY - 140,
        "ball"
    );

    spike(x + 100, groundY, 2);

    orb(
        x + 220,
        groundY - 110
    );

    spike(x + 350, groundY, 1);

}


function spikePattern(x, groundY) {

    spike(x, groundY, 3);

    block(x + 150, groundY, 80, 100);

    spike(x + 300, groundY, 3);

    pad(x + 420, groundY);

}


function shipPattern(x, groundY) {

    portal(
        x,
        groundY - 160,
        "ship"
    );

    block(x + 130, groundY, 80, 160);

    block(
        x + 270,
        groundY - 200,
        80,
        200
    );

}


function densePattern(x, groundY) {

    spike(x, groundY, 2);

    spike(x + 100, groundY, 1);

    block(x + 190, groundY, 70, 110);

    spike(x + 310, groundY, 2);

    block(x + 430, groundY, 60, 140);

}


function ufoPattern(x, groundY) {

    portal(
        x,
        groundY - 160,
        "ufo"
    );

    spike(x + 100, groundY, 2);

    orb(
        x + 200,
        groundY - 150
    );

    orb(
        x + 320,
        groundY - 220
    );

}


function gravityPattern(x, groundY) {

    portal(
        x,
        groundY - 160,
        "ball"
    );

    orb(
        x + 130,
        groundY - 120
    );

    orb(
        x + 260,
        groundY - 200
    );

    spike(x + 390, groundY, 2);

}


function dense2Pattern(x, groundY) {

    spike(x, groundY, 3);

    block(x + 130, groundY, 70, 120);

    spike(x + 240, groundY, 2);

    block(
        x + 350,
        groundY,
        80,
        160
    );


}


function ship2Pattern(x, groundY) {

    portal(
        x,
        groundY - 180,
        "ship"
    );

    block(x + 120, groundY, 90, 190);

    block(
        x + 300,
        groundY - 200,
        90,
        200
    );

    orb(
        x + 450,
        groundY - 250
    );

}


function dualPattern(x, groundY) {

    portal(
        x,
        groundY - 160,
        "dual"
    );

    spike(x + 100, groundY, 2);

    block(
        x + 240,
        groundY,
        80,
        120
    );

    spike(
        x + 380,
        groundY,
        3
    );

}


function robotPattern(x, groundY) {

    portal(
        x,
        groundY - 160,
        "robot"
    );

    spike(x + 120, groundY, 2);

    block(
        x + 250,
        groundY,
        100,
        100
    );

    spike(x + 420, groundY, 2);

}


function spiderPattern(x, groundY) {

    portal(
        x,
        groundY - 160,
        "spider"
    );

    block(
        x + 120,
        groundY,
        80,
        130
    );

    block(
        x + 280,
        groundY - 200,
        80,
        200
    );

}


function redlinePattern(x, groundY) {

    spike(x, groundY, 3);

    spike(x + 120, groundY, 3);

    block(
        x + 250,
        groundY,
        100,
        150
    );

    spike(x + 400, groundY, 3);

}


function ship3Pattern(x, groundY) {

    portal(
        x,
        groundY - 170,
        "ship"
    );

    block(
        x + 100,
        groundY,
        90,
        220
    );

    block(
        x + 260,
        groundY - 230,
        90,
        230
    );

    block(
        x + 420,
        groundY,
        80,
        180
    );

}


function dual2Pattern(x, groundY) {

    portal(
        x,
        groundY - 160,
        "dual"
    );

    spike(x + 100, groundY, 3);

    spike(x + 250, groundY, 2);

    block(
        x + 380,
        groundY,
        90,
        150
    );

}


function robot2Pattern(x, groundY) {

    portal(
        x,
        groundY - 160,
        "robot"
    );

    spike(x + 120, groundY, 3);

    pad(x + 250, groundY);

    block(
        x + 340,
        groundY,
        100,
        170
    );

}


function spider2Pattern(x, groundY) {

    portal(
        x,
        groundY - 160,
        "spider"
    );

    block(
        x + 120,
        groundY,
        80,
        160
    );

    block(
        x + 280,
        groundY - 230,
        80,
        230
    );

    spike(
        x + 430,
        groundY,
        2
    );

}


function insanePattern(x, groundY) {

    spike(x, groundY, 3);

    block(
        x + 120,
        groundY,
        70,
        170
    );

    spike(
        x + 230,
        groundY,
        3
    );

    block(
        x + 350,
        groundY - 180,
        70,
        180
    );

    spike(
        x + 450,
        groundY,
        2
    );

}


function insaneShipPattern(x, groundY) {

    portal(
        x,
        groundY - 180,
        "ship"
    );

    block(
        x + 100,
        groundY,
        80,
        240
    );

    block(
        x + 230,
        groundY - 260,
        80,
        260
    );

    block(
        x + 360,
        groundY,
        80,
        200
    );

}


function zeroPattern(x, groundY) {

    portal(
        x,
        groundY - 160,
        "dual"
    );

    spike(x + 100, groundY, 3);

    block(
        x + 230,
        groundY,
        100,
        180
    );

    spike(x + 400, groundY, 3);

}


function finalPattern(x, groundY) {

    const type =
        Math.floor(x / 500) % 5;

    if (type === 0) {

        spike(x, groundY, 3);

        block(
            x + 140,
            groundY,
            90,
            160
        );

    }

    else if (type === 1) {

        portal(
            x,
            groundY - 180,
            "ship"
        );

        block(
            x + 120,
            groundY,
            90,
            220
        );

    }

    else if (type === 2) {

        portal(
            x,
            groundY - 160,
            "robot"
        );

        spike(
            x + 130,
            groundY,
            3
        );

    }

    else if (type === 3) {

        portal(
            x,
            groundY - 160,
            "spider"
        );

        block(
            x + 150,
            groundY,
            90,
            180
        );

    }

    else {

        portal(
            x,
            groundY - 160,
            "dual"
        );

        spike(
            x + 120,
            groundY,
            3
        );

        spike(
            x + 320,
            groundY,
            3
        );

    }

}


// ============================================================
// LEVEL START
// ============================================================

function startLevel(index) {

    if (!LEVELS[index]) return;

    currentLevel = index;
    level = LEVELS[index];

    gameState = "playing";

    cameraX = 0;

    particles = [];

    player.x = 220;
    player.velocityY = 0;
    player.rotation = 0;

    player.mode = level.mode;

    player.grounded = false;

    player.alive = true;

    player.dual = level.mode === "dual";

    player.secondY = H - 240;
    player.secondVelocityY = 0;

    createLevel(level);

    levelName.textContent =
        `LEVEL ${String(level.id).padStart(2, "0")} — ${level.name}`;

    hideAllScreens();

}


// ============================================================
// SCREENS
// ============================================================

function hideAllScreens() {

    menu.classList.add("hidden");
    levelSelect.classList.add("hidden");
    pauseScreen.classList.add("hidden");
    deathScreen.classList.add("hidden");
    completeScreen.classList.add("hidden");

}


function showMenu() {

    gameState = "menu";

    hideAllScreens();

    menu.classList.remove("hidden");

}


function showLevelSelect() {

    gameState = "levelSelect";

    hideAllScreens();

    levelSelect.classList.remove("hidden");

    buildLevelButtons();

}


function buildLevelButtons() {

    const grid =
        document.getElementById("levelGrid");

    grid.innerHTML = "";

    LEVELS.forEach((item, index) => {

        const button =
            document.createElement("button");

        button.className = "level-button";

        if (index + 1 > unlocked) {

            button.classList.add("locked");

            button.disabled = true;

        }

        button.innerHTML = `
            <span class="level-number">
                ${item.id}
            </span>

            <span class="level-difficulty">
                ${item.difficulty}
            </span>
        `;

        button.addEventListener(
            "click",
            () => startLevel(index)
        );

        grid.appendChild(button);

    });

}


function showPause() {

    if (gameState !== "playing") return;

    gameState = "paused";

    pauseScreen.classList.remove("hidden");

}


function resumeGame() {

    if (gameState !== "paused") return;

    gameState = "playing";

    pauseScreen.classList.add("hidden");

    lastTime = performance.now();

}


function die() {

    if (gameState !== "playing") return;

    player.alive = false;

    gameState = "dead";

    deathProgress.textContent =
        `${getProgress()}%`;

    deathScreen.classList.remove("hidden");

    createExplosion(
        player.x,
        player.y
    );

}


function completeLevel() {

    if (gameState !== "playing") return;

    gameState = "complete";

    completeName.textContent =
        `LEVEL ${String(level.id).padStart(2, "0")} — ${level.name}`;

    completeScreen.classList.remove("hidden");

    if (currentLevel + 2 > unlocked) {

        unlocked =
            Math.min(
                LEVELS.length,
                currentLevel + 2
            );

        localStorage.setItem(
            "raivenGeometryUnlocked",
            unlocked
        );

    }

}


// ============================================================
// INPUT
// ============================================================

function pressInput() {

    inputPressed = true;
    inputHeld = true;

}


function releaseInput() {

    inputHeld = false;

}


window.addEventListener(
    "keydown",
    event => {

        if (
            event.code === "Space" ||
            event.code === "ArrowUp" ||
            event.code === "KeyW"
        ) {

            if (!event.repeat) {
                pressInput();
            }

            event.preventDefault();

        }

        if (event.code === "Escape") {

            if (gameState === "playing") {
                showPause();
            }

            else if (gameState === "paused") {
                resumeGame();
            }

        }

    }
);


window.addEventListener(
    "keyup",
    event => {

        if (
            event.code === "Space" ||
            event.code === "ArrowUp" ||
            event.code === "KeyW"
        ) {

            releaseInput();

        }

    }
);


canvas.addEventListener(
    "mousedown",
    event => {

        if (gameState === "playing") {
            pressInput();
        }

    }
);


window.addEventListener(
    "mouseup",
    releaseInput
);


canvas.addEventListener(
    "touchstart",
    event => {

        if (gameState === "playing") {

            pressInput();

            event.preventDefault();

        }

    },
    { passive: false }
);


window.addEventListener(
    "touchend",
    releaseInput
);


// ============================================================
// PLAYER PHYSICS
// ============================================================

function updatePlayer(dt) {

    const groundY = H - 90;

    const speed =
        level.speed * 60 * dt;


    // --------------------------------------------------------
    // Horizontal movement
    // --------------------------------------------------------

    player.x += speed;


    // --------------------------------------------------------
    // CUBE
    // --------------------------------------------------------

    if (player.mode === "cube") {

        player.velocityY +=
            player.gravity * 60 * dt;

        player.y +=
            player.velocityY * 60 * dt;

        if (
            inputPressed &&
            player.grounded
        ) {

            player.velocityY =
                player.jumpPower;

            player.grounded = false;

        }

        if (!player.grounded) {

            player.rotation +=
                0.18 * 60 * dt;

        }

    }


    // --------------------------------------------------------
    // ROBOT
    // --------------------------------------------------------

    else if (player.mode === "robot") {

        player.velocityY +=
            player.gravity * 60 * dt;

        player.y +=
            player.velocityY * 60 * dt;

        if (
            inputPressed &&
            player.grounded
        ) {

            player.velocityY =
                -19;

            player.grounded = false;

        }

    }


    // --------------------------------------------------------
    // BALL
    // --------------------------------------------------------

    else if (player.mode === "ball") {

        player.velocityY +=
            player.gravity * 60 * dt;

        player.y +=
            player.velocityY * 60 * dt;

        if (
            inputPressed &&
            player.grounded
        ) {

            player.velocityY =
                player.jumpPower;

            player.grounded = false;

        }

        player.rotation +=
            0.15 * 60 * dt;

    }


    // --------------------------------------------------------
    // UFO
    // --------------------------------------------------------

    else if (player.mode === "ufo") {

        player.velocityY +=
            player.gravity * 60 * dt;

        player.y +=
            player.velocityY * 60 * dt;

        if (inputPressed) {

            player.velocityY =
                -9;

        }

    }


    // --------------------------------------------------------
    // SHIP
    // --------------------------------------------------------

    else if (player.mode === "ship") {

        if (inputHeld) {

            player.velocityY -=
                0.8 * 60 * dt;

        }

        else {

            player.velocityY +=
                0.55 * 60 * dt;

        }

        player.velocityY =
            Math.max(
                -9,
                Math.min(
                    player.velocityY,
                    9
                )
            );

        player.y +=
            player.velocityY * 60 * dt;

    }


    // --------------------------------------------------------
    // SPIDER
    // --------------------------------------------------------

    else if (player.mode === "spider") {

        if (inputPressed) {

            player.gravity *= -1;

        }

        player.velocityY +=
            player.gravity * 60 * dt;

        player.y +=
            player.velocityY * 60 * dt;

    }


    // --------------------------------------------------------
    // DUAL
    // --------------------------------------------------------

    else if (player.mode === "dual") {

        player.dual = true;

        player.velocityY +=
            player.gravity * 60 * dt;

        player.y +=
            player.velocityY * 60 * dt;


        player.secondVelocityY +=
            -player.gravity * 60 * dt;

        player.secondY +=
            player.secondVelocityY * 60 * dt;


        if (
            inputPressed &&
            player.grounded
        ) {

            player.velocityY =
                player.jumpPower;

        }

    }


    // --------------------------------------------------------
    // Ground collision
    // --------------------------------------------------------

    if (player.mode !== "ship") {

        if (player.y + player.size >= groundY) {

            player.y =
                groundY - player.size;

            player.velocityY = 0;

            player.grounded = true;

        }

    }


    // --------------------------------------------------------
    // Ceiling
    // --------------------------------------------------------

    if (player.y < 0) {

        player.y = 0;

        if (player.velocityY < 0) {
            player.velocityY = 0;
        }

    }


    // --------------------------------------------------------
    // Dual second player
    // --------------------------------------------------------

    if (player.dual) {

        if (
            player.secondY + player.size >= groundY
        ) {

            player.secondY =
                groundY - player.size;

            player.secondVelocityY = 0;

        }

        if (player.secondY < 0) {

            player.secondY = 0;

            if (player.secondVelocityY < 0) {
                player.secondVelocityY = 0;
            }

        }

    }

}


// ============================================================
// PORTAL COLLISION
// ============================================================

function checkPortals() {

    for (const obj of objects) {

        if (obj.type !== "portal") continue;

        const sx =
            obj.x - cameraX;

        if (
            sx < W &&
            sx + obj.width > 0 &&
            player.x > obj.x - 20 &&
            player.x < obj.x + obj.width + 20
        ) {

            if (player.mode !== obj.mode) {

                player.mode = obj.mode;

                if (obj.mode === "dual") {
                    player.dual = true;
                }

                else {
                    player.dual = false;
                }

                createPortalBurst(
                    obj.x,
                    obj.y
                );

            }

        }

    }

}


// ============================================================
// COLLISION
// ============================================================

function playerBox(y = player.y) {

    return {

        x: player.x,
        y,

        width: player.size,
        height: player.size

    };

}


function intersects(a, b) {

    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );

}


function checkCollisions() {

    const p =
        playerBox();


    for (const obj of objects) {

        // ----------------------------------------------------
        // BLOCK
        // ----------------------------------------------------

        if (obj.type === "block") {

            if (intersects(p, obj)) {

                const previousBottom =
                    player.y -
                    player.velocityY;

                if (
                    previousBottom <= obj.y + 8 &&
                    player.velocityY >= 0
                ) {

                    player.y =
                        obj.y - player.size;

                    player.velocityY = 0;

                    player.grounded = true;

                }

                else {

                    die();
                    return;

                }

            }

        }


        // ----------------------------------------------------
        // SPIKE
        // ----------------------------------------------------

        else if (obj.type === "spike") {

            const hitbox = {

                x: obj.x + 7,
                y: obj.y + 8,

                width:
                    obj.width - 14,

                height:
                    obj.height - 8

            };

            if (intersects(p, hitbox)) {

                die();
                return;

            }

        }


        // ----------------------------------------------------
        // PAD
        // ----------------------------------------------------

        else if (obj.type === "pad") {

            if (intersects(p, obj)) {

                if (
                    player.velocityY >= 0
                ) {

                    player.velocityY =
                        -21;

                    player.grounded = false;

                    createJumpParticles(
                        player.x,
                        player.y + player.size
                    );

                }

            }

        }


        // ----------------------------------------------------
        // ORB
        // ----------------------------------------------------

        else if (obj.type === "orb") {

            if (
                intersects(
                    p,
                    {
                        x: obj.x,
                        y: obj.y,
                        width: obj.width,
                        height: obj.height
                    }
                )
            ) {

                if (inputPressed) {

                    player.velocityY =
                        -17;

                    player.grounded = false;

                    createJumpParticles(
                        player.x,
                        player.y
                    );

                }

            }

        }


        // ----------------------------------------------------
        // FINISH
        // ----------------------------------------------------

        else if (obj.type === "finish") {

            if (intersects(p, obj)) {

                completeLevel();
                return;

            }

        }

    }


    // --------------------------------------------------------
    // Dual collision
    // --------------------------------------------------------

    if (player.dual) {

        const second =
            playerBox(player.secondY);

        for (const obj of objects) {

            if (
                obj.type === "spike" ||
                obj.type === "block"
            ) {

                if (
                    intersects(
                        second,
                        obj
                    )
                ) {

                    die();
                    return;

                }

            }

        }

    }

}


// ============================================================
// PROGRESS
// ============================================================

function getProgress() {

    if (!level) return 0;

    return Math.min(
        100,
        Math.floor(
            (player.x / level.length) * 100
        )
    );

}


function updateHUD() {

    const percent =
        getProgress();

    progress.style.width =
        `${percent}%`;

    progressText.textContent =
        `${percent}%`;

}


// ============================================================
// CAMERA
// ============================================================

function updateCamera() {

    const target =
        player.x - W * 0.28;

    cameraX +=
        (target - cameraX) * 0.12;

    if (cameraX < 0) {
        cameraX = 0;
    }

}


// ============================================================
// PARTICLES
// ============================================================

function createParticle(
    x,
    y,
    vx,
    vy,
    life = 1,
    size = 4
) {

    particles.push({

        x,
        y,

        vx,
        vy,

        life,
        maxLife: life,

        size

    });

}


function createExplosion(x, y) {

    for (let i = 0; i < 28; i++) {

        const angle =
            Math.random() *
            Math.PI *
            2;

        const speed =
            2 +
            Math.random() * 7;

        createParticle(
            x,
            y,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            .5 + Math.random() * .7,
            3 + Math.random() * 5
        );

    }

}


function createJumpParticles(x, y) {

    for (let i = 0; i < 7; i++) {

        createParticle(
            x,
            y,
            -Math.random() * 3,
            -Math.random() * 3,
            .35,
            3
        );

    }

}


function createPortalBurst(x, y) {

    for (let i = 0; i < 18; i++) {

        const angle =
            Math.random() *
            Math.PI *
            2;

        createParticle(
            x,
            y,
            Math.cos(angle) * 3,
            Math.sin(angle) * 3,
            .6,
            3
        );

    }

}


function updateParticles(dt) {

    for (let i = particles.length - 1; i >= 0; i--) {

        const p = particles[i];

        p.x +=
            p.vx * 60 * dt;

        p.y +=
            p.vy * 60 * dt;

        p.vy +=
            .12 * 60 * dt;

        p.life -= dt;

        if (p.life <= 0) {

            particles.splice(i, 1);

        }

    }

}


// ============================================================
// DRAW BACKGROUND
// ============================================================

function drawBackground() {

    const hue =
        level ? level.color : 210;

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            H
        );

    gradient.addColorStop(
        0,
        `hsl(${hue}, 45%, 10%)`
    );

    gradient.addColorStop(
        1,
        `hsl(${hue}, 35%, 3%)`
    );

    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    // --------------------------------------------------------
    // Background grid
    // --------------------------------------------------------

    ctx.globalAlpha = .15;

    ctx.strokeStyle =
        "#ffffff";

    ctx.lineWidth = 1;

    const gridSize = 80;

    const offset =
        -(cameraX * .25) %
        gridSize;

    for (
        let x = offset;
        x < W;
        x += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            H
        );

        ctx.stroke();

    }

    for (
        let y = 0;
        y < H;
        y += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            W,
            y
        );

        ctx.stroke();

    }

    ctx.globalAlpha = 1;


    // --------------------------------------------------------
    // Distant shapes
    // --------------------------------------------------------

    ctx.globalAlpha = .08;

    for (
        let i = 0;
        i < 20;
        i++
    ) {

        const x =
            ((i * 400) -
                cameraX * .1) %
            (W + 400);

        const y =
            100 +
            (i * 83) %
            (H - 200);

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            30 + i * 2,
            0,
            Math.PI * 2
        );

        ctx.stroke();

    }

    ctx.globalAlpha = 1;

}


// ============================================================
// DRAW OBJECTS
// ============================================================

function drawObjects() {

    for (const obj of objects) {

        const x =
            obj.x - cameraX;

        if (
            x > W + 200 ||
            x + obj.width < -200
        ) {

            continue;

        }


        // ----------------------------------------------------
        // BLOCK
        // ----------------------------------------------------

        if (obj.type === "block") {

            ctx.fillStyle =
                "rgba(255,255,255,.12)";

            ctx.fillRect(
                x,
                obj.y,
                obj.width,
                obj.height
            );

            ctx.strokeStyle =
                "rgba(255,255,255,.35)";

            ctx.strokeRect(
                x,
                obj.y,
                obj.width,
                obj.height
            );

        }


        // ----------------------------------------------------
        // FLOOR
        // ----------------------------------------------------

        else if (obj.type === "floorLine") {

            ctx.fillStyle =
                "rgba(255,255,255,.5)";

            ctx.fillRect(
                x,
                obj.y,
                obj.width,
                obj.height
            );

        }


        // ----------------------------------------------------
        // SPIKE
        // ----------------------------------------------------

        else if (obj.type === "spike") {

            ctx.beginPath();

            ctx.moveTo(
                x,
                obj.y + obj.height
            );

            ctx.lineTo(
                x + obj.width / 2,
                obj.y
            );

            ctx.lineTo(
                x + obj.width,
                obj.y + obj.height
            );

            ctx.closePath();

            ctx.fillStyle =
                "#ffffff";

            ctx.fill();

        }


        // ----------------------------------------------------
        // ORB
        // ----------------------------------------------------

        else if (obj.type === "orb") {

            ctx.beginPath();

            ctx.arc(
                x + obj.width / 2,
                obj.y + obj.height / 2,
                13,
                0,
                Math.PI * 2
            );

            ctx.strokeStyle =
                "#ffffff";

            ctx.lineWidth = 3;

            ctx.stroke();

            ctx.beginPath();

            ctx.arc(
                x + obj.width / 2,
                obj.y + obj.height / 2,
                5,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                "#ffffff";

            ctx.fill();

        }


        // ----------------------------------------------------
        // PAD
        // ----------------------------------------------------

        else if (obj.type === "pad") {

            ctx.fillStyle =
                "#ffffff";

            ctx.beginPath();

            ctx.moveTo(
                x,
                obj.y + obj.height
            );

            ctx.lineTo(
                x + obj.width / 2,
                obj.y
            );

            ctx.lineTo(
                x + obj.width,
                obj.y + obj.height
            );

            ctx.closePath();

            ctx.fill();

        }


        // ----------------------------------------------------
        // PORTAL
        // ----------------------------------------------------

        else if (obj.type === "portal") {

            ctx.beginPath();

            ctx.ellipse(
                x + obj.width / 2,
                obj.y + obj.height / 2,
                obj.width / 2,
                obj.height / 2,
                0,
                0,
                Math.PI * 2
            );

            ctx.strokeStyle =
                "#ffffff";

            ctx.lineWidth = 4;

            ctx.stroke();

            ctx.globalAlpha = .25;

            ctx.fillStyle =
                "#ffffff";

            ctx.fill();

            ctx.globalAlpha = 1;

        }


        // ----------------------------------------------------
        // FINISH
        // ----------------------------------------------------

        else if (obj.type === "finish") {

            ctx.strokeStyle =
                "#ffffff";

            ctx.lineWidth = 5;

            ctx.strokeRect(
                x,
                obj.y,
                obj.width,
                obj.height
            );

        }

    }

}


// ============================================================
// DRAW PLAYER
// ============================================================

function drawPlayerShape(x, y, mode) {

    ctx.save();

    ctx.translate(
        x + player.size / 2,
        y + player.size / 2
    );


    // --------------------------------------------------------
    // Cube
    // --------------------------------------------------------

    if (mode === "cube") {

        ctx.rotate(
            player.rotation
        );

        ctx.fillStyle =
            "#ffffff";

        ctx.fillRect(
            -16,
            -16,
            32,
            32
        );

        ctx.fillStyle =
            "#050509";

        ctx.fillRect(
            -8,
            -8,
            5,
            5
        );

        ctx.fillRect(
            3,
            -8,
            5,
            5
        );

    }


    // --------------------------------------------------------
    // Ball
    // --------------------------------------------------------

    else if (mode === "ball") {

        ctx.rotate(
            player.rotation
        );

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            16,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "#ffffff";

        ctx.fill();

        ctx.strokeStyle =
            "#050509";

        ctx.lineWidth = 3;

        ctx.beginPath();

        ctx.moveTo(-10, 0);
        ctx.lineTo(10, 0);

        ctx.stroke();

    }


    // --------------------------------------------------------
    // Ship
    // --------------------------------------------------------

    else if (mode === "ship") {

        ctx.rotate(
            player.velocityY * .05
        );

        ctx.beginPath();

        ctx.moveTo(
            20,
            0
        );

        ctx.lineTo(
            -16,
            -13
        );

        ctx.lineTo(
            -8,
            0
        );

        ctx.lineTo(
            -16,
            13
        );

        ctx.closePath();

        ctx.fillStyle =
            "#ffffff";

        ctx.fill();

    }


    // --------------------------------------------------------
    // UFO
    // --------------------------------------------------------

    else if (mode === "ufo") {

        ctx.fillStyle =
            "#ffffff";

        ctx.fillRect(
            -17,
            -5,
            34,
            10
        );

        ctx.fillRect(
            -10,
            -11,
            20,
            6
        );

    }


    // --------------------------------------------------------
    // Robot
    // --------------------------------------------------------

    else if (mode === "robot") {

        ctx.fillStyle =
            "#ffffff";

        ctx.fillRect(
            -15,
            -15,
            30,
            30
        );

        ctx.fillStyle =
            "#050509";

        ctx.fillRect(
            -8,
            -7,
            5,
            5
        );

        ctx.fillRect(
            3,
            -7,
            5,
            5
        );

        ctx.fillRect(
            -7,
            6,
            14,
            3
        );

    }


    // --------------------------------------------------------
    // Spider
    // --------------------------------------------------------

    else if (mode === "spider") {

        ctx.fillStyle =
            "#ffffff";

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            13,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.strokeStyle =
            "#ffffff";

        ctx.lineWidth = 4;

        for (
            let i = 0;
            i < 4;
            i++
        ) {

            const a =
                (Math.PI / 2) * i;

            ctx.beginPath();

            ctx.moveTo(
                Math.cos(a) * 10,
                Math.sin(a) * 10
            );

            ctx.lineTo(
                Math.cos(a) * 21,
                Math.sin(a) * 21
            );

            ctx.stroke();

        }

    }


    ctx.restore();

}


// ============================================================
// DRAW PLAYER
// ============================================================

function drawPlayer() {

    const screenX =
        player.x - cameraX;

    drawPlayerShape(
        screenX,
        player.y,
        player.mode
    );


    // --------------------------------------------------------
    // Dual second player
    // --------------------------------------------------------

    if (player.dual) {

        const oldY =
            player.y;

        player.y =
            player.secondY;

        drawPlayerShape(
            screenX,
            player.secondY,
            player.mode
        );

        player.y =
            oldY;

    }

}


// ============================================================
// DRAW PARTICLES
// ============================================================

function drawParticles() {

    for (const p of particles) {

        ctx.globalAlpha =
            Math.max(
                0,
                p.life / p.maxLife
            );

        ctx.fillStyle =
            "#ffffff";

        ctx.fillRect(
            p.x - cameraX,
            p.y,
            p.size,
            p.size
        );

    }

    ctx.globalAlpha = 1;

}


// ============================================================
// MAIN UPDATE
// ============================================================

function update(dt) {

    if (gameState !== "playing") {

        inputPressed = false;

        return;

    }


    updatePlayer(dt);

    checkPortals();

    checkCollisions();

    updateCamera();

    updateParticles(dt);

    updateHUD();


    // --------------------------------------------------------
    // Fall detection
    // --------------------------------------------------------

    if (
        player.y > H + 200 ||
        (
            player.dual &&
            player.secondY > H + 200
        )
    ) {

        die();

    }


    // --------------------------------------------------------
    // Level completion safety
    // --------------------------------------------------------

    if (
        player.x >= level.length
    ) {

        completeLevel();

    }


    // --------------------------------------------------------
    // IMPORTANT:
    // Reset AFTER all input-dependent gameplay.
    // --------------------------------------------------------

    inputPressed = false;

}


// ============================================================
// MAIN DRAW
// ============================================================

function draw() {

    drawBackground();

    if (level) {

        drawObjects();

        drawParticles();

        drawPlayer();

    }

}


// ============================================================
// GAME LOOP
// ============================================================

function loop(timestamp) {

    const dt =
        Math.min(
            (timestamp - lastTime) / 1000,
            0.033
        );

    lastTime = timestamp;

    update(dt);

    draw();

    requestAnimationFrame(loop);

}


// ============================================================
// BUTTON EVENTS
// ============================================================

playButton.addEventListener(
    "click",
    () => {

        startLevel(0);

    }
);


levelsButton.addEventListener(
    "click",
    () => {

        showLevelSelect();

    }
);


backButton.addEventListener(
    "click",
    () => {

        showMenu();

    }
);


pauseButton.addEventListener(
    "click",
    () => {

        if (gameState === "playing") {

            showPause();

        }

        else if (gameState === "paused") {

            resumeGame();

        }

    }
);


resumeButton.addEventListener(
    "click",
    () => {

        resumeGame();

    }
);


restartButton.addEventListener(
    "click",
    () => {

        startLevel(currentLevel);

    }
);


pauseMenuButton.addEventListener(
    "click",
    () => {

        showLevelSelect();

    }
);


tryAgainButton.addEventListener(
    "click",
    () => {

        startLevel(currentLevel);

    }
);


deathMenuButton.addEventListener(
    "click",
    () => {

        showLevelSelect();

    }
);


nextButton.addEventListener(
    "click",
    () => {

        if (
            currentLevel <
            LEVELS.length - 1
        ) {

            startLevel(
                currentLevel + 1
            );

        }

        else {

            showLevelSelect();

        }

    }
);


completeMenuButton.addEventListener(
    "click",
    () => {

        showLevelSelect();

    }
);


// ============================================================
// START
// ============================================================

showMenu();

requestAnimationFrame(
    timestamp => {

        lastTime = timestamp;

        loop(timestamp);

    }
);
