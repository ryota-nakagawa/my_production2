var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 3;
var dy = -3;
const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 100;
const brickRowCount = 8;
const brickColumnCount = 8;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 20;
let rightPressed = false;
let leftPressed = false;
let paddleX = (canvas.width - paddleWidth) / 2;
var score = 0;
var lives = 3;
var startTime;
var currentTime;
var time;
var output_score = document.getElementById("score");
var output_time = document.getElementById("time");
var bricks_count = 0;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("keypress", keyEnterPress);

var bricks = [];
for(let i = 0; i < brickColumnCount; i++){
    bricks[i] = [];
    for (let j = 0; j < brickRowCount; j++){
        if (0 <= i && i <= 3){
            if (3 - i <= j && j <= i + 4 ){
                bricks[i][j] = {x:0, y:0, status:1};
                bricks_count++;
            }else{
                bricks[i][j] = {x:0, y:0, status:0};
            }
        }else if(4 <= i && i <= 7){
            if(i - 4 <= j && j <= 11 - i){
                bricks[i][j] = {x:0, y:0, status:1};
                bricks_count++;
            }else{
                bricks[i][j] = {x:0, y:0, status:0};
            }
        }
    }
}

function drawBricks(){
    for (let i = 0; i < brickColumnCount; i++){
        for(let j = 0; j < brickRowCount; j++){
            if(bricks[i][j].status === 1){
                var brickX = i * (brickWidth + brickPadding) + brickOffsetLeft;
                var brickY = j * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[i][j].x = brickX;
                bricks[i][j].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                if ((i == 2 && j == 2)||(i == 5 && j == 2)||(i == 3 && j == 4)||(i == 4 && j == 4)){
                    ctx.fillStyle = "#BB0000";
                }else{
                    ctx.fillStyle = "#FF00FF";
                }
                ctx.fill()
                ctx.closePath();
            }
        }
    }
}

function ball(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#ffa500";
    ctx.fill();
    ctx.closePath();
}

function paddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function keyDownHandler(e){
    if(e.key === "Right" || e.key === "ArrowRight"){
        rightPressed = true;
    }else if(e.key === "Left" || e.key === "ArrowLeft"){
        leftPressed = true;
    }
}

function keyUpHandler(e){
    if(e.key === "Right" || e.key === "ArrowRight"){
        rightPressed = false;
    }else if(e.key === "Left" || e.key === "ArrowLeft"){
        leftPressed = false;
    }
}

function keyEnterPress(e){
    if(e.key === "Enter"){
        Start();
    }
    return false;
}

function collisionJudge(){
    for(let i = 0; i < brickColumnCount; i++){
        for(let j = 0; j < brickRowCount; j++){
            var b = bricks[i][j];
            if (b.status == 1){
                if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight){
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == bricks_count){
                        alert(
                            `FINISH!\n\nPlay time : ${time} seconds\n\nScore : ${score}(/${bricks_count})`
                        )
                        location.href = "./result1.html";
                    }
                }
            }
        }
    }
}

function Score(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Score: ${score}(/${bricks_count})`, 8, 20)
}

function Lives(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Lives:${lives}`, canvas.width - 65, 20);
}

function Times(){
    currentTime = new Date();
    time = Math.trunc((currentTime - startTime)/1000);
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`${time} seconds`, canvas.width/2, 20);
}

function drawObjects(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    ball();
    paddle();
    Score();
    Lives();
    collisionJudge();
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    ball();
    paddle();
    Score();
    Lives();
    Times();
    collisionJudge();
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius){
        dx = -dx;
    }
    if (y + dy < ballRadius){
        dy = -dy;
    }else if(y + dy > canvas.height - ballRadius){
        if(x > paddleX && x < paddleX + paddleWidth){
            if(y = y - paddleHeight){
                dy = -dy;
            }
        }else{
            lives--;
            if (!lives){
                alert(
                    `FINISH!\n\nPlay time : ${time} seconds\n\nScore : ${score}(/${bricks_count})`
                );
                location.href = "./result2.html";
            }else{
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 3;
                dy = -3;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }
    if(rightPressed && paddleX < canvas.width - paddleWidth){
        paddleX += 10;
    }else if(leftPressed && paddleX > 0){
        paddleX -= 10;
    }
    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

function Start(){
    startTime = new Date();
    draw()
}

drawObjects();
