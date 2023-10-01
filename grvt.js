const TPS = 60;
const K = 500;
const friction = 0.5;

let w;
let newPointMass = 100;
let renderOffsetSpeed = 0;
let isDarkMode = false;
let isGodMode = false;

let simulationRunning = true,
                displayForces = false,
                borders = null,
                newConnectionMode = false,
                isUsingTouch = false;

let newConnectionFirstID = -1, newConnectionSecondID = -1;
let ticksSinceLastConnectionRequest = -1;

function setup() {
    if (window.innerHeight < window.innerWidth) {
        createCanvas(window.innerWidth, window.innerHeight);
    } else {
        createCanvas(window.innerWidth, window.innerHeight - document.querySelector("#bottom-controls").offsetHeight);
    }

    pixelDensity(displayDensity());
    frameRate(TPS);

    isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        isDarkMode = event.matches;
    });

    resetGame();
}

function draw() {
    background(255);

    if (simulationRunning) {
        w.tick();
    }

    w.draw();

    if (ticksSinceLastConnectionRequest != -1) {
        if (++ticksSinceLastConnectionRequest >= TPS) {
            resetNewConnectionRequest();
        }
    }

    if (!isUsingTouch) {
        noFill();
        strokeWeight(3);
        stroke(200, 200);

        if (isGodMode) {
            stroke(175, 100, 50, 200);
        }

        circle(mouseX, mouseY, massToRadius(newPointMass) * 2);
    }

    fill(100, 0, 150, 255);
    textAlign(LEFT);
    textSize(35);
    noStroke();
    text("Score: " + w.getScore(), 30, 45);

    fill(100, 0, 150, 175);
    textSize(17);
    text("Current spawn mass: " + newPointMass, 30, 80);

    fill(100, 0, 150, 175);
    textSize(17);
    text("Mass available: " + w.getMassAvailable(), 30, 100);

    fill(175, 100, 50, 175);
    textSize(17);
    text("Particles: " + w.getPointsAmount(), 30, 140);

    if (!simulationRunning) {
        fill(0, 100, 200, 100);
        textAlign(CENTER, CENTER);
        textSize(75);
        noStroke();
        text("PAUSED", width / 2, height / 2);
    }

    const renderOffsetAcceleration = 0.05;
    if (keyIsPressed) {
        renderOffsetSpeed = min(renderOffsetSpeed + renderOffsetAcceleration, 2);

        switch (keyCode) {
        case 38: // UP
            w.offsetRenderBy(0, renderOffsetSpeed);
            break;
        case 40: // DOWN
            w.offsetRenderBy(0, -renderOffsetSpeed);
            break;
        case 37: // LEFT
            w.offsetRenderBy(renderOffsetSpeed, 0);
            break;
        case 39: // RIGHT
            w.offsetRenderBy(-renderOffsetSpeed, 0);
            break;
        case 69:
            spawnNewPoint();
            break;
        default:
            console.log(key, keyCode);
        }
    } else {
        //renderOffsetSpeed = max(renderOffsetSpeed - renderOffsetAcceleration, 0);
    }

    if (mouseIsPressed && mouseButton == RIGHT) {
        spawnNewPoint(withKeyboard = true);
    }
}

function mousePressed() {
    isUsingTouch = false;
    if (mouseButton == LEFT && mouseY < height - document.querySelector("#bottom-controls").offsetHeight) {
        spawnNewPoint();
    }
}

function touchStarted() {
    isUsingTouch = true;
    if (mouseY < height - document.querySelector("#bottom-controls").offsetHeight) {
        spawnNewPoint();
    }
}

function spawnNewPoint(withKeyboard = false) {
    if (withKeyboard && mouseX === pmouseX && mouseY === pmouseY) {
        return;
    }

    let loc = w.getRenderOffset().mult(-1);
    loc.add(mouseX, mouseY);
    w.createLevelPoint(loc, newPointMass);
}

function keyPressed() {
    switch (keyCode) {
    case ENTER:
        w.setRandomGoal();
        return;
    }

    switch (key) {
    case 'm': case 'ь':
        requestNewPointMass();
        break;

    case 'g': case 'п':
        requestNew_g();
        break;

    case 'f': case 'а':
        displayForces = !displayForces;
        break;

    case 'b': case 'и':
        borders.toggleActive();
        break;

    case 'c': case 'с':
        requestNewConnectionsUI();
        break;

    case 'r': case 'к':
        resetGame();
        break;

    case '`':
        isGodMode = !isGodMode;
        break;

    case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9':
        let keylet = leteger.parselet(String.valueOf(key));
        if (w.pointExists(keylet)) {
            w.followId(keylet);
        }

        if (newConnectionMode) {
            if (newConnectionFirstID == -1) {
                newConnectionFirstID = leteger.parselet(String.valueOf(key));
                ticksSinceLastConnectionRequest = 0;
            } else if (newConnectionSecondID == -1 && ticksSinceLastConnectionRequest != -1) {
                newConnectionSecondID = leteger.parselet(String.valueOf(key));

                console.log(newConnectionFirstID, newConnectionSecondID, w.requestConnection(newConnectionFirstID, newConnectionSecondID, STRONG_CONNECTION));

                resetNewConnectionRequest();
            }
        } else {

        }
        break;
    case ' ':
        // simulationRunning = !simulationRunning;
        w.suckAll();
        break;
    }
}

function mouseWheel(event) {
    let delta = event.delta;
    newPointMass = min(max(25, newPointMass + delta * 5), !isGodMode ? w.getMassAvailable() : Infinity);
}

function resetNewConnectionRequest() {
    newConnectionFirstID = -1;
    newConnectionSecondID = -1;
    ticksSinceLastConnectionRequest = -1;
    console.log("reset..");
}

function resetGame() {
    w = new LevelWorld(10);
    isGodMode = false;
    initBorders();
}

function initBorders() {
    borders = new Borders(width / 2 - 1000, height / 2 - 1000, width / 2 + 1000, height / 2 + 1000);
}