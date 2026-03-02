/*******************************************************/
// game Play
/*******************************************************/

/*******************************************************/
// setup()

//VARIABLES

//world setup variables
var gameSpeed = 60;
var 

//player movement variables
var playerVel = 5;
var playerScale = 40;




//Enemy spawning variables

//var randomYvalue = random

/*******************************************************/
function setup() {
	console.log("setup: ");

	//set game speed
	frameRate(gameSpeed);

	//draw the canvas
	cnv = new Canvas(windowWidth - 20, windowHeight - 20);

	//create the player charcter
	player = new Sprite(windowWidth / 2, windowHeight / 2, playerScale, playerScale);

}


/*******************************************************/
// draw()
/*******************************************************/
function draw() {

	//color the bg
	background('grey');


	//player movement script

	//LEFT
	if (kb.pressing('left')) {
		player.vel.x = playerVel * -1;
	}
	else if (kb.released('left')) {
		player.vel.x = 0;
	}

	//RIGHT
	if (kb.pressing('right')) {
		player.vel.x = playerVel;
	}
	else if (kb.released('right')) {
		player.vel.x = 0;
	}

	//UP
	if (kb.pressing('up')) {
		player.vel.y = playerVel * -1;
	}
	else if (kb.released('up')) {
		player.vel.y = 0;
	}

	//DOWN
	if (kb.pressing('down')) {
		player.vel.y = playerVel;
	}
	else if (kb.released('down')) {
		player.vel.y = 0;
	}

	//Enemy spawning


	//spawn timer



	//for (i = 0; i < 1000; i++) {

		//enemy = new Sprite(random(0, windowWidth), random(0, windowHeight), 20, 20);

		//enemy.vel.x = 3;

		//enemy.vel.y = 4;
	//}

	/****************************** */
}
/*******************************************************/
//  END of code
/*******************************************************/