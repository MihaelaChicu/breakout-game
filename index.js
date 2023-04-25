const grid = document.querySelector('.grid');//looking for the class of grid
const scoreDisplay = document.querySelector('#score');
const blockWidth = 100;
const blockHeight = 20;
const boardWidth = 560;
const boardHeight = 300;
const ballDiameter = 20; //thats the width and height we gave it
let timerId;
let xDirection = 2;
let yDirection = 2;
let score = 0;

const userStart = [230, 10];
let currentPosition = userStart;

const ballStart = [270, 40]
let ballCurrentPosition = ballStart;

// create Block individual
class Block {
    constructor(xAxis, yAxis) {//this is gonna be the bottom left of our block
        //using this bottom left x and y axis,I can decipher all 4 points of my block and where they r on my grid, using the width of the block
        this.bottomLeft = [xAxis, yAxis]; //whatever we pass into our block constructor is gonna be the bottom left of our block
        this.bottomRight = [xAxis + blockWidth, yAxis];
        this.topLeft = [xAxis, yAxis + blockHeight];
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
    }
}

// all my blocks
const blocks = [
    new Block(10, 270),
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),
    new Block(10, 240),
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(450, 240),
    new Block(10, 210),
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210),
    new Block(450, 210),
]


// draw all my blocks
function addBlocks() {
    for (let i = 0; i < blocks.length; i++) { //we want to loop over our blocks array and keep creating these blocks
        const block = document.createElement('div'); //create the block
        block.classList.add('block');//give it the characteristics of the css block element
        block.style.left = blocks[i].bottomLeft[0] + 'px'; //get first item of the blocks array -> xAxis - 10
        block.style.bottom = blocks[i].bottomLeft[1] + 'px';
        grid.appendChild(block);//use method to put in our newly created block to the grid, with the style of block
    }

}

addBlocks(); //everytime we call this function, we will create a block

// add user
const user = document.createElement('div');
user.classList.add('user');
drawUser();
grid.appendChild(user);


// draw the user
function drawUser() {
    user.style.left = currentPosition[0] + 'px';
    user.style.bottom = currentPosition[1] + 'px';
}

// draw the ball
function drawBall() {
    ball.style.left = ballCurrentPosition[0] + 'px';
    ball.style.bottom = ballCurrentPosition[1] + 'px';
}

// move user
function moveUser(e) {
    switch (e.key) {
        case "ArrowLeft":
            if (currentPosition[0] > 0) { //as long as our user is at a position > 0, which is the limit left, otherwise we stop
                currentPosition[0] -= 10; //we're gonna move the x axis of our current position 10
                drawUser();//We're gonna move the x y position and redraw the user
            }
            break;
        case "ArrowRight":
            if (currentPosition[0] < boardWidth - blockWidth) {
            currentPosition[0] += 10; //we're gonna move the x axis of our current position 10
            drawUser();//We're gonna move the x y position and redraw the user
            }
            break;
    }
}

document.addEventListener('keydown', moveUser)//listen when I press keydown on my keyboard and invoke thie moveUser function and see if the key is ArrowLeft

// add ball
const ball = document.createElement('div');
ball.classList.add('ball');
drawBall();
grid.appendChild(ball); //-grid(parent), we are putting the ball inside the parent



// move the ball
   function moveBall() {
     ballCurrentPosition[0] += xDirection;
     ballCurrentPosition[1] += yDirection;
     drawBall();
     checkForCollisions();
   }



   //we have to clear this timerId when we want the ball to stop
   timerId = setInterval(moveBall, 30);


   //When it hits the wall, it bounces back , check for collision
   function checkForCollisions() {
    //check for block collisions
      for(let i = 0; i < blocks.length; i++){
        //check if the ball is in between the blocks bottom left x axis & bottom right x axis so the bottom width & height 
        // if it's in there, we know its a collision, and we need to loop over every block
         if(
            (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
            ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1]) //if the ball y position is smaller than the 
         ) { //if all of the above is true, we know the ball is in the area of the block, we want to remove the block
            const allBlocks = Array.from(document.querySelectorAll('.block')); //we take the block via query selector all and we make it an array with Array.from
            allBlocks[i].classList.remove('block');//now were gonna go in the array of blocks wherever i is, cuz we're looping (so whatever block we're dealing with)
                         //and remove the block class, visually
            blocks.splice(i, 1);////to remove it completely, we need to remove it from the blocks array with slice - remove i, that 1 block
            changeDirection(); //once we removed it, we need to changeDirection
            score++;
            scoreDisplay.innerHTML = score;

            //check for win
            if(blocks.length === 0){
              scoreDisplay.innerHTML = "YOU WIN";
              clearInterval(timerId); //stop the game
              document.removeEventListener('keydown', moveUser)
            }
         }


      }

    //check for wall collisions
    if(ballCurrentPosition[0] >= (boardWidth - ballDiameter) || 
       ballCurrentPosition[1] >= (boardHeight - ballDiameter) ||
       ballCurrentPosition[0] <= 0
       ) {//if it's larger, we know its off the grid so we need to change direction
      changeDirection();
    }

    //check for user collision
    if(
    (ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth) && //check to see if ball is on the user block
    (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeight) //if the 2 are in the same space
    ) {
      changeDirection();
    }


    //check for game over
    if(ballCurrentPosition[1] <= 0) {
      clearInterval(timerId); //we want to stop the ball
      scoreDisplay.innerHTML = 'You lose';
      document.removeEventListener('keydown', moveUser); //so we cant move the user anymore
    }

   }

   function changeDirection(){ //our ball is moving +2 x, +2 y
     if(xDirection === 2 && yDirection === 2){  //so if the ball is moving to the top right corner of our grid
       yDirection = -2; //change direction
       return;
     }
     if(xDirection === 2 && yDirection === -2){  
        xDirection = -2; 
        return;
      }
      if(xDirection === -2 && yDirection === -2){  
        yDirection = 2; 
        return;
      }
      if(xDirection === -2 && yDirection === 2){  
        xDirection = 2; 
        return;
      }
   }




