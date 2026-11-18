
import { getBestScore } from "./storage.js";
import { startGame, stopGame, pauseGame, resumeGame } from "./game.js";
import { resetSettings } from "./settings.js";
import { selectSkin } from "./skins.js";
import { renderStats } from "./statistics.js";
import { playSound } from "./audio.js";

export const selection = {
  mode: null,  // "classic"
  speed: null, // "easy" | "normal" | "hard"
};

const NOMES_DE_MODO = { classic: "Classic" };
const NOMES_DE_VELOCIDADE = { easy: "Easy", normal: "Normal", hard: "Hard" };

const screens = document.querySelectorAll(".screen");

export function showScreen(name) {
  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.id === `screen-${name}`);
  });

  if (name === "main-menu") updateMenuRecord();
  if (name === "statistics") renderStats();

  // Entrou na tela de jogo? Começa a partida.
  // Saiu pra qualquer outra tela? Garante que o jogo parou.
  if (name === "game") {
    updateGameHud();
    startGame(selection.speed);
  } else {
    stopGame();
  }
}

function updateMenuRecord() {
  document.getElementById("record-value").textContent = getBestScore();
}

function updateGameHud() {
  const modo = NOMES_DE_MODO[selection.mode];
  const velocidade = NOMES_DE_VELOCIDADE[selection.speed];
  document.getElementById("hud-mode").textContent = `${modo} · ${velocidade}`;
}


export function initMenu() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    playSound("click"); // todo botão faz "tic"

    if (button.dataset.mode) selection.mode = button.dataset.mode;
    if (button.dataset.speed) selection.speed = button.dataset.speed;
    if (button.dataset.skin) selectSkin(button.dataset.skin);

    
    if (button.dataset.goto) showScreen(button.dataset.goto);

    // Botões de ação
    const action = button.dataset.action;
    if (action === "retry") startGame(selection.speed); // RETRY e RESTART
    if (action === "pause") pauseGame();
    if (action === "resume") resumeGame();
    if (action === "reset-settings") resetSettings();
  });

  showScreen("main-menu");
}