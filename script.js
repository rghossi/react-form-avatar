var email = document.querySelector('#email');
var password = document.querySelector('#password');

var mySVG = document.querySelector('.svgContainer');

var mouthBG = document.querySelector('.mouthBG');
var mouthSmallBG = document.querySelector('.mouthSmallBG');
var mouthMediumBG = document.querySelector('.mouthMediumBG');
var mouthLargeBG = document.querySelector('.mouthLargeBG');
var mouthMaskPath = document.querySelector('#mouthMaskPath');
var mouthOutline = document.querySelector('.mouthOutline');
var outerEarL = document.querySelector('.earL .outerEar');
var outerEarR = document.querySelector('.earR .outerEar');

var eyeMaxHorizD = 10, eyeMaxVertD = 5;
var noseMaxHorizD = 10, noseMaxVertD = 1;


function buildInitialState() {
	return {
		leftEar: {
			element: document.querySelector('.earL .outerEar'),
			x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0,
		},
		rightEar: {
			element: document.querySelector('.earR .outerEar'),
			x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0,
		},
		face: {
			element: document.querySelector('.face'),
			x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0,
		},
		eye: {
			element: document.querySelector('.eyeL'),
			x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0,
		},
		iris: {
			element: document.querySelector('.eyeR'),
			x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0,
		},
		mouth: {
			element: document.querySelector('.mouth'),
			x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0,
		},
		leftArm: {
			element: document.querySelector('.armL'),
			x: -93, y: +22, scaleX: 1, scaleY: 1, rotation: +105, transformOrigin: "top left",
		},
		rightArm: {
			element: document.querySelector('.armR'),
			x: -93, y: +22, scaleX: 1, scaleY:1, rotation: -105, transformOrigin: "top right",
		},
	};
}
function copyState(state) {
	return Object.assign({}, state)
}
let globalState = buildInitialState();


