/**
 * OpenEyes
 *
 * (C) Moorfields Eye Hospital NHS Foundation Trust, 2008-2011
 * (C) OpenEyes Foundation, 2011-2013
 * This file is part of OpenEyes.
 * OpenEyes is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * OpenEyes is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with OpenEyes in a file titled COPYING. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package OpenEyes
 * @link http://www.openeyes.org.uk
 * @author OpenEyes <info@openeyes.org.uk>
 * @copyright Copyright (c) 2008-2011, Moorfields Eye Hospital NHS Foundation Trust
 * @copyright Copyright (c) 2011-2013, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */

/**
 * SMILE (Photo Therapeutic Keratectomy
 *
 * @class SMILE
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.SMILE = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "SMILE";

	// Derived parameters
	this.diameter = 8;
	
	// Other parameters
	this.thickness = 15;
	this.spotSeparation = "";
	this.lineSeparation = "";
	this.energyLevel = "";

	// Saved parameters
	this.savedParameterArray = [
		'scaleX', 
		'scaleY', 
		'diameter', 
		'thickness',
		'spotSeparation', 
		'lineSeparation',
		'energyLevel',
	];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {
		'diameter':'lenticule diameter (mm)', 
		'thickness':'Lenticule bed thickness (um)', 
		'spotSeparation':'Spot separation',
		'lineSeparation':'Line separation',
		'energyLevel':'Energy level',
	};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.SMILE.prototype = new ED.Doodle;
ED.SMILE.prototype.constructor = ED.SMILE;
ED.SMILE.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.SMILE.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default dragging attributes
 */
ED.SMILE.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = false;
	this.isUnique = true;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['scaleX']['range'].setMinAndMax(+0.7, +0.9);
	this.parameterValidationArray['scaleY']['range'].setMinAndMax(+0.7, +0.9);

	// Derived parameters
	this.parameterValidationArray['diameter'] = {
		kind: 'derived',
		type: 'float',
		range: new ED.Range(7, 9),
		precision: 1,
		animate: true
	};
	
	// Other parameters
	this.parameterValidationArray['thickness'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(10, 30),
		animate: false
	};
	this.parameterValidationArray['spotSeparation'] = {
		kind: 'other',
		type: 'string',
		list: ['0.5um', '0.6um', '0.7um', '0.8um', '0.9um', '1.0um'],
		animate: false
	};
	this.parameterValidationArray['lineSeparation'] = {
		kind: 'other',
		type: 'string',
		list: ['0.5um', '0.6um', '0.7um', '0.8um', '0.9um', '1.0um'],
		animate: false
	};
	this.parameterValidationArray['energyLevel'] = {
		kind: 'other',
		type: 'string',
		list: ['0.50uJ', '0.55uJ', '0.60uJ', '0.65uJ', '0.70uJ', '0.75uJ', '0.80uJ', '0.85uJ', '0.90uJ', '0.95uJ', '1.00uJ'],
		animate: false
	};
}

/**
 * Sets default parameters
 */
ED.SMILE.prototype.setParameterDefaults = function() {
	this.setParameterFromString('diameter', '8.0');
	this.setParameterFromString('thickness', '15');
	this.setParameterFromString('spotSeparation', '0.6um');
	this.setParameterFromString('lineSeparation', '0.6um');
	this.setParameterFromString('energyLevel', '0.75uJ');
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.SMILE.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'scaleX':
			returnArray['diameter'] = _value * 10;
			break;

		case 'diameter':
			returnArray['scaleX'] = parseFloat(_value)/10;
			returnArray['scaleY'] = parseFloat(_value)/10;
			break;
	}

	return returnArray;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.SMILE.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.SMILE.superclass.draw.call(this, _point);

	// SMILE
	var r = 320;

	// Boundary path
	ctx.beginPath();

	// Do an arc
	ctx.arc(0, 0, r, 0, Math.PI * 2, true);

	// Close path to produce straight line
	ctx.closePath();

	// Create transparent fill pattern
	ctx.fillStyle = "rgba(155,255,255,0)";

	// Transparent stroke
	ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(100,100,100,0.9)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.beginPath();
		ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2, true);
		ctx.setLineDash([8,12]);
		ctx.stroke();
		ctx.setLineDash([]);
		
		ctx.beginPath();
		var theta = Math.PI/ 8;
		ctx.arc(0, 0, r, -Math.PI / 2 + theta, -Math.PI / 2 - theta, true);
		ctx.arc(0, 0, r - 30, -Math.PI / 2 - theta, -Math.PI / 2 + theta, false);
		ctx.closePath();
		ctx.fillStyle = "rgba(100,100,200,0.75)";
		ctx.fill();
	}
	
	// Coordinates of handles (in canvas plane)
	var point = new ED.Point(0, 0)
	point.setWithPolars(r, Math.PI/4);
	this.handleArray[2].location = this.transform.transformPoint(point);

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.SMILE.prototype.description = function() {
	var returnString = "";

	returnString = "SMILE";

	return returnString;
}
