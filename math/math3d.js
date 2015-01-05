/**
 @--------------------------------------------------------------------
 @brief: definition of base classes
 @--------------------------------------------------------------------
 */
function vector4d(x, y, z, w){
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = (w == undefined ? 1 : w);
	return this;
}

function quaternion(x, y, z, w){
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = w;
	return this;
}

function mat4d(members){
	this.members = members;
	return this;
}

mat4d.prototype.print = function() {
	var printstr = "\t"  ;
	printstr += this.members[0].toFixed(2)+"\t"+
				this.members[1].toFixed(2)+"\t"+
				this.members[2].toFixed(2)+"\t"+
				this.members[3].toFixed(2)+"\n";
	printstr += "\t"+this.members[4].toFixed(2)+"\t"+
				this.members[5].toFixed(2)+"\t"+
				this.members[6].toFixed(2)+"\t"+
				this.members[7].toFixed(2)+"\n";
	printstr += "\t"+this.members[8].toFixed(2)+"\t"+
				this.members[9].toFixed(2)+"\t"+
				this.members[10].toFixed(2)+"\t"+
				this.members[11].toFixed(2)+"\n";
	printstr += "\t"+this.members[12].toFixed(2)+"\t"+
				this.members[13].toFixed(2)+"\t"+
				this.members[14].toFixed(2)+"\t"+
				this.members[15].toFixed(2)+"\n";
	console.log(printstr);
};

function Math3d(){
	// empty class
}

/**
 @--------------------------------------------------------------------
 @brief: math operations between entities
 @--------------------------------------------------------------------
 */
Math3d.addVectorConstant = function(v, k){
	return new vector4d(v.x + k, v.y + k, v.z + k, 1);
}
Math3d.addVectorVector = function(v1, v2){
	return new vector4d(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z, 1);
}
Math3d.subVectorConstant = function(v, k){
	return new vector4d(v.x - k, v.y - k, v.z - k, 1);
}
Math3d.subVectorVector = function(v1, v2){
	return new vector4d(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z, 1);
}
Math3d.mulVectorConstant = function(v, k){
	return new vector4d(v.x * k, v.y * k, v.z * k , 1);
}
Math3d.mulVectorVector = function(v1, v2){
	return new vector4d(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z, v1.w * v2.w);
}
Math3d.divVectorConstant = function(v, k){
	if (k == 0) return new vector4d(0, 0, 0, 0);
	else 		return new vector4d(v.x / k, v.y / k, v.z / k, v.w / k);
}
Math3d.divVectorVector = function(v1, v2){
	var x = (v2.x == 0 ? 0 : v1.x / v2.x);
	var y = (v2.y == 0 ? 0 : v1.y / v2.y);
	var z = (v2.z == 0 ? 0 : v1.z / v2.z);
	var w = (v2.w == 0 ? 0 : v1.w / v2.w);
	return new vector4d(x, y, z, w);
}

Math3d.mulVectorMatrix = function(v, m){
	var x = v.x * m.members[0] + v.y * m.members[1] + v.z * m.members[2] + v.w * m.members[3];
	var y = v.x * m.members[4] + v.y * m.members[5] + v.z * m.members[6] + v.w * m.members[7];
	var z = v.x * m.members[8] + v.y * m.members[9] + v.z * m.members[10] + v.w * m.members[11];
	var w = v.x * m.members[12] + v.y * m.members[13] + v.z * m.members[14] + v.w * m.members[15];
	return new vector4d(x, y, z, w);
}

Math3d.mulMatrixMatrix = function(m1, m2){
	// fill the rows
    var m1_rows = new Array();
    var m2_cols = new Array();
 
    for (var i = 0; i < 16; i+=4) {
        m1_rows.push(new vector4d(m1.members[i+0], m1.members[i+1], m1.members[i+2], m1.members[i+3]));
    }
    
    for (var i = 0; i < 4; i++) {
        m2_cols.push(new vector4d(m2.members[i], m2.members[i+4], m2.members[i+8], m2.members[i+12]));
    }
    
    var return_matrix = Math3d.clearMatrix();
    var index = 0;
    for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 4; col++) {
            return_matrix.members[index] = Math3d.dotVectorVector(m1_rows[row],m2_cols[col]);
            index++;
        }
    }

    return return_matrix;
}

Math3d.mulVectorQuaternion = function(v, q){
	var x =   (q.w * v.x) + (q.y * v.z) - (q.z * v.y);
    var y =   (q.w * v.y) + (q.z * v.x) - (q.x * v.z);
    var z =   (q.w * v.z) + (q.x * v.y) - (q.y * v.x);
	var w = - (q.x * v.x) - (q.y * v.y) - (q.z * v.z);
    return new quaternion(x, y, z, w);
}

