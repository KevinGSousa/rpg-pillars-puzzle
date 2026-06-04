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

// Função para renderizar os pilares em um círculo
function renderPillars() {
  schools.forEach((school, index) => {
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
      activateSchool(school.id, pillar);
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

// Função para ativar um pilar
function activateSchool(id, pillar){

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

void magicCircle.offsetWidth;

magicCircle.classList.add(id);

  pillar.classList.add("active");
}


renderPillars();