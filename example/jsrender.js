/**
 @brief: Global context and canvas variables
 */
var canvas;
var context;
var width, height;

/**
 @brief: global renderer variables
 */
var tcube, rcube;

/**
 @brief: global control variables
 */
var x_trans = 0, y_trans = 0, z_trans = -10;
var x_scale = 1, y_scale = 1, z_scale = 1;
var angle = 1.17, axis = new vector4d(1, 0, 0);
var trans_mat;
var scale_mat;
var persp_mat;
var rot_mat;

/**
 @brief: light variables
 */
var light_dir = new vector4d(0, 0.75, -5);
var light_color = new vector4d(255, 255, 255);
var ambient_intensity = 0.15;
var diffuse_intensity = 0.75;
var ambient_color = null; 
var diffuse_color = null;
var total_color = null;

/**
 @brief: texture
 */
var texture = new Image();
texture.crossOrigin="anonymous";
texture.src = "res/simpletex.png";

/**
 @brief: screen setup
 */
$(document).ready(function(){
	/////////////////////////////////////////////////////////////////
	// 1. setup the canvas
	width = parseInt(window.innerWidth-20);
	height = parseInt(window.innerHeight-20);
	var px_width = width+'px';
	var px_height = height+'px';
	var canvas_str = "<canvas id='canvas' width = "+px_width+" height = "+px_height+"></canvas>";
	$('body').append(canvas_str);
	
	canvas = $('#canvas');
	canvas.css({ 'left':'10px', 'top':'10px' });
	context = canvas.get(0).getContext("2d");

	/////////////////////////////////////////////////////////////////
	// 3. setup drawing and start the render loop when we've loaded
	// all necessary data
	texture.onload = function(){
		/////////////////////////////////////////////////////////////////
		// 2. setup the scene
		tcube = new cube(texture);
	
		setInterval(function(){
			// 3.1. clear
			context.clearRect(0, 0, width, height);

			// 3.2. render
			drawGrid();
			drawAxes();
			drawScene();
		}, 66);
	}
	
});

/**
 @brief: key interaction
 */
$(document).keypress(function(event){
 	// find keycode
	var keycode = (event.keyCode ? event.keyCode : event.which);
	
	if      (keycode == '97' )	{ x_trans -= 0.05; }	// Key 'A'
	else if (keycode == '100')	{ x_trans += 0.05; }	// Key 'D'
	else if (keycode == '115') 	{ y_trans += 0.05; }	// Key 'W'
	else if (keycode == '119') 	{ y_trans -= 0.05; }	// Key 'S'
	else if (keycode == '113')	{ z_trans += 0.05; }	// Key 'Q'
	else if (keycode == '101') 	{ z_trans -= 0.05; }	// Key 'E'
	else if (keycode == '120')	{ angle += 0.1; }		// Key 'Q'
	else if (keycode == '122')	{ angle -= 0.1; }		// Key 'Z'
});

/**
 @brief: the render function
 */
