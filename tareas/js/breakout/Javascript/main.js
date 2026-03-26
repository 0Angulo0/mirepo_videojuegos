/*
 & Breakout game based on the Pong base code by Gilberto Echeverria
 & Dani Angulo
 & 2026-03-24
 */

"use strict";

//*canvas dimensions, px
const canvasWidth = 800;
const canvasHeight = 600;

let ctx; //cotext of the canvas
let game;  //a variable to store the game object
let oldTime = 0;  //variable to store the time at the previous frame

//*gameplay settings, easier to code :)
const BALL_SPEED = 0.5;
const PADDLE_SPEED = 0.6;
const BLOCK_ROWS = 6;  
const BLOCK_COLS = 10;  
const BLOCK_WIDTH = 70;
const BLOCK_HEIGHT = 25;
const BLOCK_PADDING = 5;
const BLOCK_OFFSET_TOP = 75;
const BLOCK_OFFSET_LEFT = 28;
const ROW_COLORS = ["#e74c3c", "#f79948", "#f1c40f", "#2ecc71", "#3498db", "#5d209b"]; //colors for each row of blocks
const BONUS_BALL_DURATION = 15000; //duration in ms that bonus balls stay alive
//*class for the blocks
class Block extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color, "block");
        this.destroy = false;  //flag to mark if a block has been hitted
        this.points = 2;  //base points per block
    } 
}
//*class for the game ball
class Ball extends GameObject {  
    constructor(position, width, height, color, isBonus = false) {
        super(position, width, height, color, "ball");
        this.velocity = new Vector(0, 0);  //velocity vector
        this.active = false;  //ball only moves after launch
        this.isBonus = isBonus;  //whether this is a temporary bonus ball
        this.lifeTimer = 0;  //tracks time alive for bonus balls
    }

    launch() { //?launch at a random upward angle
        const angle = (Math.random() * Math.PI / 3) - (Math.PI / 6);
        //convert the angle into a cartesian vector
        this.velocity.x = Math.cos(angle);
        //choose a random direction
        if (Math.random() > 0.5) {
            this.velocity.x *= -1;
        }
        this.velocity.y = -Math.abs(Math.sin(angle)) - 0.6;  //-Math.abs will always give a negative number, meaning the ball always goes upward
        //0.6 will give you a little impulse upward for those cases where the angle is flat
        this.active = true;  //used for update
    }

    update(deltaTime) {
        if (!this.active) return;  //case1: the player hasn't started the game

        if (this.isBonus) {  //case2: bonus balls
            this.lifeTimer += deltaTime;  //accumulate time alive
        }

        const speed = this.isBonus ? BALL_SPEED * 0.5 : BALL_SPEED;  //bonus balls slightly slower
        this.velocity = this.velocity.normalize().times(speed);  //normalize: same the direction, 
        this.position = this.position.plus(this.velocity.times(deltaTime));  //moves the ball
    }

    isExpired() {
        return this.isBonus && this.lifeTimer >= BONUS_BALL_DURATION;  //?check if bonus time ran out
    }

    reset(startX, startY) {
        this.position = new Vector(startX, startY);  //starting point
        this.velocity = new Vector(0, 0);
        this.active = false;  //the player hasn't started the game
        this.lifeTimer = 0;  
    }
}
//*class for the paddle
class Paddle extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color, "paddle");
        this.velocity = new Vector(0, 0);  //velocity vector
        this.motion = {  //movement of the paddle
            left: {
                    axis: "x", 
                    sign: -1 },
            right: { 
                    axis: "x", 
                    sign: 1 },
        };
        this.keys = [];  //keys pressed to move the player
    }

    update(deltaTime) {
        //restart the velocity
        this.velocity.x = 0;
        this.velocity.y = 0;
        //modify the velocity according to the directions pressed
        for (const dir of this.keys) {
            const axis = this.motion[dir].axis;
            const sign = this.motion[dir].sign;
            this.velocity[axis] += sign;
        }
        this.velocity = this.velocity.normalize().times(PADDLE_SPEED);  //normalize the velocity to avoid greater speed on diagonals
        this.position = this.position.plus(this.velocity.times(deltaTime));
        this.clampWithinCanvas();
    }

    clampWithinCanvas() {
        //?left border
        if (this.position.x - this.halfSize.x < 0) {
            this.position.x = this.halfSize.x;  
        }
        //?right border
        if (this.position.x + this.halfSize.x > canvasWidth) {
            this.position.x = canvasWidth - this.halfSize.x;  
        }
    }
}
//*class to keep track of all the events and objects in the game
class Game {
    constructor() {
        this.createEventListeners();
        this.initObjects();

        this.lives = 3;  //lives per run
        this.score = 0;  //initialize score
        this.blocksDestroyed = 0;  //initialize blocks destroyed
        this.totalBlocks = BLOCK_ROWS * BLOCK_COLS;  
        this.state = "playing";  //states to know in which part the player is

        this.bonusBalls = [];  //array for temporary extra balls
        this.lastBonusScore = 0;  //tracks last score where bonus was triggered
        this.bonusMessageTimer = 0;  //how long to show bonus message
        this.bonusMessage = "";
    }

