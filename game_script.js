/*******************************************************/
// game Play
/*******************************************************/
	
/*******************************************************/
// setup()

//variables

var width;
var height;
var pos_x;
var pos_y;


/*******************************************************/
function setup() {
	console.log("setup: ");
	
	//draw the canvas
	cnv = new Canvas(windowWidth, windowHeight);

	
	//create a rectangle
	rectangle = new Sprite(100, 100, 20, 20, 10);
	rectangle.color = 'green';

	//create a circle
	circle = new Sprite(200, 200, 10, 10)
}
	
/*******************************************************/
// draw()
/*******************************************************/
function draw() {

	//color the bg
	background('grey');
}

/*******************************************************/
//  END of code
/*******************************************************/