function drawScene(){

	// 1. recreate matrices
	trans_mat = new Math3d.translationMatrix(x_trans, y_trans, z_trans);
	scale_mat = new Math3d.scalingMatrix(x_scale, y_scale, z_scale); 
	rot_mat = new Math3d.rotationMatrix(angle, axis);
	persp_mat = new Math3d.perspectiveMatrix(60, width, height, 1, 100);

	// 2. calculate final matrices
	var m1 = Math3d.mulMatrixMatrix(rot_mat, scale_mat);
	var m2 = Math3d.mulMatrixMatrix(trans_mat, m1);
	var mm = Math3d.mulMatrixMatrix(persp_mat, m2);
	
	// 3. copy the cube
	rcube = new cube().copy(tcube);
	
	// 4. multiply with matrix
	rcube.multiplyWithMatrix(mm);

	// 5. perform the draw
	rcube.perspectiveDivide();
	rcube.orderFaces();
	rcube.viewportTransform(width, height);

	for (var j = 0; j < rcube.faces.length; j++){
		// 1. Calc the lighting for this face
		ambient_color = Math3d.mulVectorConstant(light_color, ambient_intensity);
		diffuse_color = new vector4d(0, 0, 0);
		var normal_normal = Math3d.normalizeVector(rcube.faces[j].normal);
		var inv_light_dir = new vector4d(-light_dir.x, -light_dir.y, -light_dir.x);
		var diffuse_factor = Math3d.dotVectorVector(normal_normal, inv_light_dir);
		if (diffuse_factor > 0){
			diffuse_color = Math3d.mulVectorConstant(light_color, diffuse_intensity * diffuse_factor);
		}
		total_color = Math3d.addVectorVector(ambient_color, diffuse_color);

		// 2. setup the texture's separate canvas
		// and add the lighting to it
		var texture_canvas = document.createElement('canvas');
		texture_canvas.width = rcube.texture.width;
		texture_canvas.height = rcube.texture.height;
		var texture_context = texture_canvas.getContext('2d');
		
		texture_context.drawImage(rcube.texture, 0, 0);
		var map = texture_context.getImageData(0, 0, texture_canvas.width, texture_canvas.height);
		var texdata = map.data;
		for (var p = 0, len = texdata.length; p < len; p+= 4){
			texdata[p] = (texdata[p] + total_color.x)/2;
			texdata[p+1] = (texdata[p+1] + total_color.x)/2;
			texdata[p+2] = (texdata[p+2] + total_color.x)/2;
		}
		texture_context.putImageData(map, 0, 0);

		// 2. Start texturing
		// draw first triangle to texture the cube
		// x,y = the actual positions on the screen
		// u,v = the image positions (related to it's width and height)
		// first faces 1,2,3 and 3,4,1
		
		var x0 = rcube.faces[j].v1.x, 
			x1 = rcube.faces[j].v2.x, 
			x2 = rcube.faces[j].v3.x;
		var y0 = rcube.faces[j].v1.y, 
			y1 = rcube.faces[j].v2.y, 
			y2 = rcube.faces[j].v3.y;
		var u0 = 0, 
			u1 = rcube.texture.width, 
			u2 = rcube.texture.width;
		var v0 = 0, 
			v1 = 0, 
			v2 = rcube.texture.height;

		// Compute matrix transform
	    var delta = u0*v1 + v0*u2 + u1*v2 - v1*u2 - v0*u1 - u0*v2;
	    var delta_a = x0*v1 + v0*x2 + x1*v2 - v1*x2 - v0*x1 - x0*v2;
	    var delta_b = u0*x1 + x0*u2 + u1*x2 - x1*u2 - x0*u1 - u0*x2;
	    var delta_c = u0*v1*x2 + v0*x1*u2 + x0*u1*v2 - x0*v1*u2 - v0*u1*x2 - u0*x1*v2;
	    var delta_d = y0*v1 + v0*y2 + y1*v2 - v1*y2 - v0*y1 - y0*v2;
	    var delta_e = u0*y1 + y0*u2 + u1*y2 - y1*u2 - y0*u1 - u0*y2;
	    var delta_f = u0*v1*y2 + v0*y1*u2 + y0*u1*v2 - y0*v1*u2 - v0*u1*y2 - u0*y1*v2;

	    // draw the texture
	    context.save();
	    context.beginPath();
	    context.moveTo(x0, y0);
	    context.lineTo(x1, y1);
	    context.lineTo(x2, y2);
	    context.closePath();
	    context.clip();
	    context.transform(delta_a/delta, delta_d/delta,
	                      delta_b/delta, delta_e/delta,
	                      delta_c/delta, delta_f/delta);
	    context.drawImage(texture_canvas, 0, 0);
	    context.restore();

	    // and now for the second part of the cube
	    x0 = rcube.faces[j].v3.x, 
	    x1 = rcube.faces[j].v4.x, 
	    x2 = rcube.faces[j].v1.x;
	    y0 = rcube.faces[j].v3.y, 
	    y1 = rcube.faces[j].v4.y, 
	    y2 = rcube.faces[j].v1.y;
	    u0 = rcube.texture.width, 
	    u1 = 0, 
	    u2 = 0;
	    v0 = rcube.texture.height, 
	    v1 = rcube.texture.height, 
	    v2 = 0;

	    // Compute matrix transform
	    delta = u0*v1 + v0*u2 + u1*v2 - v1*u2 - v0*u1 - u0*v2;
	    delta_a = x0*v1 + v0*x2 + x1*v2 - v1*x2 - v0*x1 - x0*v2;
	    delta_b = u0*x1 + x0*u2 + u1*x2 - x1*u2 - x0*u1 - u0*x2;
	    delta_c = u0*v1*x2 + v0*x1*u2 + x0*u1*v2 - x0*v1*u2 - v0*u1*x2 - u0*x1*v2;
	    delta_d = y0*v1 + v0*y2 + y1*v2 - v1*y2 - v0*y1 - y0*v2;
	    delta_e = u0*y1 + y0*u2 + u1*y2 - y1*u2 - y0*u1 - u0*y2;
	    delta_f = u0*v1*y2 + v0*y1*u2 + y0*u1*v2 - y0*v1*u2 - v0*u1*y2 - u0*y1*v2;

	    // draw the texture
	    context.save();
	    context.beginPath();
	    context.moveTo(x0, y0);
	    context.lineTo(x1, y1);
	    context.lineTo(x2, y2);
	    context.closePath();
	    context.clip();
	    context.transform(delta_a/delta, delta_d/delta,
	                      delta_b/delta, delta_e/delta,
	                      delta_c/delta, delta_f/delta);
	    // context.putImageData(map,0,0);
	    context.drawImage(texture_canvas, 0, 0);
	    context.restore();
	}

	// delete the scene
	rcube = null;
}

/**
 @brief: the draw axes function
 */
function drawAxes(){
	// set context
	context.strokeStyle = "#d3d3d3";
	context.lineWidth = 1;

	context.beginPath();
	context.moveTo(width / 2, 0);
	context.lineTo(width / 2, height);
	context.stroke();

	context.beginPath();
	context.moveTo(0, height / 2);
	context.lineTo(width, height / 2);
	context.stroke();
}

/**
 @brief: draw the grid
 */
function drawGrid(){
	context.strokeStyle = "#e5e5e5";
	context.lineWidth = 1;
	context.setLineDash([5]);

	var x_paces = 20; 
	var x_pace_width = width / x_paces;
	var y_paces = 20;
	var y_pace_height = height / y_paces;

	context.beginPath();
	for (var i = 0; i < x_paces; i++){
		context.moveTo(i*x_pace_width, 0);
		context.lineTo(i*x_pace_width, height);
	}
	for (var i = 0; i < y_paces; i++){
		context.moveTo(0, i*y_pace_height);
		context.lineTo(width, i*y_pace_height);
	}
	context.stroke();
	context.setLineDash([]);
}