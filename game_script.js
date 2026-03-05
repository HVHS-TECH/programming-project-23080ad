/*******************************************************/
// game Play
/*******************************************************/

/*******************************************************/
// setup()

//VARIABLES

//world setup variables
var gameSpeed = 60;

//player movement variables
var playerVel = 5;
var playerScale = 40;

//Enemy spawning variables
var enemySpawnPositioning = 0;
var enemyNumber = 0;
var spawnCounter = 0;

//rock spawning variables
var rockNumber = -1;

/*******************************************************/
function setup() {
	console.log("setup: ");

	//set game speed
	frameRate(gameSpeed);

	//draw the canvas
	cnv = new Canvas(windowWidth - 20, windowHeight - 20);

	//create the player charcter
	player = new Sprite(windowWidth / 2, windowHeight / 2, playerScale, playerScale, 'd');
	player.rotationLock = 1;
	//player.immovable = true;

	//test = new Sprite(windowWidth / 4, windowHeight / 2, playerScale, playerScale);

	//create the various sprite groups
	enemyGroup = new Group();
	rockGroup = new Group();

	//create afew rocks on game start
	for (rocks = 0; rocks < 15; rocks++) {
		createRock()
	}

	//hollow purple
	hollow_purple = new Sprite(0, windowHeight / 2.5, 20, 'd')
	hollow_purple.mass = 10000000;
	hollow_purple.color = 'purple';
}

/*******************************************************/
// draw()
/*******************************************************/
function draw() {

	//stops rocks from generating over eachother
	for (let i = 0; i < enemyGroup.length; i++) {
		let rockA = enemyGroup[i];

		for (let j = 0; j < enemyGroup.lenght; j++) {
			let rockB = enemyGroup[j];

			if (rockA !== rockB) {
				if (rockA.overlaps(rockB)) {
					deleteRock(rockA, rockB);
				}
			}

		}

	}

	//rockGroup.overlaps(rockGroup[1], deleteRock);

	//color the bg
	background('grey');

	//direct the Hollow Purple
	hollow_purple.moveTo(mouse, 10);

	//ENEMY SPAWNING
	enemySpawning();

	//PLAYER MOVEMENT
	playerMovement();

	//PLAYER, OBSTACLE & ENEMY INTERACTION

	//stop the player from bouncing off rocks and enemies
	rockGroup.collided(player, playerCollidesSolid);
	enemyGroup.collided(player, playerCollidesSolid);
}


function enemySpawning() {

	//make spawned enemies move towards the player by targeting their group
	for (let enemy of enemyGroup) {
		// Use rotateTo to instantly face the target
		enemy.rotateTowards(player, 0.05);
		enemy.moveTo(player, 1)
	}

	//choose which side of the screen enemies spawn from
	enemySpawnPositioning = floor(random(1, 4.999));
	//NOTE: since the floor function rounds down a value to the nearest whole number
	// we must set the range to just higher than the top value we want to be possible.
	// however it must be as far higher as possible to make sure each options has the largest
	// number of possible opprtunites to be selected.
	// Due to the minute differences 4.999 should be reasonable

	//Spawn an enemy every 5 seconds
	if (spawnCounter < 5 * gameSpeed / 3) {
		//spawnCounter = spawnCounter + 1;
	}
	else if (spawnCounter == 5 * gameSpeed / 3) {

		// since our frame rate is set to 60fps, the draw loop runs that many times per second.
		// so to spawn an enemy every five seconds we make the counter tick up to (5 x the "gameSpeed" variable)
		// before spawning an enemy and resetting.
		//
		// right now we seem to be able to spawn around 550 enemies on the school before the game begins to slow down.
		// NOTE: this may only be possible due to the lack of other objects on the screen

		//set enemy spawn coordinates

		//spawns an enemy from the left edge  of screen
		if (enemySpawnPositioning == 1) {
			enemyNumber = enemyNumber + 1;
			enemy = new Sprite(0, random(0, windowHeight), 20, 20);

			enemyGroup.add(enemy);
			spawnCounter = 0;
		}
		//spawns an enemy from the right edge  of screen
		else if (enemySpawnPositioning == 2) {
			enemyNumber = enemyNumber + 1;
			enemy = new Sprite(windowWidth, random(0, windowHeight), 20, 20);

			enemyGroup.add(enemy);
			spawnCounter = 0;
		}
		//spawns an enemy from the top edge  of screen
		else if (enemySpawnPositioning == 3) {
			enemyNumber = enemyNumber + 1;
			enemy = new Sprite(random(0, windowWidth), 0, 20, 20);

			enemyGroup.add(enemy);
			spawnCounter = 0;
		}
		//spawns an enemy from the bottom edge of screen
		else if (enemySpawnPositioning == 4) {
			enemyNumber = enemyNumber + 1;
			enemy = new Sprite(random(0, windowWidth), windowHeight, 20, 20);

			enemyGroup.add(enemy);
			spawnCounter = 0;
		}
		console.log(enemyGroup);
		console.log("Enemy Spawned From Edge " + enemySpawnPositioning);
		console.log("Enemy Number " + enemyNumber);
	}
}


function playerMovement() {

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
}

//stop the player from bouncing off rocks and enemies
function playerCollidesSolid() {
	player.vel.x = 0;
	player.vel.y = 0;
}

//create a rock
function createRock() {
	let rock = new rockGroup.Sprite(random(0, windowWidth), random(0, windowHeight), 50, 'k');
	rock.mass = 0.1;
	rockNumber = rockNumber + 1;
	rock.name = "rock " + rockNumber;
	console.log(rockGroup);
	// new rock spawned gets a unique name and number
	// corresponding to its place in the rockGroup/Array
}

//delete a rock
function deleteRock(_ssss, _rockGroup) {
	console.log("rock self collision test");
	_ssss.remove();
	createRock();
}

/*******************************************************/
//  END of code
/*******************************************************/

