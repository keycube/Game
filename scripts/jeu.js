const texts = [
  "Au clair de lune, le kangourou philosophe a décidé de jouer du piano sur la plage, étonnant les poissons volants avec sa mélodie d'algues marines chantantes.",
  "Lors d'un après-midi ensoleillé, le chapeau magique s'est mis à raconter des anecdotes sur le temps où il était un parapluie, dansant dans les rues pavées d'une ville perdue.",
  "Sur la crête d'une montagne en chocolat, le dragon en peluche cherchait désespérément un lac de limonade pour y plonger ses ailes en guimauve et se rafraîchir.",
  "Dans la bibliothèque secrète du désert, les cactus littéraires organisaient des débats passionnés sur l'importance des mirages dans la culture populaire des dunes vagabondes.",
  "Un soir d'hiver, les étoiles en confiture ont décidé d'inviter la comète en biscuit pour une soirée théâtrale où le soleil jouerait le rôle d'un muffin perdu dans l'espace.",
  "La grenouille en velours, perchée sur un nuage en barbe à papa, chantait des serenades à une mouette érudite, tout en contemplant les arcs-en-ciel nocturnes.",
  "Le robot poète, naviguant sur une mer de thé, écrivait des poèmes sur les émotions des montagnes lorsqu'elles rêvent de devenir des volcans en ébullition.",
  "Dans un royaume lointain, les arbres en macaron discutaient philosophiquement avec les fleurs en nougat sur l'éphémérité de la douceur dans un monde sucré.",
];

const textInputElement = document.getElementById("text-input");
const restartGameElement = document.getElementById("restart-game");
const importTextElement = document.getElementById("importTextBtn");
const fileInputElement = document.getElementById("fileInput");
const importFromTextAreaBtn = document.getElementById("importFromTextAreaBtn");
const textAreaContainer = document.getElementById("textAreaContainer");
const validateTextAreaBtn = document.getElementById("validateTextAreaBtn");
const timeDisplay = document.getElementById("timer");
const wpmdisplay = document.getElementById("wpm");
const accuracydisplay = document.getElementById("accuracy");
const links = document.querySelectorAll("nav li");
var intervalId;

var game = {
  randomText: "",
  userText: "",
  hasStarted: false,
  startTime: new Date(),
  correctKeyPresses: 0,
  totalKeyPresses: 0,
  customTexts: null,
};

//###initialise le jeu###
function initializeGame() {
  clearInterval(intervalId);

  if (game.customTexts && game.customTexts.length > 0) {
    game.randomText = game.customTexts[Math.floor(Math.random() * game.customTexts.length)];
  } 
  else {
    game.randomText = texts[Math.floor(Math.random() * texts.length)];
  }

  game.userText = "";
  game.correctKeyPresses = 0;
  game.totalKeyPresses = 0;
  game.hasStarted = false;
  game.startTime = 0;
  textInputElement.innerHTML = "";

  if (!game.randomText) {
    game.randomText = texts[Math.floor(Math.random() * texts.length)];
  }

  for (character of game.randomText) {
    const span = document.createElement("letter");
    span.textContent = character;
    textInputElement.appendChild(span);
  }

  const cursorSpan = document.getElementById("cursor");
  if (!cursorSpan) {
    const newCursor = document.createElement("span");
    newCursor.id = "cursor";
    textInputElement.appendChild(newCursor);
  } 
  else {
    textInputElement.appendChild(cursorSpan);
  }

  updateCursorPosition();

  timeDisplay.textContent = "Time: 00:00:000";
  wpmdisplay.textContent = "WPM: 0.00";
  accuracydisplay.textContent = "Accuracy: 0.00%";
}

//###Demarre le jeu###
function startGame() {
  if (!game.hasStarted) {
    game.hasStarted = true;
    game.startTime = Date.now();
    intervalId = setInterval(updateStats, 1);
  }
}

//###Fin du jeu###
function endGame() {
  clearInterval(intervalId);
}

//###Réinitialise le jeu###
function resetGame() {
  game.userText = "";

  for (element of textInputElement.children) {
    element.classList.remove("correct", "incorrect", "final");
  }

  game.hasStarted = false;
}

function nextGame() {
  initializeGame();
}

