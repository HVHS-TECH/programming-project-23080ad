/*******************************************************/
// game Play
/*******************************************************/

/*******************************************************/
// setup()

//VARIABLES

//world setup variables
var gameSpeed = 60;
var clockPause = 0;

//pause the game
let pauseRun = false;

//side bar formatting
var sideBarWidth = 250;

//roundPlay indicates that the game is currently in a round. Meanwhile,
//roundEnd indicates that a round has just finished. this does NOT include the time spent on the start screen before a round even starts.
var roundPlay = false;
var roundEnd = false;

//formatting variables
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

//player gets damaged variables
let invincabilityFrames = false;
var playerHealth = 0;

//ENEMIES

//Enemy spawning variables
var enemySpawnPositioning = 0;
var enemyNumber = 0;
var spawnCounter = 0;

//rock spawning variables
var rockNumber = -1;

//score variables
var finalScore = 0;
var highScore = 0;
var instantPause = 0;


/*******************************************************/
// setup()
/*******************************************************/
function setup() {
    console.log("setup: ");

    //GAME SETUP

    //set game speed
    frameRate(gameSpeed);

    //draw the canvas
    cnv = new Canvas(windowWidth, windowHeight);

    resizeCanvas(windowWidth, windowHeight);

    //create the ENEMY and ROCK sprite groups
    enemyGroup = new Group();
    rockGroup = new Group();

    //create rocks for the main screen background
    for (rocks = 0; rocks < 15; rocks++) {
        createRock();
    }

    //create the world borders L, R, U, D.
    BorderL = new Sprite(0, windowHeight / 2, 1, windowHeight, 's');
    BorderR = new Sprite(windowWidth - sideBarWidth, windowHeight / 2, 1, windowHeight, 's');
    BorderU = new Sprite(windowWidth / 2, windowHeight, windowWidth, 1, 's');
    BorderD = new Sprite(windowWidth / 2, 0, windowWidth, 1, 's');

    //create the side bar
    Side_Bar = new Sprite(windowWidth - sideBarWidth / 2, windowHeight / 2, sideBarWidth, windowHeight, 'n');
    Side_Bar.color = 'tan';


    //create the player charcter
    player = new Sprite(windowWidth / 2, windowHeight / 2, playerScale, playerScale, 'd');
    player.rotationLock = 1;
    player.layer = 1;

    //create the hollow purple
    hollow_purple = new Sprite(0, windowHeight / 2.5, 20, 'd')
    hollow_purple.mass = 10000000;
    hollow_purple.color = 'purple';

    //create the start screen backdrop
    start_backdrop = new Sprite(windowWidth / 2, windowHeight / 2, windowWidth, windowHeight, 'n');
    start_backdrop.color = 'black';
    start_backdrop.opacity = 0.5;

    //Create a button which starts a new round when pressed
    newRoundButton = createButton('New Round');
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
        clockTime = floor(((millis() - clockStartTime) / 1000) - clockPause );
    }

    //draw the Title
    if (showTitle) {
        fill('white');
        textSize(100);
        textAlign(CENTER);
        text("SURVIVOR", windowWidth / 2, windowHeight / 2);
    }

    //when the start button is pressed the main game functions which are supposed to trigger on each iteration of the darw loop activate. once the round ends these effects stop triggering until a new starts where on every value should be reset
    if (roundPlay) {

        // Display the clock on screen
        fill('black');
        textAlign(CENTER);
        textSize(32);
        text("Time: " + clockTime, (windowWidth - (sideBarWidth / 2)), height / 4);

        // display the players health on screen
        fill('black');
        textAlign(CENTER);
        textSize(32);
        text("Health: " + playerHealth, (windowWidth - (sideBarWidth / 2)), height / 6);

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
        

        //PAUSE

        //toggles and untoggles the world time scale which freezes time on the physics simulation
        if (kb.presses('p')) {
            world.timeScale = !world.timeScale;
            pauseRun = !pauseRun;
            clockIsOn = !clockIsOn;

        }

        //when  pause is activated, instantPause sets itself to the current clock time. 
        //Next a second timer starts which sets clockPause's value to however long the round has been running
        //minus this instant pause to calculate how long the round has been runnig after the pause.
        //Finally this value is constantly being removed from the clockTime variable in timer
        //meaning that the time is allways in the right place when it restarts having accounted for any and all pauses.
        if (pauseRun) {
            if (instantPause < 1) {
                instantPause = clockTime;
                console.log("instant pause time: " + instantPause);
            }
            clockPause = floor(((millis() - clockStartTime) / 1000) - instantPause);
            console.log("clock pause: " + clockPause);
        }
        //when the game becomes unpaused this resets instantPause so it can be reset in the above if stament when "instantPause < 1"
        if (!pauseRun){
             instantPause = 0;
        }

    }

    //ROUND OVER triggers

    //displays final score
    if (roundEnd) {
        fill('black');
        textAlign(CENTER);
        textSize(100);
        text("FINAL SCORE " + finalScore + "!", windowWidth / 2, windowHeight / 2);
    }

    //displays high score
    if (roundEnd) {
        fill('black');
        textAlign(CENTER);
        textSize(50);
        text("HIGH SCORE " + highScore, windowWidth / 2, (windowHeight / 2) + 100);
    }

}

