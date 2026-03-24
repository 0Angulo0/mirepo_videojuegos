/*
 * Breakout game based on the Pong base code :)
 * Dani Angulo
 * 2026-03-24
 */

"use strict";

//canvas dimensions
const canvasWidth = 800;
const canvasHeight = 600;

let ctx;
let game;
let oldTime = 0;

//gameplay constants
const BALL_SPEED = 0.4;
const PADDLE_SPEED = 0.6;
const BLOCK_ROWS = 5;  //configurable number of rows
const BLOCK_COLS = 10;  //configurable number of columns
const BLOCK_WIDTH = 68;
const BLOCK_HEIGHT = 25;
const BLOCK_PADDING = 5;
const BLOCK_OFFSET_TOP = 80;
const BLOCK_OFFSET_LEFT = 36;

//colors for each row of blocks
const ROW_COLORS = ["#e74c3c", "#f79948", "#f1c40f", "#2ecc71", "#3498db"];

//duration in ms that bonus balls stay alive
const BONUS_BALL_DURATION = 15000;


class Block extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color, "block");
        this.destroy = false;  //flag to mark for removal
        this.points = 1;  //base points per block
    }
}

class Ball extends GameObject {
    constructor(position, width, height, color, isBonus = false) {
        super(position, width, height, color, "ball");
        this.velocity = new Vector(0, 0);
        this.active = false;  //ball only moves after launch
        this.isBonus = isBonus;  //whether this is a temporary bonus ball
        this.lifeTimer = 0;  //tracks time alive for bonus balls
    }

    launch() {
        // launch at a random upward angle
        const angle = (Math.random() * Math.PI / 3) - (Math.PI / 6);  //between -30 and 30 degrees
        this.velocity.x = Math.cos(angle) * (Math.random() > 0.5 ? 1 : -1);
        this.velocity.y = -Math.abs(Math.sin(angle)) - 0.8;  //always go up first
        this.active = true;
    }

    update(deltaTime) {
        if (!this.active) return;

        if (this.isBonus) {
            this.lifeTimer += deltaTime;  //accumulate time alive
        }

        const speed = this.isBonus ? BALL_SPEED * 1.2 : BALL_SPEED;  //bonus balls slightly faster
        this.velocity = this.velocity.normalize().times(speed);
        this.position = this.position.plus(this.velocity.times(deltaTime));
    }

    isExpired() {
        return this.isBonus && this.lifeTimer >= BONUS_BALL_DURATION;  //check if bonus time ran out
    }

    reset(startX, startY) {
        this.position = new Vector(startX, startY);
        this.velocity = new Vector(0, 0);
        this.active = false;
        this.lifeTimer = 0;
    }
}

class Paddle extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color, "paddle");
        this.velocity = new Vector(0, 0);
        this.keys = [];
        this.motion = {
            left: { axis: "x", sign: -1 },
            right: { axis: "x", sign: 1 },
        };
    }

    update(deltaTime) {
        this.velocity.x = 0;
        this.velocity.y = 0;

        for (const dir of this.keys) {
            const axis = this.motion[dir].axis;
            const sign = this.motion[dir].sign;
            this.velocity[axis] += sign;
        }

        this.velocity = this.velocity.normalize().times(PADDLE_SPEED);
        this.position = this.position.plus(this.velocity.times(deltaTime));
        this.clampWithinCanvas();
    }

    clampWithinCanvas() {
        if (this.position.x - this.halfSize.x < 0) {
            this.position.x = this.halfSize.x;  //left wall clamp
        }
        if (this.position.x + this.halfSize.x > canvasWidth) {
            this.position.x = canvasWidth - this.halfSize.x;  //right wall clamp
        }
    }
}


class Game {
    constructor() {
        this.lives = 3;
        this.score = 0;
        this.blocksDestroyed = 0;
        this.totalBlocks = BLOCK_ROWS * BLOCK_COLS;
        this.state = "playing";  //states: playing, gameover, win
        this.bonusBalls = [];  //array for temporary extra balls
        this.lastBonusScore = 0;  //tracks last score where bonus was triggered
        this.bonusMessageTimer = 0;  //how long to show bonus message
        this.bonusMessage = "";

        this.createEventListeners();
        this.initObjects();
    }