//###Evalue chaques caractères au texte de référence et leur applique un style###
function evaluateInput(event) {
  event.stopPropagation();

  if (!game.hasStarted) {
    startGame();
  }

  if (event.key === "Backspace" && game.userText.length > 0) {
    game.userText = game.userText.slice(0, -1);
    document.getElementsByTagName("letter")[game.userText.length].classList.remove("correct", "incorrect", "final");
  } 
  else if (event.key.length === 1) {
    game.userText += event.key;
    game.totalKeyPresses++;

    if (event.key === game.randomText[game.userText.length - 1]) {
      document.getElementsByTagName("letter")[game.userText.length - 1].classList.add("correct");
      game.correctKeyPresses++;
    } 
    else {
      document.getElementsByTagName("letter")[game.userText.length - 1].classList.add("incorrect");
    }
  }

  updateCursorPosition();

  if (game.userText.length >= game.randomText.length) {
    endGame();
  }
}

initializeGame();
document.addEventListener("keydown", evaluateInput);

//###Actualise la position du curseur###
function updateCursorPosition() {
  let cursor = document.getElementById("cursor");
  let currentPos = game.userText.length;
  const letters = document.getElementsByTagName("letter");

  if (currentPos > letters.length) {
    currentPos = letters.length;
  }

  if (currentPos < letters.length) {
    textInputElement.insertBefore(cursor, letters[currentPos]);
  } else {
    textInputElement.appendChild(cursor);
  }
}

//###Actualise les stats de la partie###
function updateStats() {
  const currentTime = Date.now();
  const timeElapsed = currentTime - game.startTime;
  const seconds = Math.floor(timeElapsed / 1000);
  const formattedMinutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const formattedSeconds = (seconds % 60).toString().padStart(2, "0");
  const formattedMilliseconds = (timeElapsed % 1000).toString().padStart(3, "0");
  timeDisplay.textContent = `Time: ${formattedMinutes}:${formattedSeconds}:${formattedMilliseconds}`;

  const charCount = game.userText.length;
  const wpm = timeElapsed / 1000 > 0 ? charCount / 5 / (timeElapsed / 60000) : 0;
  wpmdisplay.textContent = `WPM: ${wpm.toFixed(2)}`;

  if (game.totalKeyPresses > 1) {
    const accuracy = (game.correctKeyPresses / game.totalKeyPresses) * 100;
    const accuracyDisplay = document.getElementById("accuracy");
    accuracyDisplay.textContent = `Accuracy: ${accuracy.toFixed(2)}%`;
  }
}

function checkWordCount() {
  const textArea = document.getElementById("textAreaInput");
  const words = textArea.value.trim().split(/\s+/);
  const wordCount = words.length;
  const validateBtn = document.getElementById("validateTextAreaBtn");
  const messageElement = document.getElementById("wordCountMessage");

  if (wordCount >= 5 && wordCount <= 50) {
    validateBtn.disabled = false;
    messageElement.style.display = "none";
  } else {
    validateBtn.disabled = true;
    messageElement.style.display = "block";
    messageElement.textContent = "Le texte doit contenir entre 5 et 50 mots.";
  }
}

document.getElementById("textAreaInput").addEventListener("input", checkWordCount);

document.addEventListener("DOMContentLoaded", function () {
  checkWordCount();
});

document.getElementById("importFromTextAreaBtn").addEventListener("click", function () {
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    document.body.appendChild(overlay);

    document.querySelectorAll("body > *").forEach((el) => {
      if (!el.contains(document.getElementById("textAreaInput")) && !el.contains(document.getElementById("validateTextAreaBtn"))) {
        el.classList.add("blur-background");
      }
    });

    document.getElementById("textAreaInput").classList.add("clear-element");
    document.getElementById("validateTextAreaBtn").classList.add("clear-element");
});

document.getElementById("validateTextAreaBtn").addEventListener("click", function () {
    document.querySelectorAll(".blur-background").forEach((el) => el.classList.remove("blur-background"));
    document.querySelectorAll(".clear-element").forEach((el) => el.classList.remove("clear-element"));
    document.querySelector(".overlay").remove();
});

icons.addEventListener("click", () => {
  nav.classList.toggle("open");
});

links.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
  });
});

importFromTextAreaBtn.addEventListener("click", function () {
  textAreaContainer.style.display = "block";
  document.getElementById("textAreaInput").focus();

  document.removeEventListener("keydown", evaluateInput);
});

validateTextAreaBtn.addEventListener("click", function () {
  const textAreaContent = document.getElementById("textAreaInput").value;
  if (textAreaContent) {
    game.customTexts = textAreaContent.split("\n");
    initializeGame();
  }
  textAreaContainer.style.display = "none";
  document.addEventListener("keydown", evaluateInput);
});

importTextElement.addEventListener("click", function () {
  fileInputElement.click();
});

fileInputElement.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      game.customTexts = text.split("\n");
      initializeGame();
    };
    reader.readAsText(file);
  } 
  else {
    initializeGame();
  }
});

