let attackContainers = [];

let FULL_DASH_ARRAY = 283;

function onAttackClick(params, container, timer) {
  //passe le code seulement lorsque l'attaque est débloquées et off cooldown
  if(!params.onCooldown && params.unlocked){
    params.onCooldown = true;

    //fait apparaitre le timer en svg et applique un filtre gris
    container.classList.toggle("disabled");
    timer.classList.toggle("hidden");
  
    //démarre le timer avec en paramètre l'état du cooldown
    startTimer(params, container, timer);
  
    //envoie le emit au serveur pour relayer vers Unity
    client.emit("webToServer", params.emit);
  }
}

function startTimer(params, container, timer) {
  //applique le temps du timer aux variables
  let cooldownTime = params.cooldown;
  let timeLeft = cooldownTime;
  let timePassed = 0;
  
  //lance la fonction qui applique le bon dasharay au cercle
  setCircleDasharray();

  //commencer l'interval du timer
  let timerInterval = setInterval(() => {
      
    //le temps augmente d'une seconde toutes les milles millisecondes
    timePassed += 1;
    timeLeft = cooldownTime - timePassed;
        
    //lance la fonction qui applique le bon dasharay au cercle
    setCircleDasharray(container, timeLeft, cooldownTime);

    //si le temps est égal a 0, arrête l'interval, on cache le cercle du timer et on reset les variables
    if (timeLeft == 0) {
      params.onCooldown = false;
      clearInterval(timerInterval);
      container.classList.toggle("disabled");
      timer.classList.toggle("hidden");
    }
  }, 10);
}

  
function setCircleDasharray(container, timeleft, cooldownTime) {

  //calcul et applique le dasharay au cercle svg
  const circleDasharray = `${(
    calculateTimeFraction(timeleft, cooldownTime) * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;

  console.log(container);
  container.querySelector("#base-timer-path-remaining").setAttribute("stroke-dasharray", circleDasharray);
}


//fonction qui calcul le dasharay par rapport au nombre de temps restant et au temps total
function calculateTimeFraction(timeLeft, cooldownTime) {
  const rawTimeFraction = timeLeft / cooldownTime;
  return rawTimeFraction - (1 / cooldownTime) * (1 - rawTimeFraction);

}