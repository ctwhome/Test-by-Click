//Move the mouse across the screen as a sine wave.
var robot = require("robotjs");

//Speed up the mouse.
robot.setMouseDelay(2);

var twoPI = Math.PI * 2.0;
var screenSize = robot.getScreenSize();
var height = (screenSize.height / 2) - 10;
var width = screenSize.width;

//
// //Type "Hello World".
// robot.typeString("Hello World");
//
// //Press enter.
// robot.keyTap("enter");
//
//
// //Get a 100x100 screen capture starting at 0, 0.
// var img = robot.screen.capture(0, 0, 100, 100);
//
// console.log(img.width)
//
// //Get pixel color at 50, 50.
// var hex = img.colorAt(50, 50);
// console.log(hex);
robot.mouseClick();
robot.setMouseDelay(2000);
robot.mouseClick();
//
// for (var x = 0; x < width; x++)
// {
//     y = height * Math.sin((twoPI * x) / width) + height;
//     robot.moveMouse(x, y);
// }