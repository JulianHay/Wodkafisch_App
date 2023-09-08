const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth*0.5;
canvas.height = canvas.width*0.5;
let score = 0;
let gameFrame = 0;
let gameOver = false;
let gameSpeed = 1;
ctx.font = '50px Georgia';

// Mouse interactivity
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
}
canvas.addEventListener('mousemove', function(e){
    var canvasPosition = canvas.getBoundingClientRect();
    var scaleX = canvas.width / canvasPosition.width;
    var scaleY = canvas.height / canvasPosition.height;
    mouse.click = true;
    mouse.x = (e.x - canvasPosition.left) * scaleX;
    mouse.y = (e.y - canvasPosition.top) * scaleY;
});
window.addEventListener('mouseup', function(e){
    mouse.click = false;
});

// Player
const playerLeft = new Image();
playerLeft.src = 'static/images/wodkafish-swim-left.png';
const playerRight = new Image();
playerRight.src = 'static/images/wodkafish-swim-right.png';

class Player {
    constructor(){
        this.x = canvas.width;
        this.y = canvas.height/2;
        this.radius = 50;
        //this.height = 20;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 160;
        this.spriteHeight = 127.3;
    }
    update(){
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        if (mouse.x != this.x){
            this.x -= dx/20;
            this.moving = true;
        }
        if (mouse.y != this.y){
            this.y -= dy/20;
            this.moving = true;
        }
        if (this.x < 0) this.x = 0;
        if (this.x > canvas.width) this.x = canvas.width;
        if (this.y < 50) this.y = 50;
        if (this.y > canvas.height) this.y = canvas.height;
        let theta = Math.atan2(dy,dx);
        this.angle = theta;
    }
    draw(){
        if (mouse.click){
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
        if (gameFrame % 10 == 0) {
            this.frame++;
            if (this.frame >= 12) this.frame = 0;
            if ( this.frame == 3 ||  this.frame == 7 ||  this.frame == 11) {
                this.frameX = 0;
            } else this.frameX++;
            if (this.frame < 3){
                this.frameY = 0;
            } else if (this.frame < 7){
                this.frameY = 1;
            } else if (this.frame < 11){
                this.frameY = 2;
            } else this.frameY = 0;
        }
      
        ctx.fillStyle = 'black';
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        /*ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 360);
        ctx.fill();*/
        if (this.x >= mouse.x){
            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 65, 0 - 55, this.spriteWidth * 0.8, this.spriteHeight * 0.8);
        } else {
            ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 65, 0 - 45, this.spriteWidth * 0.8, this.spriteHeight * 0.8);
        }
        ctx.restore();
    }
}
const player = new Player();

// Bubbles
const bubblesArray = [];
const bubble = new Image();
bubble.src = 'static/images/kalmar.png';
class Bubble {
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = 0 - 50 - Math.random() * canvas.height/2;
        this.radius = 50;
        this.angle = 0.2//(Math.random()-0.5)*0.1
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
        this.frameX = 0;
        this.spriteWidth = 23.734;
        this.spriteHeight = 63.227;
        this.pop = false;
        this.counted = false;
    }
    update(){
        this.y += this.speed//*Math.sin(this.angle)
        //this.x += this.speed*Math.cos(this.angle)
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }
    draw(){
      
        /*ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();*/
        //ctx.save();
        //ctx.translate(this.x, this.y);
        //ctx.translate(this.spriteWidth*0.5,this.spriteHeight*0.5)
        //ctx.rotate(this.angle);
        ctx.drawImage(bubble, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x -17, this.y - 48, this.spriteWidth*1.5, this.spriteHeight*1.5);
        //ctx.translate(-this.spriteWidth*0.5,-this.spriteHeight*0.5)
        //ctx.restore();
    }
}
function handleBubbles(){
    for (let i = 0; i < bubblesArray.length; i++){
        if (bubblesArray[i].y > canvas.height * 2){
            bubblesArray.splice(i, 1);
        }
    }
    for (let i = 0; i < bubblesArray.length; i++){
        if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius){
            popAndRemove(i);
        }
    }
    for (let i = 0; i < bubblesArray.length; i++){
        bubblesArray[i].update();
        bubblesArray[i].draw();
    }
    if (gameFrame % 50 == 0) {
        bubblesArray.push(new Bubble());

    }
}
function popAndRemove(i){
    if (bubblesArray[i]) {
        if (!bubblesArray[i].counted) score++;
        bubblesArray[i].counted = true;
        bubblesArray[i].frameX++;
        if (bubblesArray[i].frameX > 15) bubblesArray[i].pop = true;
        if (bubblesArray[i].pop) bubblesArray.splice(i, 1);
        requestAnimationFrame(popAndRemove);
    }
}

