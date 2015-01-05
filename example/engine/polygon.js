/**
 @brief: definition function (aka class body)
 */
function polygon(v1, v2, v3, v4, color){
	// original values
	this.v1 = v1;
	this.v2 = v2;
	this.v3 = v3;
	this.v4 = v4;
	this.color = color;
	
	if(v1 != null && v2 != null && v3 != null && v4 != null){
		this.center = new vector4d((v1.x + v2.x + v3.x + v4.x)/4, 
								   (v1.y + v2.y + v3.y + v4.y)/4, 
								   (v1.z + v2.z + v3.z + v4.z)/4);
		this.distance = Math3d.lengthVector(this.center);
		
		var diff1 = Math3d.subVectorVector(v2, v1);
		var diff2 = Math3d.subVectorVector(v3, v1);
		var cross = Math3d.crossVectorVector(diff1, diff2);
		var len = Math3d.lengthVector(cross);
		this.normal = Math3d.divVectorConstant(cross, len);
	}

	// return this
	return this;
}

/**
 @brief: deep copy function
 */
polygon.prototype.copy = function(poly) {
	this.v1 = new vector4d(poly.v1.x, poly.v1.y, poly.v1.z, poly.v1.w);
	this.v2 = new vector4d(poly.v2.x, poly.v2.y, poly.v2.z, poly.v2.w);
	this.v3 = new vector4d(poly.v3.x, poly.v3.y, poly.v3.z, poly.v3.w);
	this.v4 = new vector4d(poly.v4.x, poly.v4.y, poly.v4.z, poly.v4.w);
	this.color = new color(poly.color.red, poly.color.green, poly.color.blue);
	this.center = new vector4d(poly.center.x, poly.center.y, poly.center.z, poly.center.w);
	this.normal = new vector4d(poly.normal.x, poly.normal.y, poly.normal.z, poly.normal.w);
	return this;
};

/**
 @brief: function that multiplies the whole polygon with a matrix
 */
polygon.prototype.multiplyWithMatrix = function(m){
	this.v1 = Math3d.mulVectorMatrix(this.v1, m);
	this.v2 = Math3d.mulVectorMatrix(this.v2, m);
	this.v3 = Math3d.mulVectorMatrix(this.v3, m);
	this.v4 = Math3d.mulVectorMatrix(this.v4, m);
	this.center = Math3d.mulVectorMatrix(this.center, m);
	this.normal = Math3d.mulVectorMatrix(this.normal, m);
	return this;
}