    initObjects() {
        //?add another object to draw a background
        this.background = new GameObject(new Vector(canvasWidth / 2, canvasHeight / 2), canvasWidth, canvasHeight);
        this.background.setSprite("assets/sprites/Download premium vector of Geometrical patterned blue scifi background vector by Aum about background, technology, technology backgrounds, neon, and dark blue background 2340052.jpg");

        this.paddle = new Paddle(
            new Vector(canvasWidth / 2, canvasHeight - 40), 100, 15, "#ecf0f1"
        );

        this.ball = new Ball(
            new Vector(canvasWidth / 2, canvasHeight - 60), 12, 12, "#f0f0f0"
        );

        //?ui labels details
        this.scoreLabel = new TextLabel(20, 38, "18px 'Courier New'", "#ffffff");
        this.livesLabel = new TextLabel(canvasWidth / 2 - 70, 38, "18px 'Courier New'", "#ffffff");
        this.blocksLabel = new TextLabel(canvasWidth - 150, 38, "18px 'Courier New'", "#ffffff");
        this.messageLabel = new TextLabel(canvasWidth / 2, canvasHeight / 2, "36px 'Courier New'", "#ffffff");  
        this.subMessageLabel = new TextLabel(canvasWidth / 2, canvasHeight / 2 + 50, "20px 'Courier New'", "#aaaaaa");
        this.bonusLabel = new TextLabel(canvasWidth / 2, canvasHeight / 2, "22px 'Courier New'", "#f39c12");
        this.timerLabel = new TextLabel(canvasWidth / 2 - 80, canvasHeight / 2 + 30, "18px 'Courier New'", "#f39c12");

        this.buildBlocks();
    }

    buildBlocks() {
        this.blocks = [];  //array to save the blocks

        for (let row = 0; row < BLOCK_ROWS; row++) {  //for each row
            for (let col = 0; col < BLOCK_COLS; col++) {  //for each col
                const x = BLOCK_OFFSET_LEFT + col * (BLOCK_WIDTH + BLOCK_PADDING) + BLOCK_WIDTH / 2;  
                const y = BLOCK_OFFSET_TOP + row * (BLOCK_HEIGHT + BLOCK_PADDING) + BLOCK_HEIGHT / 2;
                const color = ROW_COLORS[row % ROW_COLORS.length];  //every row diff color
                const block = new Block(new Vector(x, y), BLOCK_WIDTH, BLOCK_HEIGHT, color);  //create block
                this.blocks.push(block);  //add block to the array
            }
        }
    }

    spawnBonusBalls() {
        //?add 2 bonus balls when score hits a multiple of 15 blocks destroyed
        for (let i = 0; i < 2; i++) {  //two times for 2 balls
            const offsetX = (i === 0) ? -30 : 30;  //spread them slightly apart, 1st ball -30, 2nd ball 30
            const bonus = new Ball(
                new Vector(this.paddle.position.x + offsetX, canvasHeight - 70), 10, 10, "#f39c12", true  //orange color for bonus balls
            );
            bonus.launch();
            this.bonusBalls.push(bonus);
        }

        this.bonusMessage = "MULTI BALLS FOR 15 sec";
        this.bonusMessageTimer = 2500;  //show message for 2.5 seconds
    }

    checkBonusTrigger() {  //?trigger bonus every 15 blocks destroyed
        if (this.blocksDestroyed > 0 && this.blocksDestroyed % 15 === 0) {
            this.spawnBonusBalls();
        }
    }

    handleBallBlockCollision(ball) {
        for (const block of this.blocks) {  //all active blocks
            if (block.destroy) continue;  //case1: destroyed block

            if (boxOverlap(ball, block)) {
                block.destroy = true; 
                this.blocksDestroyed++;
                this.score += block.points;

                this.checkBonusTrigger();

                //figure out which side the ball hit to bounce correctly
                const ballL = ball.position.x - ball.halfSize.x;  //left
                const ballR = ball.position.x + ball.halfSize.x;  //right
                const ballT = ball.position.y - ball.halfSize.y;  //top
                const ballB = ball.position.y + ball.halfSize.y;  //below
                const bkL = block.position.x - block.halfSize.x;  //left
                const bkR = block.position.x + block.halfSize.x;  //right
                const bkT = block.position.y - block.halfSize.y;  //top
                const bkB = block.position.y + block.halfSize.y;  //below

                const overlapLeft = ballR - bkL;
                const overlapRight = bkR - ballL;
                const overlapTop = ballB - bkT;
                const overlapBottom = bkB - ballT;

                const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);  //first hit

                if (minOverlap === overlapTop || minOverlap === overlapBottom) {
                    ball.velocity.y *= -1;  //bounce vertically
                } else {
                    ball.velocity.x *= -1;  //bounce horizontally
                }

                break;  //only one block collision per frame per ball
            }
        }

        this.blocks = this.blocks.filter(b => !b.destroy);  //?all blocks with destroy == false

