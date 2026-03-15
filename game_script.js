/*******************************************************/
// game Play
/*******************************************************/

/*******************************************************/
// setup()

//VARIABLES

//world setup variables
var gameSpeed = 60;
var roundStart = false;
var showTitle = true;

//round timer variables
let timerButton;
let clockStartTime = 0;
let clockIsOn = false;
let clockTime = 0;

//"round starting button" variables
var buttonX = 100;
var buttonY = 50;

//In round player variables
var playerVel = 5;
var playerScale = 40;
var playerHealth = 5;

//ENEMIES

//Enemy spawning variables
var enemySpawnPositioning = 0;
var enemyNumber = 0;
var spawnCounter = 0;

//player gets damaged variables
var invic = 0;

//rock spawning variables
var rockNumber = -1;


/*******************************************************/
// setup()
/*****************************************************/
function setup() {
    console.log("setup: ");

    //set game speed
    frameRate(gameSpeed);

    //draw the canvas
    cnv = new Canvas(windowWidth, windowHeight);

    //create the player charcter
    player = new Sprite(windowWidth / 2, windowHeight / 2, playerScale, playerScale, 'd');
    player.rotationLock = 1;
    player.layer = 1;

    //test = new Sprite(windowWidth / 4, windowHeight / 2, playerScale, playerScale);

    //create the various sprite groups testtest
    enemyGroup = new Group();
    rockGroup = new Group();

    //create afew rocks on game start
    for (rocks = 0; rocks < 15; rocks++) {
        createRock();
    }

    //create the hollow purple
    hollow_purple = new Sprite(0, windowHeight / 2.5, 20, 'd')
    hollow_purple.mass = 10000000;
    hollow_purple.color = 'purple';

    //create the start screen backdrop
    start_backdrop = new Sprite(windowWidth / 2, windowHeight / 2, windowWidth, windowHeight, 'n');
    start_backdrop.color = 'black';
    start_backdrop.opacity = 0.5;

    //Create a button which starts a new round when pressed
    newRoundButton = createButton('Start Game');
    newRoundButton.size(100, 50);
    newRoundButton.position(windowWidth / 2 - buttonX / 2, windowHeight / 1.5);
    newRoundButton.mousePressed(startRound);
}

/*******************************************************/
// draw()
/*******************************************************/
function draw() {

    //color the gameplay bg
    background('grey');

    //draws all sprites first so that the text object can then be drawn infront of them
    allSprites.draw();

    //CLOCK

    //if clockIsOn is true, the game will calculate the rounded value of how many milliseconds
    //the game has been running for minus how long the game has been running for before the clock was started,
    //divided by 1000 to calculate how many seconds its been running for.
    if (clockIsOn) {
        clockTime = floor((millis() - clockStartTime) / 1000);
    }

    // Display the clock on screen
    textAlign(CENTER);
    textSize(32);
    text("Time: " + clockTime, width / 2, height / 4);

    //draw the Title
    if (showTitle) {
        textSize(100);
        fill('red');
        textAlign(CENTER);
        text("Test title", windowWidth / 2, windowHeight / 2);
    }

    //when the start key is pressed the main game functions which are supposed to trigger on each iteration of the darw loop activate.
    if (roundStart) {
        //direct the Hollow Purple
        //hollow_purple.moveTo(mouse, 10);

        //ENEMY SPAWNING
        enemySpawning();

        //PLAYER MOVEMENT
        playerMovement();

        //PLAYER, OBSTACLE & ENEMY INTERACTION

        //stop the player from bouncing off rocks and enemies
        rockGroup.collided(player, playerCollidesSolid);
        enemyGroup.collided(player, playerCollidesEnemy);

        if (playerHealth < 1) {
            roundOver();
        }
    }


}

/*******************************************************/
// startRound()
/*******************************************************/

//triggers all events that need to happen when a new round is started
function startRound() {
    //reseting and starting the clock
    clockStartTime = millis();
    clockIsOn = true;
    roundStart = true;

    //hiding elemnets from the start screen
    start_backdrop.visible = false;
    newRoundButton.hide();
    showTitle = false;
}


/*******************************************************/
// enemySpawning()
/*******************************************************/
function enemySpawning() {

    //make spawned enemies move towards the player by targeting their group
    for (let enemy of enemyGroup) {
        // Use rotateTo to instantly face the target
        enemy.rotateTowards(player, 0.05);
        enemy.moveTo(player, 1)
    }

    //choose which side of the screen enemies spawn from
    enemySpawnPositioning = floor(random(1, 4.999999999999999999999999999999999999));
    //NOTE: since the floor function rounds down a value to the nearest whole number
    // we must set the range to just higher than the top value we want to be possible.
    // however it must be as far higher as possible to make sure each options has the largest
    // number of possible opprtunites to be selected.
    // Due to the minute differences 4.999 should be reasonable

    //Spawn an enemy every 5 seconds
    if (spawnCounter < 5 / 3 * gameSpeed) {
        spawnCounter++;
    }
    else if (spawnCounter >= 5 / 3 * gameSpeed) {

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


/*******************************************************/
// playerMovement()
/*******************************************************/
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


/*******************************************************/
// playerCollidesSolid()
/*******************************************************/

//stop the player from bouncing off rocks
function playerCollidesSolid() {
    player.vel.x = 0;
    player.vel.y = 0;


}


/*******************************************************/
// playerCollidesEnemy()
/*******************************************************/

//both inflicts damge and stops the player from bouncing off of enemies on contact
async function playerCollidesEnemy() {
    player.vel.x = 0;
    player.vel.y = 0;

    await Delay(2000);
    playerHealth--;
    console.log(playerHealth);

}


/*******************************************************/
// roundOver()
/*******************************************************/
function roundOver() {
    roundStart = false;
    console.log("round is Over");

    enemyGroup.vel.x = 0;
    enemyGroup.vel.y = 0;
    player.vel.x = 0;
    player.vel.y = 0;

}


/*******************************************************/
// createRock()
/*******************************************************/


//create a rock
function createRock() {
    let rock = new Sprite(random(0, windowWidth), random(0, windowHeight), 50, 'k');
    rock.mass = 0.1;
    rockNumber = rockNumber + 1;
    rock.name = "rock " + rockNumber;
    //for (let i = 0; i < rockGroup.length; i++) {
    //let rockA = rockGroup[i];
    //console.log("check 1");
    /*
            for (let j = 0; j < rockGroup.length; j++) {
                let rockB = rockGroup[j];
                console.log("check 2");
   
                if (rockA !== rockB) {
                    if (rockA.collides(rockB)) {
                        console.log("check 3");
                        deleteRock(rockA, rockB);
                    }
                }
            }
        }
    */

    rockGroup.add(rock);
    console.log(rockGroup);
    // new rock spawned gets a unique name and number
    // corresponding to its place in the rockGroup/Array
}

//delete a rock
/*
function deleteRock() {
    console.log("rock self collision test");
    _ssss.remove();
    createRock();
}
*/

/*******************************************************/
//  END of code
/*******************************************************/