// Enemy
const enemyLeft = new Image();
enemyLeft.src = 'static/images/shark_swimming_left.png';
const enemyRight = new Image();
enemyRight.src = 'static/images/shark_swimming_right.png';
const enemyLeftJaw = new Image();
enemyLeftJaw.src = 'static/images/shark_swimming_left_jaw.png';
const enemyRightJaw = new Image();
enemyRightJaw.src = 'static/images/shark_swimming_right_jaw.png';
class Enemy {
    constructor(){
    		this.direction_left = Math.random() < 0.5 ? true : false;
        this.x = this.direction_left ? 200+canvas.width : -200;
        this.y = (0.2+0.8*Math.random()) * canvas.height/2;
        this.radius = 50;
        this.speed = (Math.random()*2)+2;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 634/4;//153.8;//160.5;
        this.spriteHeight = 295/3;//95.7;//98;
        this.scale = 1;
        this.width = this.spriteWidth * this.scale;
        this.height = this.spriteHeight * this.scale;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
        this.distance;
        this.d_ellipse = 1000;
    }
    update(){
    		
				this.x = this.direction_left ? this.x - this.speed : this.x + this.speed;
				/*
				this.x = 200;//canvas.width/2;//
				this.y = canvas.height/2;
                */

				if (this.direction_left){
					if (this.x < -200){
						this.direction_left = Math.random() < 0.5 ? true : false;
						this.x = this.direction_left ? 200+canvas.width : -200;
						this.y = (0.2+0.8*Math.random()) * canvas.height/2;
						this.speed = (Math.random()*2)+2;
					}
					}else {
						if (this.x > canvas.width + 200){
							this.direction_left = Math.random() < 0.5 ? true : false;
							this.x = this.direction_left ? 200+canvas.width : -200;
        			        this.y = (0.2+0.8*Math.random()) * canvas.height/2;
							this.speed = (Math.random()*2)+2;
						}
				}
				
                const dx = player.x - this.x;
                const dy = player.y - this.y;

                this.distance = Math.sqrt(dx * dx + dy * dy);
                //if (this.distance < this.radius + player.radius){
                //if (RectCircleColliding({x:player.x,y:player.y,r:player.radius},{x:this.x-(this.spriteWidth-20)/2,y:this.y-(this.spriteHeight-20)/2,w:this.spriteWidth-20,h:this.spriteHeight-20})){

                // detect collision: distance ellipse circle
                const angle = Math.atan2(dy,dx);

                const tt = Math.tan(angle) * (this.width)/2 / (this.height)/2;
                const d = 1 / Math.sqrt(1. + Math.pow(tt, 2));
                const x = this.x + (this.width)/2 * d * Math.sign(Math.cos(angle));
                const y = player.x < this.x ? this.y - (this.height)/2 * tt * d : this.y + (this.height)/2 * tt * d;
                this.d_ellipse = Math.sqrt(Math.pow(player.x - x, 2) + Math.pow(player.y - y, 2));

                /*ctx.fillStyle = 'green';
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 360);
                ctx.fill();
                ctx.closePath();
                ctx.beginPath();
                ctx.arc(player.x, player.y, 5, 0, Math.PI * 360);
                ctx.fill();
                ctx.closePath();
                ctx.beginPath();
                ctx.arc(this.x, this.y, 5, 0, Math.PI * 360);
                ctx.fill();
                ctx.closePath();

                ctx.fillStyle = 'rgba(34,147,214,1)';
                ctx.font = '20px Georgia';
                ctx.fillText('distance: ' + Math.round(distance,2), 141, 120);
                ctx.fillText('collision: ' + distance <= player.radius, 141, 130);

                const x_ellipse= (this.width)/2 * Math.cos(angle);
                const y_ellipse = (this.height)/2 * Math.sin(angle);
                this.d_ellipse = Math.sqrt(x_ellipse*x_ellipse+y_ellipse*y_ellipse);*/


                if (this.d_ellipse <= player.radius-5){
                        handleGameOver();
                }
    }
    draw(){     
        ctx.fillStyle = 'black';
        ctx.save();
        //ctx.translate(this.x, this.y);
        //ctx.rotate(this.angle);
        /*ctx.beginPath();
        //ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 360);
        ctx.rect(this.x-(this.width)/2, this.y-(this.height)/2, this.width, this.height)
        //ctx.fill();
	    ctx.fill();
        ctx.closePath();
        //drawEllipse(this.x, this.y, this.spriteWidth+10+player.radius, this.spriteHeight-20+player.radius,'blue')
        //drawEllipse(this.x, this.y, this.width, this.height, 'red')
        */
        const offset_x = 81;
        const offset_y = 48
        if (this.d_ellipse <= player.radius+100){
						if (this.direction_left){
		            ctx.drawImage(enemyLeftJaw, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - offset_x, this.y - offset_y, this.spriteWidth * this.scale, this.spriteHeight * this.scale);
		        } else {
		            ctx.drawImage(enemyRightJaw, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - offset_x, this.y - offset_y, this.spriteWidth * this.scale, this.spriteHeight * this.scale);
		        }
        } else{
		        if (this.direction_left){
		            ctx.drawImage(enemyLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - offset_x, this.y - offset_y, this.spriteWidth * this.scale, this.spriteHeight * this.scale);
		        } else {
		            ctx.drawImage(enemyRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - offset_x, this.y - offset_y, this.spriteWidth * this.scale, this.spriteHeight * this.scale);
		        }
	      }
        //ctx.restore();
        
        if (gameFrame % 10 == 0) {
            this.frame++;
            if (this.frame >= 10) this.frame = 0;
            if ( this.frame == 3 ||  this.frame == 7 ||  this.frame == 9) {
                this.frameX = 0;
            } else this.frameX++;
            if (this.frame < 3){
                this.frameY = 0;
            } else if (this.frame < 7){
                this.frameY = 1;
            } else if (this.frame < 9){
                this.frameY = 2;
            } else this.frameY = 0;
        }
     		
    }
}