/*******************************************************/
// startRound()
/*******************************************************/

//triggers all events that need to happen when a new round is started.
//Acts as a start button and a restart button so it must also reset all events from teh round over state.
function startRound() {

    //switches game state to roundPlay and disables all other potential agme states
    roundPlay = true;
    roundEnd = false;


    //removing all enemies from enemyGroup and deleting them
    enemyGroup.removeAll();
    rockGroup.removeAll();

    //resset player stats & send them to their start location
    playerHealth = 5;

    player.x = windowWidth / 2;
    player.y = windowHeight / 2;

    //create the background rocks
    for (rocks = 0; rocks < random(15, 20); rocks++) {
        createRock();
    }

    //hiding elemnets from/setting up the start screen
    start_backdrop.visible = false;
    newRoundButton.hide();
    showTitle = false;

    //reseting and starting the clock
    clockStartTime = millis();
    clockIsOn = true;


}


/*******************************************************/
// enemySpawning()
/*******************************************************/
function enemySpawning() {

    //if the game isnt paused activate the following, otherwise stop enemies from spawning
    if (pauseRun === false) {

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

        //Spawn an enemy every 5/3 seconds
        if (spawnCounter < 5 / 3 * gameSpeed) {
            spawnCounter++;
        }
        else if (spawnCounter >= 5 / 3 * gameSpeed) {

            // since our frame rate is set to 60fps, the draw loop runs that many times per second.
            // so to spawn an enemy every five seconds we make the counter tick up to (5/3 x the "gameSpeed" variable)
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
                //this is so enemies dont spawn behind or in the sidebar
                //which is why we have both the minus side bar width and the minus 5 for thoss reasons in that order.
                enemy = new Sprite((windowWidth - sideBarWidth) - 5, random(0, windowHeight), 20, 20);

                enemyGroup.add(enemy);
                spawnCounter = 0;
            }
            //spawns an enemy from the top edge  of screen
            else if (enemySpawnPositioning == 3) {
                enemyNumber = enemyNumber + 1;
                enemy = new Sprite(random(0, (windowWidth - sideBarWidth) - 5), 0, 20, 20);

                enemyGroup.add(enemy);
                spawnCounter = 0;
            }
            //spawns an enemy from the bottom edge of screen
            else if (enemySpawnPositioning == 4) {
                enemyNumber = enemyNumber + 1;
                enemy = new Sprite(random(0, (windowWidth - sideBarWidth) - 5), windowHeight, 20, 20);

                enemyGroup.add(enemy);
                spawnCounter = 0;
            }
            console.log(enemyGroup);
            console.log("Enemy Spawned From Edge " + enemySpawnPositioning);
            console.log("Enemy Number " + enemyNumber);
        }
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
function playerCollidesEnemy() {
    player.vel.x = 0;
    player.vel.y = 0;

    // if invicabilityFrames = true,
    // the return stament will stop the rest of the function beyond it from triggering.
    if (invincabilityFrames) return;

    playerHealth--;
    console.log("player health: " + playerHealth);
    if (playerHealth < 1) {
        roundOver()
    }

    invincabilityFrames = true;

    // this starts a timer that counts up too 1000 milliseconds
    // before terminating and updating the invincabilityFrames variable to false.
    setTimeout(() => {
        invincabilityFrames = false;
    }, 1000);

}


/*******************************************************/
// roundOver()
/*******************************************************/
function roundOver() {
    roundPlay = false;
    roundEnd = true;
    console.log("round is Over");

    //freeze the clock
    clockIsOn = false;

    //calculate final score
    finalScore = clockTime;
    if (finalScore > highScore) {
        highScore = finalScore;
    }
    console.log("Final score: " + clockTime);


    //repeats 5 times once the player died to make sure absolutley no objects are still moving
    for (t = 0; t < 5; t++) {
        enemyGroup.vel.x = 0;
        enemyGroup.vel.y = 0;
        player.vel.x = 0;
        player.vel.y = 0;
    }
    newRoundButton.show();

}


/*******************************************************/
// createRock()
/*******************************************************/

//create a rock
function createRock() {
    // x position modifiers to stop rocks from generating behind or overlapping sidebar; needs a better fix.
    let rock = new Sprite(random(0, (windowWidth - sideBarWidth - 50) - 5), random(0, windowHeight), 50, 'k');
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