    initObjects() {
        this.paddle = new Paddle(
            new Vector(canvasWidth / 2, canvasHeight - 40),
            100, 15, "#ecf0f1"
        );

        this.ball = new Ball(
            new Vector(canvasWidth / 2, canvasHeight - 60),
            12, 12, "#f0f0f0"
        );

        // ui labels
        this.scoreLabel = new TextLabel(20, 30, "18px 'Courier New'", "#ffffff");
        this.livesLabel = new TextLabel(canvasWidth / 2 - 70, 30, "18px 'Courier New'", "#ffffff");
        this.blocksLabel = new TextLabel(canvasWidth - 150, 30, "18px 'Courier New'", "#ffffff");
        this.messageLabel = new TextLabel(canvasWidth / 2, canvasHeight / 2, "36px 'Courier New'", "#ffffff");
        this.subMessageLabel = new TextLabel(canvasWidth / 2, canvasHeight / 2 + 50, "20px 'Courier New'", "#aaaaaa");
        this.bonusLabel = new TextLabel(canvasWidth / 2, canvasHeight / 2 - 60, "22px 'Courier New'", "#f39c12");
        this.timerLabel = new TextLabel(canvasWidth / 2, 55, "14px 'Courier New'", "#f39c12");

        this.buildBlocks();
    }

    buildBlocks() {
        this.blocks = [];

        for (let row = 0; row < BLOCK_ROWS; row++) {
            for (let col = 0; col < BLOCK_COLS; col++) {
                const x = BLOCK_OFFSET_LEFT + col * (BLOCK_WIDTH + BLOCK_PADDING) + BLOCK_WIDTH / 2;
                const y = BLOCK_OFFSET_TOP + row * (BLOCK_HEIGHT + BLOCK_PADDING) + BLOCK_HEIGHT / 2;
                const color = ROW_COLORS[row % ROW_COLORS.length];
                const block = new Block(new Vector(x, y), BLOCK_WIDTH, BLOCK_HEIGHT, color);
                this.blocks.push(block);
            }
        }
    }

    spawnBonusBalls() {
        // add 2 bonus balls when score hits a multiple of 15 blocks destroyed
        for (let i = 0; i < 2; i++) {
            const offsetX = (i === 0) ? -30 : 30;  // spread them slightly apart
            const bonus = new Ball(
                new Vector(this.paddle.position.x + offsetX, canvasHeight - 70),
                10, 10, "#f39c12", true  // orange color for bonus balls
            );
            bonus.launch();
            this.bonusBalls.push(bonus);
        }

        this.bonusMessage = "MULTI BALL x2!  15 sec";
        this.bonusMessageTimer = 2500;  // show message for 2.5 seconds
    }

    checkBonusTrigger() {
        // trigger bonus every 15 blocks destroyed, but only once per milestone
        const milestone = Math.floor(this.blocksDestroyed / 15);
        const lastMilestone = Math.floor(this.lastBonusScore / 15);

        if (milestone > lastMilestone && this.blocksDestroyed > 0) {
            this.lastBonusScore = this.blocksDestroyed;
            this.spawnBonusBalls();
        }
    }

    handleBallBlockCollision(ball) {
        for (const block of this.blocks) {
            if (block.destroy) continue;

            if (boxOverlap(ball, block)) {
                block.destroy = true;
                this.blocksDestroyed++;
                this.score += block.points;

                this.checkBonusTrigger();

                // figure out which side the ball hit to reflect correctly
                const ballL = ball.position.x - ball.halfSize.x;
                const ballR = ball.position.x + ball.halfSize.x;
                const ballT = ball.position.y - ball.halfSize.y;
                const ballB = ball.position.y + ball.halfSize.y;
                const bkL = block.position.x - block.halfSize.x;
                const bkR = block.position.x + block.halfSize.x;
                const bkT = block.position.y - block.halfSize.y;
                const bkB = block.position.y + block.halfSize.y;

                const overlapLeft = ballR - bkL;
                const overlapRight = bkR - ballL;
                const overlapTop = ballB - bkT;
                const overlapBottom = bkB - ballT;

                const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

                if (minOverlap === overlapTop || minOverlap === overlapBottom) {
                    ball.velocity.y *= -1;  // reflect vertically
                } else {
                    ball.velocity.x *= -1;  // reflect horizontally
                }

                break;  // only one block collision per frame per ball
            }
        }

        // remove destroyed blocks
        this.blocks = this.blocks.filter(b => !b.destroy);

        if (this.blocks.length === 0) {
            this.state = "win";  // all blocks cleared
        }
    }