function initializeGameWithText(text) {
  game.randomText = text;
  initializeGame();
}

/* Three.js */

/*
let scene, camera, renderer, cube, keys = [];
let isDragging = false;
const CUBE_SIZE = 1;
const BUTTON_SIZE = CUBE_SIZE / 5;
	
function createButton(x, y, z, rotation) {
    const geometry = new THREE.PlaneGeometry(BUTTON_SIZE, BUTTON_SIZE);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        side: THREE.DoubleSide,
        transparent: true, 
        opacity: 1       
    });
    const button = new THREE.Mesh(geometry, material);
    button.position.set(x, y, z);
    button.rotation.set(rotation.x, rotation.y, rotation.z);
    return button;
}

function setButtonOpacity(opacity) {
    cube.children.forEach(child => {
        if (child.isMesh) {
            child.material.opacity = opacity;
        }
    });
}

	
function addButtonsToFace(cube, face) {
	const OFFSET = CUBE_SIZE / 4;
	for (let i = -1.5; i <= 1.5; i++) {
		for (let j = -1.5; j <= 1.5; j++) {
			let button;
			switch(face) {
				case 'front':
					button = createButton(i * OFFSET, j * OFFSET, CUBE_SIZE / 2, { x: 0, y: 0, z: 0 });
					break;
				case 'back':
					button = createButton(i * OFFSET, j * OFFSET, -CUBE_SIZE / 2, { x: Math.PI, y: 0, z: 0 });
					break;
				case 'left':
					button = createButton(-CUBE_SIZE / 2, j * OFFSET, i * OFFSET, { x: 0, y: -Math.PI/2, z: 0 });
					break;
				case 'right':
					button = createButton(CUBE_SIZE / 2, j * OFFSET, i * OFFSET, { x: 0, y: Math.PI/2, z: 0 });
					break;
				case 'top':
					button = createButton(i * OFFSET, CUBE_SIZE / 2, j * OFFSET, { x: -Math.PI/2, y: 0, z: 0 });
					break;
			}
			cube.add(button);
		}
	}
}

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

function onDocumentMouseDown(e) {
    restartGameElement.blur();
    isDragging = true;
}

function onDocumentMouseUp(e) {
    restartGameElement.focus();
    isDragging = false;
}

function onDocumentMouseMove(e) {
    if (isDragging) {
        const deltaX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
        const deltaY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

        cube.rotation.y += deltaX * 0.01;
        cube.rotation.x += deltaY * 0.01;
    }
}
	
function init() {
    // Initialiser la scène
    scene = new THREE.Scene();
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 2; 
    camera = new THREE.OrthographicCamera(
        frustumSize * aspect / -2, frustumSize * aspect / 2,
        frustumSize / 2, frustumSize / -2,
        1, 1000
    );

    // Initialiser le rendu
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(225, 150);
   // document.getElementById('cubeCanvas').appendChild(renderer.domElement);
    renderer.setClearColor(0x323437);
    //0x323437
    // Créer un cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ 
    color: 0x000000,
    opacity: 1,
    transparent: true,
    polygonOffset: true,
    polygonOffsetFactor: 1,  
    polygonOffsetUnits: 1
    });

    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    addButtonsToFace(cube, 'front');
    addButtonsToFace(cube, 'back');
    addButtonsToFace(cube, 'left');
    addButtonsToFace(cube, 'right');
    addButtonsToFace(cube, 'top');
    camera.position.z = 3;

    // Gestion du redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
        const width = window.innerWidth * 0.75; 
        const height = window.innerHeight * 0.75; 
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    document.addEventListener('keydown', onDocumentKeyDown, false);
    renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
    renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
    renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);

    animate();
}


	
function onDocumentKeyDown(event) {
    const delta = 0.1;

    if (event.ctrlKey) { 
        cube.material.opacity = Math.min(1, cube.material.opacity + 0.1);
    } 
	
	else if (event.shiftKey) { 
        cube.material.opacity = Math.max(0, cube.material.opacity - 0.1);
    } 

	else {
        
        switch (event.keyCode) {
            case 37: 
                cube.position.x -= delta;
                break;
            case 39: 
                cube.position.x += delta;
                break;
            case 38: 
                cube.position.y += delta;
                break;
            case 40: 
                cube.position.y -= delta;
                break;
            case 107: 
                setButtonOpacity(Math.min(1, cube.children[0].material.opacity + 0.1));
                break;
            case 109: 
                setButtonOpacity(Math.max(0, cube.children[0].material.opacity - 0.1));
                break;
        }
    }
}

init();
	
	
*/
