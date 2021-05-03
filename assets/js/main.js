const Images = {
  imageFront: "assets/images/js-badge.svg",
  image0: "assets/images/angular.svg",
  image1: "assets/images/aurelia.svg",
  image2: "assets/images/backbone.svg",
  image3: "assets/images/ember.svg",
  image4: "assets/images/react.svg",
  image5: "assets/images/vue.svg",
};

const VariaveisDoJogo = {
  podeJogar: true,
};

const modal = document.querySelector(".modal button");
const modalRecomeco = document.querySelector(".modal-template-recomeco");
const modalRecomecoButton = document.querySelector(
  ".modal-template-recomeco button"
);

let AreaCards = [];
const modelo = document.querySelector(".card");
const areaCard = document.querySelector(".area-game");

let cardsClicados = [];

let tentativas = 0;
let cards;

function geraNumeroAleatoriaDaPosicaoDoCard() {
  // numero para pegar a imagem
  const number = Math.floor(Math.random() * 6);
  return number;
}

function embaralhaAsPosicoesDosCards() {
  // vai acontecer até o array possuir 12 elementos
  while (AreaCards.length < 12) {
    const number = geraNumeroAleatoriaDaPosicaoDoCard();
    const filtro = AreaCards.filter((num) => num === number);

    // aqui verifica se no array ' AreaCards ' ja possui o 'number' uma vez, se tiver, só vai ser aceito isso mais uma vez, isso vai resultar em 12 numeros e vai ser: 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, assim vai todas as imagens 2 vezes apenas

    if (filtro.length <= 1) AreaCards.push(number);
  }
}

function colocaOsCardsNaArea() {
  AreaCards.forEach((area, index) => {
    // esse card pega o modelo do card que esta no html e permite que "clone" ele
    const card = modelo.cloneNode(true);
    // pega a imagem que foi selecionada de acordo com a variavel 'area'
    const image = Images[`image${area}`];

    card.querySelector(".flip").dataset.modelo = area;
    card.querySelector(".flip").classList.add("active");

    card.querySelector(".flip .front img").src = Images.imageFront;
    card.querySelector(".flip .back img").src = image;

    areaCard.append(card);
  });

  dificuldadeDoJogo();
}

function dificuldadeDoJogo() {
  const cards = document.querySelectorAll(".area-game .card .flip");
  cards.forEach((c) => {
    setTimeout(() => {
      // aqui remove a class active, assim, as cartas vao virar depois do tempo no timeOut
      c.classList.remove("active");

      // aqui coloca a class que faz com que o card seja clicavel
      c.classList.add("jogavel");
      cardsClicaveis();
    }, 1000);
  });
}

function verificaTamanhoDoArrayCardsClicadoEIndicaQualEAProximaJogada(modelo) {
  // os 2 cards que foram clicados
  const modelosAtivos = [
    ...document.querySelectorAll(".area-game .card .flip.active"),
  ].map((item) => item.dataset.modelo);

  // se caso foi 2 cards foram clicados, vai parar aqui
  if (modelosAtivos.length === 2) {
    // essa variavel 'controla' o jogo, indica se os cards podem ou não ser clicados
    VariaveisDoJogo.podeJogar = false;

    // aqui verifica se os 2 cards clicados são iguais, se sim retorna true, se nao false
    const eIgual = modelosAtivos.reduce((acm, item) => {
      return acm === item ? true : false;
    });

    tentativas++;
    verificaSeErrouOuAcertou(eIgual, modelosAtivos);
  }
}

function verificaSeErrouOuAcertou(eIgual, modelosAtivos) {
  // se os dois cards clicados foram iguais
  if (eIgual) {
    modelosAtivos.forEach((numeroAtivo) => {
      const modeloAtivo = document.querySelectorAll(
        `[data-modelo="${numeroAtivo}"]`
      );
      modeloAtivo.forEach((m) => {
        // aqui faz com que esses dois cards que foram clicados, fiquem 'pra cima' e não fiquem mais disponiveis para serem clicados
        m.classList.remove("active");
        m.classList.remove("jogavel");
        m.classList.add("acertado");

        // aqui remove o evento de clique do card
        m.removeEventListener("click", handleCard);
      });
    });
    VariaveisDoJogo.podeJogar = true;
    cardsClicaveis();
  }
  // se os dois cards clicados foram diferentes
  else {
    setTimeout(() => {
      // aqui tira a class dos 2 cards que faz com que eles fiquem pra cima
      cards.forEach((c) => c.classList.remove("active"));
      // permite que os cards possam ser clicados novamente
      VariaveisDoJogo.podeJogar = true;
    }, 1000);
  }
}

function handleCard({ currentTarget }) {
  let modelo;

  // como dito antes, essa variavel é a que controla o jogo, se ela estiver como true, é pq os cards podem ser clicados
  if (VariaveisDoJogo.podeJogar) {
    currentTarget.classList.toggle("active");
    modelo = currentTarget.dataset.modelo;
    verificaTamanhoDoArrayCardsClicadoEIndicaQualEAProximaJogada(modelo);
  }
}

function cardsClicaveis() {
  // aqui verifica quais cards tem a class clicavel, e adiciona o evento de clique neles
  const cardsClicaveis = document.querySelectorAll(
    ".area-game .card .flip.jogavel"
  );
  cardsClicaveis.forEach((card) => card.addEventListener("click", handleCard));

  // aqui é quando acaba o game, ou seja, quando nao tiver nenhum card clicavel é porque o game acabou
  if (cardsClicaveis.length === 0) modalRecomeco.classList.add("acabou");
}

function initGame({ currentTarget }) {
  currentTarget.parentNode.parentNode.classList.add("game-iniciou");

  embaralhaAsPosicoesDosCards();
  colocaOsCardsNaArea();

  cards = document.querySelectorAll(".area-game .card .flip");
}

function resetGame() {
  VariaveisDoJogo.podeJogar = true;
  cardsClicados = [];
  AreaCards = [];
  tentativas = 0;
  areaCard.innerHTML = "";

  modalRecomeco.classList.remove("acabou");

  embaralhaAsPosicoesDosCards();
  colocaOsCardsNaArea();
  cards = document.querySelectorAll(".area-game .card .flip");
}

modal.addEventListener("click", initGame);
modalRecomecoButton.addEventListener("click", resetGame);
