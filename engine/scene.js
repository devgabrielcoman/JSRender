/**
 @brief: defines a scene with multiple cubes
 */
function Scene(){
	this.cubes = new Array();
	return this;
}

Scene.prototype.addCube = function(cube) {
	this.cubes.push(cube);
	return this;
};