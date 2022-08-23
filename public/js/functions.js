/**
 * functions.js
 * @description Fonctions du client dans l'application
 * @version 1.0
 * @author FG
 */

function joinRoom(room) {
  console.log("room rejointe : " + room);
  client.emit("checkRoomMatch", { roomToJoin: room });
}

function createLobby() {
  console.log("lobby normalement");
  //création du conteneur global du lobby
  let lobbyContainer = document.createElement("div");
  lobbyContainer.classList.add("lobby-container");

  //création du conteneur de form de connection
  let connectionContainer = document.createElement("div");
  connectionContainer.classList.add("connection-container");

  //création du titre
  let connectionTitle = document.createElement("h1");
  connectionTitle.textContent = "Entrez le code de partie";
  connectionTitle.classList.add("connection-title");

  //création du fomulaire
  let connectionForm = document.createElement("form");
  connectionForm.classList.add("connection-form");

  connectionForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    joinRoom(connectionField.value);
    connectionField.value = "";
  });

  let connectionField = document.createElement("input");
  connectionField.classList.add("connection-field");
  connectionForm.appendChild(connectionField);

  //création du bouton d'envoi
  let connectionSendBtn = document.createElement("div");
  connectionSendBtn.textContent = "Jouer";
  connectionSendBtn.classList.add("connection-btn");

  connectionSendBtn.addEventListener("click", () => {
    joinRoom(connectionField.value);
    connectionField.value = "";
  });

  //lier les enfants aux parents
  connectionContainer.appendChild(connectionTitle);
  connectionContainer.appendChild(connectionForm);
  connectionContainer.appendChild(connectionSendBtn);
  lobbyContainer.appendChild(connectionContainer);
  wrapper.appendChild(lobbyContainer);
}

//Array des icones possibles
let icons = [
  "death.svg",
  "bird.svg",
  "clock.svg",
  "cloud.svg",
  "huh.svg",
  "meteor.svg",
  "thunder.svg",
  "sus.svg",
];

let loadingTextContainer;
let loadingInterval;

function createLoading() {
  //reset du wrapper
  wrapper.innerHTML = "";

  //création du loading container
  let loadingContainer = document.createElement("div");
  loadingContainer.classList.add("loading-container");

  //création du visuel du loader
  let loadingElems = document.createElement("div");
  loadingElems.classList.add("loading-elems");

  //création des images individuelles
  for (let index = 0; index < 3; index++) {
    let element = document.createElement("div");
    element.classList.add("loading-elem-" + index);

    let image = document.createElement("img");
    image.classList.add("fluid");
    let rng = Math.floor(Math.random() * icons.length);
    image.src = "img/icons/" + icons[rng];
    icons.splice(icons.indexOf(icons[rng]), 1);

    element.appendChild(image);
    loadingElems.appendChild(element);
  }

  //création du texte du loader
  let loadingTextContent = "Attendez que le joueur 1 lance la partie";
  let loadingText = document.createElement("div");
  loadingText.classList.add("loading-text");

  let caracters = loadingTextContent.split("");
  caracters.forEach((c, id) => {
    let span = document.createElement("span");
    span.style.animationDelay = 200 * id + "ms";
    span.textContent = c;
    loadingText.appendChild(span);
  });

  loadingText.classList.add("loading-animation");

  loadingTextContainer = loadingText;

  //timer pour relancer l'animation après un délais
  loadingInterval = setInterval(resetTextAnimation, 8600);

  //lier les enfants aux parents
  loadingContainer.appendChild(loadingElems);
  loadingContainer.appendChild(loadingText);
  wrapper.appendChild(loadingContainer);
}

function resetTextAnimation() {
  console.log("reset");
  characters = loadingTextContainer.querySelectorAll("span");
  characters.forEach((c) => {
    c.style.animationName = "none";
    setTimeout(() => {
      c.style.animationName = "jump";
    }, 200);
  });
}