        if (this.blocks.length === 0) {
            this.state = "win";  //condition to win screen
        }
    }

    handleWallCollisions(ball) {
        //left wall
        if (ball.position.x - ball.halfSize.x <= 0) {
            ball.position.x = ball.halfSize.x;
            ball.velocity.x *= -1;
        }
        //right wall
        if (ball.position.x + ball.halfSize.x >= canvasWidth) {
            ball.position.x = canvasWidth - ball.halfSize.x;
            ball.velocity.x *= -1;
        }
        //top wall
        if (ball.position.y - ball.halfSize.y <= 0) {
            ball.position.y = ball.halfSize.y;
            ball.velocity.y *= -1;
        }
    }

    handlePaddleCollision(ball) {
        if (boxOverlap(ball, this.paddle)) {
            ball.position.y = this.paddle.position.y - this.paddle.halfSize.y - ball.halfSize.y;  //stop bug with paddle

            //angle depends on where the ball hits the paddle
            const hitPos = (ball.position.x - this.paddle.position.x) / this.paddle.halfSize.x;  //position of the paddle, 0 for center
            const angle = hitPos * (Math.PI / 3);  //max 60 degrees 
            const speed = ball.velocity.magnitude();  //anglo -> vector
            ball.velocity.x = Math.sin(angle) * speed;
            ball.velocity.y = -Math.abs(Math.cos(angle) * speed);  //always bounce upward
        }
    }

    update(deltaTime) {
        if (this.state !== "playing") return;

        this.paddle.update(deltaTime);

        //?update bonus message timer
        if (this.bonusMessageTimer > 0) {
            this.bonusMessageTimer -= deltaTime;
        }

        //?main ball logic
        if (this.ball.active) {
            this.ball.update(deltaTime);
            this.handleWallCollisions(this.ball);
            this.handlePaddleCollision(this.ball);
            this.handleBallBlockCollision(this.ball);

            //?ball fell below screen
            if (this.ball.position.y - this.ball.halfSize.y > canvasHeight) {
                this.lives--;
                if (this.lives <= 0) {
                    this.state = "gameover";
                } else {
                    this.ball.reset(canvasWidth / 2, canvasHeight - 60);  //respawn above paddle
                }
            }
        }

        //?bonus balls logic
        for (let i = this.bonusBalls.length - 1; i >= 0; i--) {
            const bb = this.bonusBalls[i];
            bb.update(deltaTime);
            this.handleWallCollisions(bb);
            this.handlePaddleCollision(bb);
            this.handleBallBlockCollision(bb);

            //?remove if expired or fell below screen
            if (bb.isExpired() || bb.position.y - bb.halfSize.y > canvasHeight) {
                this.bonusBalls.splice(i, 1);
            }
        }
    }

    drawScreen(ctx) {
        this.scoreLabel.draw(ctx, `SCORE: ${this.score}`);
        this.livesLabel.draw(ctx, `LIVES: ${"♡ ".repeat(this.lives).trim()}`);
        this.blocksLabel.draw(ctx, `BLOCKS: ${this.blocksDestroyed}/${this.totalBlocks}`);

        //?show timer for active bonus balls
        if (this.bonusBalls.length > 0) {
            const remaining = Math.ceil((BONUS_BALL_DURATION - this.bonusBalls[0].lifeTimer) / 1000);
            this.timerLabel.draw(ctx, `MULTI BALL: ${remaining}sec`);
        }

        //?show bonus triggered message
        if (this.bonusMessageTimer > 0) {
            ctx.save();
            ctx.textAlign = "center";
            this.bonusLabel.draw(ctx, this.bonusMessage);
            ctx.restore();
        }
    }

    drawOverlay(ctx, title, subtitle) {
        //?semi-transparent overlay for game over / win
        ctx.fillStyle = "rgba(0,0,0,0.60)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx.save();
        ctx.textAlign = "center";

        ctx.font = "48px 'Courier New'";
        ctx.fillStyle = title === "GAME OVER" ? "#e74c3c" : "#2ecc71";  //if game over screen is needed, the letters will be red
        //logic managed on draw
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
        this.background.draw(ctx);  //?draw the background first, so everything else is drawn on top

        for (const block of this.blocks) {  //?draw all blocks
            block.draw(ctx);
        }

        this.paddle.draw(ctx);
        this.ball.draw(ctx);

        for (const bb of this.bonusBalls) {  //?draw bonus balls
            bb.draw(ctx);
        }

        this.drawScreen(ctx);

        if (this.state === "gameover") {
            this.drawOverlay(ctx, "GAME OVER", "press R to restart");
        } else if (this.state === "win") {
            this.drawOverlay(ctx, "YOU WIN!", "press R to restart");
        }

        //?launch hint when player hasn't started the game
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
                event.preventDefault();  //prevent page scroll on space
            }
            if (event.key === 'r' || event.key === 'R') {
                if (this.state !== "playing") {
                    restartGame();  //restart from main
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


function restartGame() {  //?when player wins or looses
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