    handleWallCollisions(ball) {
        // left wall
        if (ball.position.x - ball.halfSize.x <= 0) {
            ball.position.x = ball.halfSize.x;
            ball.velocity.x *= -1;
        }
        // right wall
        if (ball.position.x + ball.halfSize.x >= canvasWidth) {
            ball.position.x = canvasWidth - ball.halfSize.x;
            ball.velocity.x *= -1;
        }
        // top wall
        if (ball.position.y - ball.halfSize.y <= 0) {
            ball.position.y = ball.halfSize.y;
            ball.velocity.y *= -1;
        }
    }

    handlePaddleCollision(ball) {
        if (boxOverlap(ball, this.paddle)) {
            ball.position.y = this.paddle.position.y - this.paddle.halfSize.y - ball.halfSize.y;

            // angle depends on where the ball hits the paddle
            const hitPos = (ball.position.x - this.paddle.position.x) / this.paddle.halfSize.x;  // -1 to 1
            const angle = hitPos * (Math.PI / 3);  // max 60 degrees
            const speed = ball.velocity.magnitude();
            ball.velocity.x = Math.sin(angle) * speed;
            ball.velocity.y = -Math.abs(Math.cos(angle) * speed);  // always bounce upward
        }
    }

    update(deltaTime) {
        if (this.state !== "playing") return;

        this.paddle.update(deltaTime);

        // update bonus message timer
        if (this.bonusMessageTimer > 0) {
            this.bonusMessageTimer -= deltaTime;
        }

        // main ball logic
        if (this.ball.active) {
            this.ball.update(deltaTime);
            this.handleWallCollisions(this.ball);
            this.handlePaddleCollision(this.ball);
            this.handleBallBlockCollision(this.ball);

            // ball fell below screen — lose a life
            if (this.ball.position.y - this.ball.halfSize.y > canvasHeight) {
                this.lives--;
                if (this.lives <= 0) {
                    this.state = "gameover";
                } else {
                    this.ball.reset(canvasWidth / 2, canvasHeight - 60);  // respawn above paddle
                }
            }
        }

        // bonus balls logic
        for (let i = this.bonusBalls.length - 1; i >= 0; i--) {
            const bb = this.bonusBalls[i];
            bb.update(deltaTime);
            this.handleWallCollisions(bb);
            this.handlePaddleCollision(bb);
            this.handleBallBlockCollision(bb);

            // remove if expired or fell below screen
            if (bb.isExpired() || bb.position.y - bb.halfSize.y > canvasHeight) {
                this.bonusBalls.splice(i, 1);
            }
        }
    }

