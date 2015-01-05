/**
 @brief: function that defines a cube
 */
function cube(texture){
	this.texture = texture;
	this.faces = new Array();
	this.faces[0] = new polygon(new vector4d(-1, -1, 1),
								new vector4d(1, -1, 1),
								new vector4d(1, 1, 1),
								new vector4d(-1, 1, 1),
								new color(255, 0, 0));
	this.faces[1] = new polygon(new vector4d(-1, -1, -1),
								new vector4d(1, -1, -1),
								new vector4d(1, 1, -1),
								new vector4d(-1, 1, -1),
								new color(0, 255, 0));
	this.faces[2] = new polygon(new vector4d(-1, -1, 1),
								new vector4d(-1, -1, -1),
								new vector4d(-1, 1, -1),
								new vector4d(-1, 1, 1),
								new color(0, 0, 255));
	this.faces[3] = new polygon(new vector4d(1, -1, 1),
								new vector4d(1, -1, -1),
								new vector4d(1, 1, -1),
								new vector4d(1, 1, 1),
								new color(255, 255, 0));
	this.faces[4] = new polygon(new vector4d(-1, -1, 1),
								new vector4d(1, -1, 1),
								new vector4d(1, -1, -1),
								new vector4d(-1, -1, -1),
								new color(255, 0, 255));
	this.faces[5] = new polygon(new vector4d(-1, 1, 1),
								new vector4d(1, 1, 1),
								new vector4d(1, 1, -1),
								new vector4d(-1, 1, -1),
								new color(0, 255, 255));
	return this;
}

cube.prototype.copy = function(cube) {
	this.texture = cube.texture;
	for (var i = 0; i < this.faces.length; i++){
		this.faces[i] = new polygon().copy(cube.faces[i]); 
	}
	return this;
};

cube.prototype.multiplyWithMatrix = function(m){
	for (var i = 0; i < this.faces.length; i++){
		this.faces[i].multiplyWithMatrix(m);
	}
	return this;
}

cube.prototype.perspectiveDivide = function(){
	for (var i = 0; i < this.faces.length; i++){
		this.faces[i].v1 = perspectiveDivide(this.faces[i].v1);
		this.faces[i].v2 = perspectiveDivide(this.faces[i].v2);
		this.faces[i].v3 = perspectiveDivide(this.faces[i].v3);
		this.faces[i].v4 = perspectiveDivide(this.faces[i].v4);
	}
	return this;
}

cube.prototype.viewportTransform = function(width, height){

	for (var i = 0; i < this.faces.length; i++) {
		this.faces[i].v1.x = (this.faces[i].v1.x * 0.5 + 0.5)*width;
		this.faces[i].v1.y = (this.faces[i].v1.y * 0.5 + 0.5)*height;

		this.faces[i].v2.x = (this.faces[i].v2.x * 0.5 + 0.5)*width;
		this.faces[i].v2.y = (this.faces[i].v2.y * 0.5 + 0.5)*height;

		this.faces[i].v3.x = (this.faces[i].v3.x * 0.5 + 0.5)*width;
		this.faces[i].v3.y = (this.faces[i].v3.y * 0.5 + 0.5)*height;

		this.faces[i].v4.x = (this.faces[i].v4.x * 0.5 + 0.5)*width;
		this.faces[i].v4.y = (this.faces[i].v4.y * 0.5 + 0.5)*height;
	}

	return this;
}

cube.prototype.orderFaces = function(){
	for(var i = 0; i < this.faces.length; i++){
		this.faces[i].distance = Math3d.lengthVector(this.faces[i].center);
	}
	this.faces.sort(function(a,b){
		var l1 = a.distance, l2 = b.distance; 
		return ((l1 > l2) ? -1 : ((l1 < l2) ? 1 : 0));
	});
	return this;	
}