//Game view
let attaqueObjects = [];
let FULL_DASH_ARRAY = 283;
let attaques = [
  {
    name: "Vents forts",
    description:
      "Ajoute un vent d'un force et direction aléatoire que John doit contrer.",
    img: "vents.png",
    cooldown: 5,
    emit: "winds",
    unlocked: true,
    onCooldown: false,
  },
  {
    name: "Oiseaux",
    description: "Lance un oiseau infligeant du dégat à John s'il le frappe.",
    img: "pigeon.png",
    cooldown: 10,
    emit: "bird",
    unlocked: true,
    onCooldown: false,
  },
  {
    name: "Objet aléatoire",
    description:
      "Lance un objet infligeant des dégats aléatoires lorsqu'il frappe John.",
    img: "random.png",
    cooldown: 10,
    emit: "randomObject",
    unlocked: true,
    onCooldown: false,
  },
  {
    name: "Petit hulk",
    description:
      "Projette un petit hulk tuant instantanément John s'il le frappe.",
    img: "petithulk.png",
    cooldown: 15,
    emit: "petithulk",
    unlocked: true,
    onCooldown: false,
  },
  {
    name: "Gros météore",
    description:
      "Fait tomber un météore rendant John instable pendant quelques secondes.",
    img: "meteor.png",
    cooldown: 25,
    emit: "bigMeteor",
    unlocked: false,
    onCooldown: false,
  },
  {
    name: "Dilatation temporelle",
    description: "Accélère le temps pour John pendant 10 secondes.",
    img: "time.png",
    cooldown: 30,
    emit: "timeDilation",
    unlocked: false,
    onCooldown: false,
  },
  {
    name: "Mort instantanée",
    description: "La mort guette John, rend John instable pendant 10 secondes",
    img: "death.png",
    cooldown: 50,
    emit: "suddenDeath",
    unlocked: false,
    onCooldown: false,
  },
  {
    name: "Fureur divine",
    description:
      "Déclenche votre fureur divine, des vents plus violents et une pluie d'attaques guettent John",
    img: "god.png",
    cooldown: 50,
    emit: "divineWrath",
    unlocked: false,
    onCooldown: false,
  },
];

function createGameView() {
  //création du wrapper de l'écran de jeu
  let gameWrapper = document.createElement("div");
  gameWrapper.classList.add("game-wrapper");

  //création du conteneur global du jeu
  let gameContainer = document.createElement("div");
  gameContainer.classList.add("game-container");

  //crée le titre des attaques
  let gameTitle = document.createElement("h1");
  gameTitle.classList.add("game-title");
  gameTitle.textContent =
    "Utilisez vos différentes attaques pour faire échouer John";

  //crée la boite d'informations
  let gameInfos = document.createElement("p");
  gameInfos.classList.add("game-infos");
  gameInfos.textContent = "Sélectionnez une attaque";

  //crée une case pour chaque attaque selon les objets associés
  attaques.forEach((attaque) => {
    //création du conteneur d'attaque
    let container = document.createElement("div");
    container.classList.add("attaque-container");
    container.style.backgroundImage = "url('img/" + attaque.img + "')";

    //ajout du overlay de cooldown (svg source / innerhtml)
    let cooldownOverlay =
      '<svg class="base-timer-svg" viewBox="0 0 100 100"><g class="base-timer-circle"><path id="base-timer-path-remaining" stroke-dasharray="283" color="darkslategray" class="base-timer-path-remaining" d="M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0"></path></g></svg>';

    //ajout du svg dans le conteneur d'attaque
    container.innerHTML = cooldownOverlay;

    //Crée un objet pour chaque attaque à partir des infos
    let attaqueObject = new Attaque(
      attaque.img,
      attaque.cooldown,
      attaque.onCooldown,
      attaque.unlocked,
      attaque.emit,
      container,
      attaque.name,
      attaque.description
    );

    if (!attaqueObject.unlocked) {
      container.classList.add("locked");
    }

    //cache le timer SVG
    attaqueObject.timer.classList.add("hidden");

    //ajout d'action au click / hover
    attaqueObject.container.addEventListener("click", () => {
      attaqueObject.onClick();
    });
    attaqueObject.container.addEventListener("mouseover", () => {
      attaqueObject.onHover();
    });
    attaqueObject.container.addEventListener("mouseout", () => {
      attaqueObject.offHover();
    });

    //ajout de chaque objet à une liste
    attaqueObjects.push(attaqueObject);

    //ajouter le conteneur à l'écran de jeu
    gameContainer.appendChild(container);
  });

  //ajoute le game container au wrapper
  gameWrapper.appendChild(gameTitle);
  gameWrapper.appendChild(gameContainer);
  gameWrapper.appendChild(gameInfos);

  wrapper.appendChild(gameWrapper);
}