    drawBackground(ctx) {
        // dark gradient background
        const grad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
        grad.addColorStop(0, "#0f0c29");
        grad.addColorStop(1, "#24243e");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // subtle grid lines for depth
        ctx.strokeStyle = "rgba(255,255,255,0.04)";
        ctx.lineWidth = 1;
        for (let x = 0; x < canvasWidth; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvasHeight);
            ctx.stroke();
        }
        for (let y = 0; y < canvasHeight; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvasWidth, y);
            ctx.stroke();
        }
    }

    drawHud(ctx) {
        this.scoreLabel.draw(ctx, `SCORE: ${this.score}`);
        this.livesLabel.draw(ctx, `LIVES: ${"♥ ".repeat(this.lives).trim()}`);
        this.blocksLabel.draw(ctx, `BLOCKS: ${this.blocksDestroyed}/${this.totalBlocks}`);

        // show timer for active bonus balls
        if (this.bonusBalls.length > 0) {
            const remaining = Math.ceil((BONUS_BALL_DURATION - this.bonusBalls[0].lifeTimer) / 1000);
            this.timerLabel.draw(ctx, `MULTI BALL: ${remaining}s`);
        }

        // show bonus triggered message
        if (this.bonusMessageTimer > 0) {
            ctx.save();
            ctx.textAlign = "center";
            this.bonusLabel.draw(ctx, this.bonusMessage);
            ctx.restore();
        }
    }

    drawOverlay(ctx, title, subtitle) {
        // semi-transparent overlay for game over / win
        ctx.fillStyle = "rgba(0,0,0,0.65)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx.save();
        ctx.textAlign = "center";

        ctx.font = "48px 'Courier New'";
        ctx.fillStyle = title === "GAME OVER" ? "#e74c3c" : "#2ecc71";
        ctx.fillText(title, canvasWidth / 2, canvasHeight / 2);

        ctx.font = "20px 'Courier New'";
        ctx.fillStyle = "#aaaaaa";
        ctx.fillText(subtitle, canvasWidth / 2, canvasHeight / 2 + 50);

        ctx.font = "16px 'Courier New'";
        ctx.fillStyle = "#777777";
        ctx.fillText(`final score: ${this.score}`, canvasWidth / 2, canvasHeight / 2 + 90);

        ctx.restore();
    }

    draw(ctx) {
        this.drawBackground(ctx);

        // draw all blocks
        for (const block of this.blocks) {
            block.draw(ctx);

            // subtle glow effect on top of blocks
            ctx.save();
            ctx.globalAlpha = 0.25;
            ctx.fillStyle = block.color;
            ctx.fillRect(
                block.position.x - block.halfSize.x,
                block.position.y - block.halfSize.y,
                block.size.x, 4  // thin glow strip at top
            );
            ctx.restore();
        }

        this.paddle.draw(ctx);
        this.ball.draw(ctx);

        // draw bonus balls with glow
        for (const bb of this.bonusBalls) {
            ctx.save();
            ctx.shadowColor = "#f39c12";
            ctx.shadowBlur = 12;
            bb.draw(ctx);
            ctx.restore();
        }

        this.drawHud(ctx);

        if (this.state === "gameover") {
            this.drawOverlay(ctx, "GAME OVER", "press R to restart");
        } else if (this.state === "win") {
            this.drawOverlay(ctx, "YOU WIN!", "press R to restart");
        }

        // launch hint when ball is idle
        if (this.state === "playing" && !this.ball.active) {
            ctx.save();
            ctx.textAlign = "center";
            ctx.font = "16px 'Courier New'";
            ctx.fillStyle = "rgba(255,255,255,0.6)";
            ctx.fillText("press SPACE to launch", canvasWidth / 2, canvasHeight / 2 + 20);
            ctx.restore();
        }
    }

    createEventListeners() {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft' || event.key === 'a') {
                this.addKey('left');
            }
            if (event.key === 'ArrowRight' || event.key === 'd') {
                this.addKey('right');
            }
            if (event.code === 'Space') {
                if (!this.ball.active && this.state === "playing") {
                    this.ball.launch();
                }
                event.preventDefault();  // prevent page scroll on space
            }
            if (event.key === 'r' || event.key === 'R') {
                if (this.state !== "playing") {
                    restartGame();  // restart from main
                }
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.key === 'ArrowLeft' || event.key === 'a') {
                this.delKey('left');
            }
            if (event.key === 'ArrowRight' || event.key === 'd') {
                this.delKey('right');
            }
        });
    }

    addKey(direction) {
        if (!this.paddle.keys.includes(direction)) {
            this.paddle.keys.push(direction);
        }
    }

    delKey(direction) {
        const idx = this.paddle.keys.indexOf(direction);
        if (idx !== -1) {
            this.paddle.keys.splice(idx, 1);
        }
    }
}


function restartGame() {
    game = new Game();
}


function main() {
    const canvas = document.getElementById('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext('2d');

    game = new Game();

    drawScene(0);
}


function drawScene(newTime) {
    const deltaTime = newTime - oldTime;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    game.update(deltaTime);
    game.draw(ctx);

    oldTime = newTime;
    requestAnimationFrame(drawScene);
}