const enemy1 = new Enemy();

function handleEnemy(){
		enemy1.draw();	
		enemy1.update();	
}

function drawEllipse(centerX, centerY, width, height, color) {

  ctx.beginPath();

  ctx.moveTo(centerX, centerY - height / 2); // A1

  ctx.bezierCurveTo(
    centerX + width / 2, centerY - height / 2, // C1
    centerX + width / 2, centerY + height / 2, // C2
    centerX, centerY + height / 2); // A2

  ctx.bezierCurveTo(
    centerX - width / 2, centerY + height / 2, // C3
    centerX - width / 2, centerY - height / 2, // C4
    centerX, centerY - height / 2); // A1

  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function RectCircleColliding(circle,rect){
    var distX = Math.abs(circle.x - rect.x-rect.w/2);
    var distY = Math.abs(circle.y - rect.y-rect.h/2);

    if (distX > (rect.w/2 + circle.r)) { return false; }
    if (distY > (rect.h/2 + circle.r)) { return false; }

    if (distX <= (rect.w/2)) { return true; } 
    if (distY <= (rect.h/2)) { return true; }

    var dx=distX-rect.w/2;
    var dy=distY-rect.h/2;
    return (dx*dx+dy*dy<=(circle.r*circle.r));
}

function handleGameOver(){
			//ctx.fillStyle = 'white';
			//var x = document.createElement("INPUT");
			//x.setAttribute("type", "text");
			//const username = prompt("GAME OVER! Your score: " + score +  "Please enter your name:");
			//ctx.fillText('GAME OVER your score: ' + score,130,250);
            document.getElementById("submitForm").style.display = "block";
            //document.getElementById("submitForm").style.marginTop = -canvas.width/2+"px";
            document.getElementById("score").value = score;
			gameOver = true;
}


/**** BUBBLE TEXT ***/ 
let bubbleTextArray = [];
let adjustX = -10;
let adjustY = -3;
ctx.fillStyle = 'white';
ctx.font = '13px Verdana';
ctx.fillText('Wodkafisch', canvas.width/41,canvas.height/12);//25, 42);
//ctx.font = '19px Verdana';
//ctx.fillText('TEXT', 36, 49);
const textCoordinates = ctx.getImageData(0, 0, 100, 100);

class Particle2 {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.size = 7;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 15) + 1;
        this.distance;
    }
    draw() {
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(34,147,214,1)';
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.beginPath();
        if (this.distance < 50){
            this.size = 14;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(this.x + 4, this.y -4, this.size/3, 0, Math.PI * 2);
            ctx.arc(this.x -6, this.y -6, this.size/5, 0, Math.PI * 2);
        } else if (this.distance <= 80){
            this.size = 8;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(this.x + 3, this.y -3, this.size/2.5, 0, Math.PI * 2);
            ctx.arc(this.x -4, this.y -4, this.size/4.5, 0, Math.PI * 2);
        }
        else {
            this.size = 5;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(this.x + 1, this.y -1, this.size/3, 0, Math.PI * 2);
        }
        ctx.closePath();
        ctx.fill()
    }
    update(){
        let dx = player.x - this.x;
        let dy = player.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        this.distance = distance;
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = 100;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < 100){
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX){
                let dx = this.x - this.baseX;
                this.x -= dx/20;
            }
            if (this.y !== this.baseY){
                let dy = this.y - this.baseY;
                this.y -= dy/20;
            }
        }
    }
}

