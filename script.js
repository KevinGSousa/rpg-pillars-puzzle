const schools = [
  {
    id: "abjuration",
    name: "Abjuração",
    image: "./assets/images/Abjuracao.png"
  },
  {
    id: "transmutation",
    name: "Transmutação",
    image: "./assets/images/Transmutacao.png"
  },
  {
    id: "evocation",
    name: "Evocação",
    image: "./assets/images/Evocacao.png"
  },
  {
    id: "necromancy",
    name: "Necromancia",
    image: "./assets/images/Necromancia.png"
  },
  {
    id: "illusion",
    name: "Ilusão",
    image: "./assets/images/Ilusao.png"
  }
];

const gameContainer = document.getElementById("game-container");
const magicCircle = document.getElementById("magic-circle");

const sounds = {

  click: new Audio("./assets/audio/select_magic.mp3"),

  success: new Audio("./assets/audio/success.mp3"),

  failure: new Audio("./assets/audio/failure.mp3"),

  completion: new Audio("./assets/audio/magic_success.mp3"),

  dissipate: new Audio("./assets/audio/dissipate.mp3"),

  reform: new Audio("./assets/audio/reform.mp3"),

  abjuration: new Audio("./assets/audio/abjuration.mp3"),

  transmutation: new Audio("./assets/audio/transmutation.mp3"),

  evocation: new Audio("./assets/audio/evocation.mp3"),

  illusion: new Audio("./assets/audio/illusion.mp3"),

  necromancy: new Audio("./assets/audio/necromancy.mp3")
};

// Volume dos sons
sounds.click.volume = 0.15;

sounds.success.volume = 0.25;
sounds.failure.volume = 0.35;

sounds.completion.volume = 0.50;

sounds.dissipate.volume = 0.30;
sounds.reform.volume = 0.20;

sounds.abjuration.volume = 0.20;
sounds.transmutation.volume = 0.20;
sounds.evocation.volume = 0.25;
sounds.illusion.volume = 0.20;
sounds.necromancy.volume = 0.25;

// Ordem correta dos pilares para resolver o enigma
const solution = [
  "abjuration",
  "transmutation",
  "evocation",
  "illusion",
  "necromancy"
];

const shuffledSchools = [...schools]
  .sort(() => Math.random() - 0.5);

const failureMessages = [
  "As runas não estão alinhadas.",
  "A energia se dispersa.",
  "Os pilares rejeitam sua tentativa.",
  "O círculo mágico perde estabilidade.",
  "A compreensão se escapa das suas mãos.",
  "Sua alma sente o peso do fracasso. Você recebe 5 de dano mental.",
  "A mana é parte do ciclo, e o ciclo é parte da mana. O fracasso é apenas um passo para a compreensão. Você perde 10 de mana.",
  "Uma onda de energia negativa se espalha, causando uma sensação de desespero. Você se sente fatigado.",
  "Um grito ecoa em sua mente várias vezes, causando uma dor intensa. Você recebe 10 de dano mental.",
  "Se não enxergas a resposta, não enxergará mais nada. Você fica cego até o fim da cena.",
  "A energia incorreta debilita sua mana. Você fica alquebrado até o fim da cena."
];

let currentStep = 0;
let failures = 0;
let isAnimating = false;
let puzzleSolved = false;

let messageTimeout;

// Função para tocar sons, garantindo que eles possam ser reproduzidos mesmo que já estejam tocando
function playSound(sound){
  sound.currentTime = 0;
  sound.play().catch(() => {});
}


// Função para renderizar os pilares em um círculo
function renderPillars() {
  shuffledSchools.forEach((school, index) => {
    const pillar = document.createElement("div");
    pillar.classList.add("pillar");
    const symbol = document.createElement("img");
    symbol.src = school.image;
    symbol.classList.add("symbol");

    const base = document.createElement("div");
    base.classList.add("pillar-base");

    pillar.appendChild(symbol);
    pillar.appendChild(base);

    pillar.addEventListener("click", () => {
      checkSequence(school.id, pillar);
    });
    
    const angle =
    ((index / schools.length) * (Math.PI * 2))
    - (Math.PI / 2);
    
    const x = 300 + 220 * Math.cos(angle);
    const y = 300 + 220 * Math.sin(angle);
    
    pillar.style.left = `${x - 40}px`;
    pillar.style.top = `${y - 70}px`;
    
    gameContainer.appendChild(pillar);
    
  });
  
}