Math3d.mulQuaternionQuaternion = function(q, r){
	var x = (q.x * r.w) + (q.w * r.x) + (q.y * r.z) - (q.z * r.y);
    var y = (q.y * r.w) + (q.w * r.y) + (q.z * r.x) - (q.x * r.z);
    var z = (q.z * r.w) + (q.w * r.z) + (q.x * r.y) - (q.y * r.x);
    var w = (q.w * r.w) - (q.x * r.x) - (q.y * r.y) - (q.z * r.z);
    return new quaternion(x, y, z, w);
}

/**
 @--------------------------------------------------------------------
 @brief: vector4d functions
 @--------------------------------------------------------------------
 */
Math3d.dotVectorVector = function(v1, v2){
	return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z + v1.w * v2.w;
}

Math3d.lengthVector = function(v){
	var dot = Math3d.dotVectorVector(v, v);
	return Math.sqrt(dot);
}

Math3d.normalizeVector = function(v){
	var len = Math3d.lengthVector(v);
	return Math3d.divVectorConstant(v, len);
}

Math3d.distanceVectorVector = function(v1, v2){
	var diff = Math3d.subVectorVector(v1, v2);
	console.log(diff);
	return Math3d.lengthVector(diff);
}

Math3d.crossVectorVector = function(v1, v2){
	var x = v1.y * v2.z - v1.z * v2.y;
	var y = v1.z * v2.x - v1.x * v2.z;
	var z = v1.x * v2.y - v1.y * v2.z;
	return new vector4d(x, y, z, 1);
}

Math3d.rotateVector = function(v, angle, axis){
	var sin_2 = Math.sin(angle/2.0);
	var cos_2 = Math.sin(angle/2.0);

	var q = mulVectorConstant(axis, sin_2);
	var rotationq = new quaternion(q.x, q.y, q.z, cos_2);
	var conjugate = Math3d.conjugateQuaternion(rotationq);
	var mvconj = Math3d.mulVectorQuaternion(v, conjugateq);
	var final = Math3d.mulQuaternionQuaternion(rotationq, mvconj);

    return new vector4d(final.x, final.y, final.z, 1);
}

/**
 @--------------------------------------------------------------------
 @brief: quaternion functions
 @--------------------------------------------------------------------
 */
Math3d.lengthQuaternion = function(q){
	return q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w;
}

Math3d.normalizeQuaternion = function(q){
	var len = lengthQuaternion(q);
	var x = ( len == 0 ? 0 : q.x / len);
	var y = ( len == 0 ? 0 : q.y / len);
	var z = ( len == 0 ? 0 : q.z / len);
	var w = ( len == 0 ? 0 : q.w / len);
	return new quaternion(x, y, z, w);
}

Math3d.conjugateQuaternion = function(q){
	return new quaternion(-q.x, -q.y, -q.z, q.w);
}

/**
 @--------------------------------------------------------------------
 @brief: matrix creation functions
 @--------------------------------------------------------------------
 */
Math3d.clearMatrix = function(){
	return new mat4d([
		0, 0, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, 0
	]);
}

Math3d.identityMatrix = function(){
	return new mat4d([
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	]);
}

Math3d.perspectiveMatrix = function(fov, width, height, z_near, z_far){
	var ar = width / height;
	var tanfov_2 = Math.tan(toRadian(fov/2));
	var fs_1 = 1 / (tanfov_2 * ar);
	var fs_2 = 1 / tanfov_2;
	var F = (z_far + z_near) / (z_near - z_far);
	var N = (2 * z_far * z_near) / (z_near - z_far);

	return new mat4d([
		fs_1, 0, 0, 0, 
		0, fs_2, 0, 0, 
		0, 0, F, N,
		0, 0, -1, 0
	]);
}

Math3d.translationMatrix = function(x, y, z){
	return new mat4d([
		1, 0, 0, x,
		0, 1, 0, y,
		0, 0, 1, z,
		0, 0, 0, 1
	]);
}

Math3d.scalingMatrix = function(x, y, z){
	return new mat4d([
		x, 0, 0, 0,
		0, y, 0, 0,
		0, 0, z, 0,
		0, 0, 0, 1
	]);
}

Math3d.rotationMatrix = function(angle, axis){
	// calc some values
	var sin_2 = Math.sin(angle/2);
	var cos_2 = Math.cos(angle/2);
	var x = axis.x * sin_2;
	var y = axis.y * sin_2;
	var z = axis.z * sin_2;
	var w = cos_2;

	// create values for the matrix
	var mat = Math3d.identityMatrix();
	mat.members[0] = w * w + x * x - y * y - z * z;
    mat.members[1] = 2 * x * y - 2 * w * z;
    mat.members[2] = 2 * x * z + 2 * w * y;
    mat.members[4] = 2 * x * y + 2 * w * z;
    mat.members[5] = w * w - x * x + y * y  - z * z;
    mat.members[6] = 2 * y * z + 2 * w * x;
    mat.members[8] = 2 * x * z - 2 * w * y;
    mat.members[9] = 2 * y * z - 2 * w * x;
    mat.members[10]= w * w - x * x - y * y + z * z;
    return mat;
}