function onGameStarted() {
  //reset du wrapper
  wrapper.innerHTML = "";

  clearInterval(loadingInterval);

  createGameView();
}

function onRoomFull() {
  AddAlert(
    "La salle que vous essayez de rejoindre est en pleine partie. Une connexion existante est donc déjà établie."
  );
}

function onRoomNotFound() {
  AddAlert(
    "La salle que vous essayez de rejoindre est inexistante. Créez d'abord une partie en VR pour vous y connecter."
  );
}

function onGameWon() {
  //ramène au lobby
  wrapper.innerHTML = "";
  createLobby();

  //repopulle les icons
  icons = [
    "death.svg",
    "bird.svg",
    "clock.svg",
    "cloud.svg",
    "huh.svg",
    "meteor.svg",
    "thunder.svg",
    "sus.svg",
  ];

  let highestCount = 0;
  let idHighest = 0;
  attaqueObjects.forEach((obj, id) => {
    if (obj.count > highestCount) {
      highestCount = obj.count;
      idHighest = id;
    }
  });

  if (highestCount != 0) {
    AddAlert(
      "Vous avez triomphé! Votre attaque préférée : <" +
        attaqueObjects[idHighest].name +
        "> semble avoir bien fonctionnée.",
      "Victoire!"
    );
  } else {
    AddAlert(
      "Vous avez triomphé sans utiliser d'attaque... Quelle sorcelerie avez-vous employé? Un croche-pied? Peu importe, ça semble bien fonctionner. Continuez comme ça!",
      "Victoire?"
    );
  }
}

function onGameLost() {
  //ramène au lobby
  wrapper.innerHTML = "";
  createLobby();

  //repopulle les icons
  icons = [
    "death.svg",
    "bird.svg",
    "clock.svg",
    "cloud.svg",
    "huh.svg",
    "meteor.svg",
    "thunder.svg",
    "sus.svg",
  ];

  let highestCount = 0;
  let idHighest = 0;
  attaqueObjects.forEach((obj, id) => {
    if (obj.count > highestCount) {
      highestCount = obj.count;
      idHighest = id;
    }
  });

  if (highestCount != 0) {
    AddAlert(
      "Vous avez échoué! Votre attaque préférée : <" +
        attaqueObjects[idHighest].name +
        "> semble être inefficace.",
      "Défaite"
    );
  } else {
    AddAlert(
      "Oups, vous semblez n'avoir utilisé aucune attaque. Essayez d'utiliser vos boutons la prochaine fois!",
      "Défaite..."
    );
  }
}

let btnTexts = ["D'accord", "J'ai compris", "Retour", "Bien reçu", "Réessayer"];

function AddAlert(message, title) {
  //Créer un div écran assombri
  let alertWrapper = document.createElement("div");
  alertWrapper.classList.add("alert-wrapper");

  //Créer un div au centre informant de l'alerte
  let alertContainer = document.createElement("div");
  alertContainer.classList.add("alert-container");

  //Créer le titre
  let alertTitle = document.createElement("h2");
  alertTitle.classList.add("alert-title");
  if (title) {
    alertTitle.textContent = title;
  } else {
    alertTitle.textContent = "Erreur";
  }

  //Créer le texte
  let alertTexte = document.createElement("p");
  alertTexte.classList.add("alert-texte");
  alertTexte.textContent = message;

  //Créer le bouton avec un petit ajout random cool
  let alertBtn = document.createElement("div");
  alertBtn.classList.add("alert-btn");
  //Génère un texte de bouton aléatoire
  alertBtn.textContent = btnTexts[Math.floor(Math.random() * btnTexts.length)];
  //Ajoute un évènement click
  alertBtn.addEventListener("click", () => {
    wrapper.removeChild(alertWrapper);
  });

  //Lier les enfants aux parents
  alertContainer.appendChild(alertTitle);
  alertContainer.appendChild(alertTexte);
  alertContainer.appendChild(alertBtn);
  alertWrapper.appendChild(alertContainer);
  wrapper.appendChild(alertWrapper);
}