function updateOrientation() {
	var carPos = email.selectionEnd,
		div = document.createElement('div'),
		span = document.createElement('span'),
		copyStyle = getComputedStyle(email),
		emailCoords = {}, caretCoords = {}, centerCoords = {}
	;
	[].forEach.call(copyStyle, function(prop){
		div.style[prop] = copyStyle[prop];
	});
	div.style.position = 'absolute';
	document.body.appendChild(div);
	div.textContent = email.value.substr(0, carPos);
	span.textContent = email.value.substr(carPos) || '.';
	div.appendChild(span);
	
	emailCoords = getPosition(email);
	caretCoords = getPosition(span);
	centerCoords = getPosition(mySVG);
	const svgCoords = getPosition(mySVG);
	const screenCenter = centerCoords.x + (mySVG.offsetWidth / 2);
	const caretPos = caretCoords.x + emailCoords.x;
	
	const dFromC = screenCenter - caretPos;
	var pFromC = Math.round((caretPos / screenCenter) * 100) / 100;
	if(pFromC < 1) {
		
	} else if(pFromC > 1) {
		pFromC -= 2;
		pFromC = Math.abs(pFromC);
	}

	let eyeDistH = -dFromC * .05;
	if(eyeDistH > eyeMaxHorizD) {
		eyeDistH = eyeMaxHorizD;
	} else if(eyeDistH < -eyeMaxHorizD) {
		eyeDistH = -eyeMaxHorizD;
	}
	
	var eyeCoords = {x: svgCoords.x + 84, y: svgCoords.y + 76};
	var irisCoords = {x: svgCoords.x + 113, y: svgCoords.y + 76};
	var noseCoords = {x: svgCoords.x + 97, y: svgCoords.y + 81};
	var mouthCoords = {x: svgCoords.x + 100, y: svgCoords.y + 100};
	var eyeLAngle = getAngle(eyeCoords.x, eyeCoords.y, emailCoords.x + caretCoords.x, emailCoords.y + 25);
	var eyeLX = Math.cos(eyeLAngle) * eyeMaxHorizD;
	var eyeLY = Math.sin(eyeLAngle) * eyeMaxVertD;
	var eyeRAngle = getAngle(irisCoords.x, irisCoords.y, emailCoords.x + caretCoords.x, emailCoords.y + 25);
	var eyeRX = Math.cos(eyeRAngle) * eyeMaxHorizD;
	var eyeRY = Math.sin(eyeRAngle) * eyeMaxVertD;
	var noseAngle = getAngle(noseCoords.x, noseCoords.y, emailCoords.x + caretCoords.x, emailCoords.y + 25);
	var noseX = Math.cos(noseAngle) * noseMaxHorizD;
	var noseY = Math.sin(noseAngle) * noseMaxVertD;
	var mouthAngle = getAngle(mouthCoords.x, mouthCoords.y, emailCoords.x + caretCoords.x, emailCoords.y + 25);
	var mouthX = Math.cos(mouthAngle) * noseMaxHorizD;
	var mouthY = Math.sin(mouthAngle) * noseMaxVertD;
	var mouthR = Math.cos(mouthAngle) * 6;
	var chinX = mouthX * .8;
	var chinY = mouthY * .5;
	var chinS = 1 - ((dFromC * .15) / 100);
	if(chinS > 1) {chinS = 1 - (chinS - 1);}
	var faceX = mouthX * .3;
	var faceY = mouthY * .4;
	var faceSkew = Math.cos(mouthAngle) * 5;
	var eyebrowSkew = Math.cos(mouthAngle) * 25;
	var outerEarX = Math.cos(mouthAngle) * 4;
	var outerEarY = Math.cos(mouthAngle) * 5;
	var hairX = Math.cos(mouthAngle) * 6;
	var hairS = 1.2;
	
	const nextGlobalState = copyState(globalState);
	nextGlobalState.leftEar = {
		...nextGlobalState.leftEar, x: outerEarX, y: -outerEarY,
	}
	nextGlobalState.rightEar = {
		...nextGlobalState.rightEar, x: outerEarX, y: outerEarY,
	}
	nextGlobalState.face = {
		...nextGlobalState.face, x: -faceX, y: -faceY, transformOrigin: "center top",
	}
	nextGlobalState.eye = {
		...nextGlobalState.eye, x: -eyeLX, y: -eyeLY,
	}
	nextGlobalState.iris = {
		...nextGlobalState.iris, x: -eyeRX, y: -eyeRY,
	}
	nextGlobalState.mouth = {
		...nextGlobalState.mouth, x: -mouthX, y: -mouthY,
	}
	
	document.body.removeChild(div);
	console.log("Call transition from updateOrientation");
	transitionTo(nextGlobalState);
};

function updateExpression() {
	let curEmailIndex = email.selectionEnd;
	let nextGlobalState = copyState(globalState);

	console.log(curEmailIndex)
	console.log(curEmailIndex === 0)
	if(curEmailIndex === 0) {
		console.log("HERE0")
		nextGlobalState.eye = {
			...nextGlobalState.eye, scaleX: 1, scaleY:1,
		}
		nextGlobalState.iris = {
			...nextGlobalState.iris, scaleX: 1, scaleY:1,
		}
	}
	else if(!email.value.includes("@")) {
		console.log("HERE1")
		nextGlobalState.eye = {
			...nextGlobalState.eye, scaleX: .85, scaleY: .85,
		}
		nextGlobalState.iris = {
			...nextGlobalState.iris, scaleX: .85, scaleY: .85,
		}
	}
	else {
		console.log("HERE2")
		nextGlobalState.eye = {
			...nextGlobalState.eye, scaleX: .65, scaleY: .65,
		}
		nextGlobalState.iris = {
			...nextGlobalState.iris, scaleX: .65, scaleY: .65,
		}
	}

	console.log("Call transition from updateExpression");
	transitionTo(nextGlobalState);
}