function init2() {
    bubbleTextArray = [];
    for (let y = 0, y2 = textCoordinates.height; y < y2; y++){
        for (let x = 0, x2 = textCoordinates.width; x < x2; x++){
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128){
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                bubbleTextArray.push(new Particle2(positionX * 8, positionY * 8));
            }
        }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < bubbleTextArray.length; i++){
        bubbleTextArray[i].draw();
        bubbleTextArray[i].update();
    }
}
init2();
/** bubble text end **/

// animation loop
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < bubbleTextArray.length; i++){
        bubbleTextArray[i].draw();
        bubbleTextArray[i].update();
    }
    handleBubbles();
    player.update();
    player.draw();
    handleEnemy();
    ctx.fillStyle = 'rgba(34,147,214,1)';
    ctx.font = '20px Georgia';
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText('score: ' + score, 141, 336);
    ctx.fillStyle = 'rgba(34,147,214,1)';
    ctx.fillText('score: ' + score, 140, 335);
    gameFrame += 1;
    if (!gameOver) requestAnimationFrame(animate);
}

function start_game(){
    start_btn = document.getElementById("startGame");
    start_btn.style.display = "none";
    animate();
}


window.addEventListener('resize', function(){
  canvasPosition = canvas.getBoundingClientRect();
  mouse.x = canvas.width/2;
  mouse.y = canvas.height/2;
});