// Função para verificar a sequência dos pilares
function checkSequence(id, pillar){
  
  if(isAnimating || puzzleSolved){
    return;
  }
  playSound(sounds.click);
  activateSchool(id);
  const expectedSchool = solution[currentStep];
  
  if(id === expectedSchool){
    if(sounds[id]){
      playSound(sounds[id]);
    }
    pillar.classList.add("active");
    currentStep++;
    updateProgress();
    if(currentStep === solution.length){
      completePuzzle();
    }
  } else {
    failures++;
    playSound(sounds.failure);
    checkPunishments();
    if(failures % 2 === 0){
      randomFailureMessage();
    }
    console.log("Errou!");
    isAnimating = true;
    setTimeout(() => {
      playSound(sounds.dissipate);
      gameContainer.classList.add("dissipating");
      setTimeout(() => {
        resetPuzzle();
        gameContainer.classList.remove("dissipating");
        playSound(sounds.reform);
        gameContainer.classList.add("reforming");

        setTimeout(() => {
          gameContainer.classList.remove("reforming");
          isAnimating = false;
        }, 1200);
      }, 1200);
    }, 2000);
  }
}

// Função para resetar o puzzle
function resetPuzzle(){
  currentStep = 0;
  document.querySelectorAll(".pillar").forEach(p => {
    p.classList.remove("active");
  });
  magicCircle.classList.remove(
    "abjuration",
    "transmutation",
    "evocation",
    "necromancy",
    "illusion"
  );
  gameContainer.classList.remove(
    "stage-1",
    "stage-2",
    "stage-3",
    "stage-4",
    "completed"
  );
}

// Função para atualizar o progresso visual do círculo mágico
function updateProgress() {
  gameContainer.classList.remove(
    "stage-1",
    "stage-2",
    "stage-3",
    "stage-4",
    "completed"
  );

  switch(currentStep){

    case 1:
      gameContainer.classList.add("stage-1");
      break;

    case 2:
      gameContainer.classList.add("stage-2");
      break;

    case 3:
      gameContainer.classList.add("stage-3");
      break;

    case 4:
      gameContainer.classList.add("stage-4");
      break;

    case 5:
      gameContainer.classList.add("completed");
      break;
  }
}

// Função para mostrar uma mensagem de falha aleatória
function randomFailureMessage() {
  const msg =
    failureMessages[
      Math.floor(Math.random() * failureMessages.length)
    ];

  showMessage(msg);
}

// Função para mostrar punições baseadas no número de falhas
function checkPunishments(){
  if(failures === 3){
  showMessage(
      "Um choro distante ecoa pelo ambiente... Você sente um arrepio na espinha, algo parece ter sido despertado."
    );
  }
  if(failures === 5){
    showMessage(
      "O círculo consome parte da energia acumulada. Você sente uma fraqueza momentânea enquanto algo parece te notar..."
    );
  }
  if(failures === 9){
    showMessage(
      "Uma presença sombria parece se aproximar de você. O ambiente fica mais frio, e uma sensação de desespero te envolve. Você sente que algo está muito perto de te encontrar..."
    );
  }
  if(failures === 11){
    showMessage(
      "Uma voz sussurrante ecoa em seus ouvidos: 'Você não está pronto para enfrentar o mistério.' O ambiente se torna opressivo, e uma sensação de medo intenso te domina. Faça um teste de iniciativa."
    );
  }
}

// Função para mostrar mensagens temporárias
function showMessage(text){
  const box = document.getElementById("message-box");
  clearTimeout(messageTimeout);

  box.textContent = text;
  box.style.opacity = "1";

  messageTimeout = setTimeout(() => {
    box.style.opacity = "0";
  }, 6000);
}
// Função para ativar um pilar
function activateSchool(id){
  magicCircle.classList.remove(
    "abjuration",
    "transmutation",
    "evocation",
    "necromancy",
    "illusion"
  );
  void magicCircle.offsetWidth;
  magicCircle.classList.add(id);
}

// Função para completar o puzzle
function completePuzzle(){
  puzzleSolved = true;
  playSound(sounds.completion);
  magicCircle.classList.remove(
    "abjuration",
    "transmutation",
    "evocation",
    "necromancy",
    "illusion"
);
  showMessage(
    "O ritual foi concluído. A passagem foi despertada."
  );
}

renderPillars();