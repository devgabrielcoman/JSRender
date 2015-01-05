var DRAW_MODES = {
	'line':'LINES',
	'fill':'FILL'
};

/**
 @brief: engine constants
 */
var CURRENT_DRAW_MODE = 'FILL';
var FRAME_RATE = 66; 

/**
 @brief: function to convert degrees to radians and vice-versa
 */
function toRadian(x){
	return (x * Math.PI) / 180.0;
}
function toDegree(x){
	return (x * 180.0 ) / Math.PI;
}

/**
 @brief: perform perspective divide on a single vertex
 		 so that we can have the illusion of perspective
 */
function perspectiveDivide(v){
	var pv = new vector4d(0,0,0,0);
	pv.x = v.x / v.w;
	pv.y = v.y / v.w;
	pv.z = v.z / v.w;
	pv.w = v.w / v.w; 
	return pv;
}

/**
 @brief: the aux color object
 */
function color(red, green, blue){
	this.red = red;
	this.green = green;
	this.blue = blue;
	return this;
}

color.prototype.decimalToHex = function(d, padding){
	var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return hex;
}
color.prototype.rgbToHtml = function(){
	// 2. form the color
	var rcolor = this.decimalToHex(this.red);
	var gcolor = this.decimalToHex(this.green);
	var bcolor = this.decimalToHex(this.blue);
	return "#"+rcolor+gcolor+bcolor;
}