function Attaque(img, cd, onCd, unlocked, emit, container, name, description) {
  this.img = img;
  this.onCooldown = onCd;
  this.unlocked = unlocked;
  this.emit = emit;
  this.name = name;
  this.description = description;
  this.count = 0;

  //cooldown
  this.cooldown = cd;
  this.cooldownRef = cd;
  this.otherCooldown = 3;
  this.timeLeft = this.cooldown;
  this.timePassed;
  this.timerInterval;

  this.container = container;
  this.timer = this.container.querySelector(".base-timer-svg");

  this.onHover = () => {
    document.querySelector(".game-infos").textContent =
      this.name + " : " + this.description;
  };
  this.offHover = () => {
    document.querySelector(".game-infos").textContent =
      "Sélectionnez une attaque";
  };

  this.onClick = () => {
    //passe le code seulement lorsque l'attaque est débloquées et off cooldown
    if (!this.onCooldown && this.unlocked) {
      this.onCooldown = true;

      //Ajoute à son compte
      this.count += 1;

      //fait apparaitre le timer en svg et applique un filtre gris
      this.container.classList.toggle("disabled");
      this.timer.classList.toggle("hidden");

      //démarre le timer avec en paramètre l'état du cooldown
      this.startTimer(false);

      //lance les cooldown minimum sur les autres attaques
      attaqueObjects.forEach((obj) => {
        if (!obj.onCooldown && obj.unlocked) {
          obj.onOtherClick();
        }
      });

      //envoie le emit au serveur pour relayer vers Unity
      client.emit("webToServer", this.emit);
    }
  };

  this.onOtherClick = () => {
    this.onCooldown = true;

    //fait apparaitre le timer en svg et applique un filtre gris
    this.container.classList.toggle("disabled");
    this.timer.classList.toggle("hidden");

    //démarre le timer avec en paramètre l'état du cooldown
    this.startTimer(true);
  };

  this.startTimer = (isOther) => {
    //changement du cooldown vers minimum lorsque lancé par une autre attaque
    if (isOther) {
      this.cooldown = this.otherCooldown;
    }

    //applique le temps du timer aux variables
    this.timeLeft = this.cooldown;
    this.timePassed = 0;

    //lance la fonction qui applique le bon dasharay au cercle
    this.setCircleDashoffset();

    //commencer l'interval du timer
    this.timerInterval = setInterval(() => {
      //le temps augmente d'une seconde toutes les milles millisecondes
      this.timePassed += 0.01;
      this.timeLeft = this.cooldown - this.timePassed;

      //lance la fonction qui applique le bon dasharay au cercle
      this.setCircleDashoffset();

      //si le temps est égal a 0, arrête l'interval, on cache le cercle du timer et on reset les variables
      if (this.timeLeft <= 0) {
        this.cooldown = this.cooldownRef; // reset nécessaire lorsque lancé par autre attaque
        this.onCooldown = false;
        clearInterval(this.timerInterval);
        this.container.classList.toggle("disabled");
        this.timer.classList.toggle("hidden");
      }
    }, 10);
  };

  this.setCircleDashoffset = () => {
    //calcul et applique le dasharay au cercle svg
    const circleDashoffset = `${
      this.calculateTimeFraction() * FULL_DASH_ARRAY
    }`;

    this.container
      .querySelector("#base-timer-path-remaining")
      .setAttribute("stroke-dashoffset", circleDashoffset);
  };

  this.calculateTimeFraction = () => {
    const rawTimeFraction = this.timeLeft / this.cooldown;
    return 1 - rawTimeFraction;
  };
}

function onAttackUnlocked(attackName) {
  attaqueObjects.forEach((att) => {
    //Débloque l'attaque si le nom match
    if (att.name == attackName && !att.unlocked) {
      att.unlocked = true;
      att.container.classList.remove("locked");
    }
  });
}