function coverEyes() {
	let nextGlobalState = buildInitialState();
	nextGlobalState.leftArm = {
		...nextGlobalState.leftArm,
		x: -93, y: 2, rotation: 0,
	}
	nextGlobalState.rightArm = {
		...nextGlobalState.rightArm,
		x: -93, y: 2, rotation: 0,
	}
	transitionTo(nextGlobalState);
}

function uncoverEyes() {
	let nextGlobalState = copyState(globalState);
	nextGlobalState.leftArm = {
		...nextGlobalState.leftArm, y: 220, rotation: 105
	}
	nextGlobalState.rightArm = {
		...nextGlobalState.rightArm, y: 220, rotation: -105
	}
	transitionTo(nextGlobalState);
}

function resetAvatar() {
	const nextGlobalState = buildInitialState();
	transitionTo(nextGlobalState);
}

function transitionTo(nextGlobalState, milliseconds = 500) {
	components = Object.keys(globalState);
	elements = components.map(c => globalState[c].element);
	oldStates = components.map(c => globalState[c]);
	newStates = components.map(c => nextGlobalState[c]);
	for (i = 0; i < components.length; i++)
		animate(elements[i], oldStates[i], newStates[i], milliseconds);
	globalState = nextGlobalState;
}

// GEOMETRY STUFF
function getAngle(x1, y1, x2, y2) {
	return Math.atan2(y1 - y2, x1 - x2);
}
function getPosition(element) {
	var xPos = 0;
	var yPos = 0;

	while (element) {
		if (element.tagName == "BODY") {
			var xScroll = element.scrollLeft || document.documentElement.scrollLeft;
			var yScroll = element.scrollTop || document.documentElement.scrollTop;

			xPos += (element.offsetLeft - xScroll + element.clientLeft);
			yPos += (element.offsetTop - yScroll + element.clientTop);
		} else {
			xPos += (element.offsetLeft - element.scrollLeft + element.clientLeft);
			yPos += (element.offsetTop - element.scrollTop + element.clientTop);
		}

		element = element.offsetParent;
	}
	return {
		x: xPos,
		y: yPos
	};
}

// ANIMATION STUFF
function state2transform(state) {
	transform = [];

	// rotate first
	if (!(state.rotation === undefined)) transform.push('rotate(' + state.rotation + 'deg)')

	// then scale
	else if (!(state.scaleX === undefined))
		transform.push('scaleX(' + state.scaleX + ')');
	else if (!(state.scaleY === undefined))
		transform.push('scaleY(' + state.scaleY + ')');

	// finally translate
	if (!(state.x === undefined))
		transform.push('translateX(' + state.x + 'px)');
	if (!(state.y === undefined))
		transform.push('translateY(' + state.y + 'px)');

	return transform.join(' ');
}
function animate(element, oldState, newState, milliseconds) {
	console.log("Animating [" + element.classList + "] from:\n" + JSON.stringify(oldState) + "\nto:\n" + JSON.stringify(newState));
	element.animate([
		{ transform: state2transform(oldState) },
		{ transform: state2transform(newState) },
	], {
		duration: milliseconds,
		fill: 'forwards',
		easing: 'ease-in-out',
	});
}

// LISTENERS AND HANDLERS
function onEmailFocus(e) {
	e.target.parentElement.classList.add("focusWithText");
	updateOrientation();
}
function onEmailInput(e) {
	updateOrientation();
	updateExpression();
}
function onEmailBlur(e) {
	if(e.target.value == "") {
		e.target.parentElement.classList.remove("focusWithText");
	}
	resetAvatar();
}
function onPasswordFocus(e) {
	coverEyes();
}
function onPasswordBlur(e) {
	uncoverEyes();
}

email.addEventListener('focus', onEmailFocus);
email.addEventListener('blur', onEmailBlur);
email.addEventListener('input', onEmailInput);
password.addEventListener('focus', onPasswordFocus);
password.addEventListener('blur', onPasswordBlur);

resetAvatar();
