// ============================================================
//  DIAGRAMA DE TUBULAÇÃO — index.js
//  Responsável por:
//    - Pan (arrastar o canvas com mouse e touch)
//    - Zoom (scroll do mouse e pinch no touch)
//    - Válvulas (toggle aberta/fechada)
// ============================================================

(function () {
  'use strict';

  // ----------------------------------------------------------
  // Dimensões do diagrama desenhado (canvas interno em px)
  // ----------------------------------------------------------
  const DIAGRAM_W = 1150;
  const DIAGRAM_H = 780;

  // ----------------------------------------------------------
  // Referências ao DOM
  // ----------------------------------------------------------
  const canvas    = document.getElementById('canvas');
  const btnReset  = document.getElementById('btn-reset');
  const btnFit    = document.getElementById('btn-fit');
  const coordsEl  = document.getElementById('coords');
  const escalaEl  = document.getElementById('escala-label');

  // ----------------------------------------------------------
  // Estado de pan / zoom
  // ----------------------------------------------------------
  let offsetX = 0;
  let offsetY = 0;
  let scale   = 1;

  // ----------------------------------------------------------
  // Aplica transform no canvas
  // ----------------------------------------------------------
  function aplicarTransform() {
    canvas.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;

    if (coordsEl) coordsEl.textContent  = `x: ${Math.round(offsetX)} · y: ${Math.round(offsetY)}`;
    if (escalaEl) escalaEl.textContent  = `zoom: ${Math.round(scale * 100)}%`;
  }

  // ----------------------------------------------------------
  // Fit: escala o diagrama para caber na viewport
  // ----------------------------------------------------------
  function fitScreen() {
    const vw = window.innerWidth  - 40;
    const vh = window.innerHeight - 70;
    scale   = Math.min(vw / DIAGRAM_W, vh / DIAGRAM_H);
    offsetX = (window.innerWidth  - DIAGRAM_W * scale) / 2;
    offsetY = (window.innerHeight - DIAGRAM_H * scale) / 2;
    aplicarTransform();
  }

  // ----------------------------------------------------------
  // Reset: volta para escala 1:1 centralizado
  // ----------------------------------------------------------
  function centralizar() {
    scale   = 1;
    offsetX = (window.innerWidth  - DIAGRAM_W) / 2;
    offsetY = (window.innerHeight - DIAGRAM_H) / 2;
    aplicarTransform();
  }

  // ----------------------------------------------------------
  // Pan — Mouse
  // ----------------------------------------------------------
  let isDragging = false;
  let startX     = 0;
  let startY     = 0;

  document.addEventListener('mousedown', (e) => {
    if (e.target.closest('#painel')) return;
    isDragging = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
    document.body.style.cursor = 'grabbing';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
    aplicarTransform();
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.cursor = '';
  });

  // ----------------------------------------------------------
  // Zoom — Scroll do mouse (centrado no cursor)
  // ----------------------------------------------------------
  document.addEventListener('wheel', (e) => {
    e.preventDefault();
    const fator  = e.deltaY > 0 ? 0.9 : 1.1;
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    offsetX = mouseX - (mouseX - offsetX) * fator;
    offsetY = mouseY - (mouseY - offsetY) * fator;
    scale   = Math.min(Math.max(scale * fator, 0.15), 4);

    aplicarTransform();
  }, { passive: false });

  // ----------------------------------------------------------
  // Pan + Pinch-zoom — Touch
  // ----------------------------------------------------------
  let lastTouchDist = null;

  document.addEventListener('touchstart', (e) => {
    if (e.target.closest('#painel')) return;
    if (e.touches.length === 1) {
      isDragging = true;
      startX = e.touches[0].clientX - offsetX;
      startY = e.touches[0].clientY - offsetY;
    }
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && isDragging) {
      offsetX = e.touches[0].clientX - startX;
      offsetY = e.touches[0].clientY - startY;
      aplicarTransform();

    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (lastTouchDist) {
        scale = Math.min(Math.max(scale * (dist / lastTouchDist), 0.15), 4);
        aplicarTransform();
      }
      lastTouchDist = dist;
    }
  }, { passive: false });

  document.addEventListener('touchend', () => {
    isDragging    = false;
    lastTouchDist = null;
  });

  // ----------------------------------------------------------
  // Válvulas — toggle aberta / fechada ao clicar
  // ----------------------------------------------------------
  
function initValvulas() {
    document.querySelectorAll('.valvula').forEach((valvula) => {
      // Evita registrar o listener mais de uma vez
      if (valvula.dataset.init) return;
      valvula.dataset.init = '1';

      valvula.addEventListener('click', (e) => {
        e.stopPropagation(); // não propaga para o pan/zoom do canvas
        
        // Mantém o comportamento visual da válvula que já existia
        valvula.classList.toggle('fechada');
   
      });
    });
  }

    const rl01 = document.getElementById('chiller01');
    const rl02 = document.getElementById('chiller02');
    const rl03 = document.getElementById('chiller03');
    const rl04 = document.getElementById('chiller04');
    const rl05 = document.getElementById('chiller05');
    const rl06 = document.getElementById('chiller06');

    rl01.addEventListener('click', () => {
      rl01.classList.toggle('fachada');
      rl01.classList.toggle('desligado');
    });

    rl02.addEventListener('click', () => {
      rl02.classList.toggle('fachada');
      rl02.classList.toggle('desligado');
    });
      rl03.addEventListener('click', () => {
      rl03.classList.toggle('fachada');
      rl03.classList.toggle('desligado');
    });
      rl04.addEventListener('click', () => {
      rl04.classList.toggle('fachada');
      rl04.classList.toggle('desligado');
    });
      rl05.addEventListener('click', () => {
      rl05.classList.toggle('fachada');
      rl05.classList.toggle('desligado');
    });
      rl06.addEventListener('click', () => {
      rl06.classList.toggle('fachada');
      rl06.classList.toggle('desligado');
    });

    const chillerl06 =  rl06.classList.contains('desligado');

    if  (chillerl06){
      console.log('verdadeiro'); 
    }
    
    


  function mostrarPopup() {
    document.getElementById('popup-cag').classList.remove('hidden');
  }

  function fecharPopup() {
    document.getElementById('popup-cag').classList.add('hidden');
  }

    document.getElementById('popup-cag').addEventListener('click', function(e) {
      if (e.target === this) {
        fecharPopup();
      }
    });


  // ── Configuração estática (definida uma vez, fora de qualquer função) ──
const IDS = {
  todos: ['sh-1','sh-2','sh-3','sh-4','sh-5','sh-6','sh-7','sh-8','sh-9','sh-10','sh-11','sh-12','sh-13','sh-14','sh-15','sh-16','sh-17','sh-18','sh-19','sh-20','sh-21','sh-22','sh-23','sh-24','sh-25','sh-26','sh-27','sh-28','sh-29','sh-30',
  'sh-31','sh-32','sh-33','sh-34','sh-35','sh-36','sh-37','sh-38','sh-39','sh-40','sh-41','sh-42','sh-43','sh-44','sh-45','sh-46','sh-47','sh-48','sh-49','sh-50','sh-51','sh-52','sh-53','sh-54','sh-55','sh-56','sh-57','sh-58','sh-59','sh-60',
  'sh-61','sh-62','sh-63','sh-64','sh-65','sh-66','sh-67','sh-68','sh-69', 'sh-97','sh-70','sh-71','sh-72','sh-73','sh-74','sh-75','sh-76','sh-77','sh-78','sh-79','sh-80','sh-81','sh-82','sh-83','sh-84','sh-85','sh-86','sh-87','sh-88','sh-89','sh-90',
  'sh-91','sh-92','sh-93','sh-94','sh-95','sh-96'],

  // Condição normal
  Fluxo_baixo: ["sh-16","sh-17","sh-18","sh-19","sh-20","sh-21","sh-22","sh-23","sh-24","sh-25","sh-26","sh-27","sh-44","sh-45","sh-46","sh-47","sh-48","sh-50","sh-52","sh-54","sh-56","sh-58","sh-85","sh-86"],
  Fluxo_cima: ["sh-51","sh-53","sh-55","sh-57","sh-59","sh-82","sh-83","sh-84","sh-89","sh-90","sh-91","sh-92","sh-93","sh-94","sh-95","sh-96"],
  Fluxo_esquerda: ["sh-9" ,"sh-10","sh-11","sh-12","sh-13","sh-14","sh-15","sh-63","sh-64","sh-65","sh-66","sh-67","sh-69",'sh-97',"sh-70","sh-75","sh-76","sh-77","sh-78","sh-79","sh-80"],
  Fluxo_direita: ["sh-1" ,"sh-2" ,"sh-3" ,"sh-4" ,"sh-5" ,"sh-6" ,"sh-7" ,"sh-8" ,"sh-35","sh-36","sh-37","sh-38","sh-39","sh-40","sh-41","sh-62","sh-68","sh-72","sh-73","sh-74","sh-81"],


  // Fluxo Vresos condiações

    // Usado quando a valvula01 esta aberta e a valvula 02 esta fechada.
  fluxoValvula1_esq: ['sh-28','sh-29','sh-30','sh-31','sh-32','sh-33', 'sh-42'],
  fluxoValvula1_dir: ['sh-35','sh-36','sh-37','sh-38','sh-39','sh-40','sh-41'],

    // Usado quando a valvula02 esta aberta e a valvula 01 esta fechada.
  fluxoValvula2_dir: ['sh-29','sh-30','sh-31','sh-32','sh-33', 'sh-34'],
  fluxoValvula2_esq: ['sh-35','sh-36','sh-37','sh-38','sh-39','sh-40','sh-41', 'sh-43'],

  cano34: ['sh-34'],
  cano43: ['sh-43'],
  cano71: ['sh-71'],
  cano88: ['sh-88', 'sh-87'],
  cano68: ['sh-68'],
  saidatp: ['sh-69', 'sh-70', 'sh-97'],
  entradatp: ['sh-73','sh-74','sh-90'],
};


// ── Utilitário: aplica/remove classes de fluxo em um grupo de IDs ──
function setFluxo(ids, classe, ativar) {
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList[ativar ? 'add' : 'remove'](classe);
  });
}

function atualizarFluxo() {
  const v1Fechada = document.getElementById('valvula_1').classList.contains('fechada');
  const v2Fechada = document.getElementById('valvula_2').classList.contains('fechada');
  const v3Fechada = document.getElementById('valvula_3').classList.contains('fechada');
  const v4Fechada = document.getElementById('valvula_4').classList.contains('fechada');
  const v5Fechada = document.getElementById('valvula_5').classList.contains('fechada');
  const v6Fechada = document.getElementById('valvula_6').classList.contains('fechada');

  // Limpa tudo primeiro — garante estado limpo sempre
  setFluxo(IDS.todos, 'fluxo-esq', false);
  setFluxo(IDS.todos, 'fluxo-dir', false);
  setFluxo(IDS.todos, 'fluxo-cima', false);
  setFluxo(IDS.todos, 'fluxo-baixo', false);
  setFluxo(IDS.todos, 'fluxo-parado', false);

  // Se a Valvula 01 estiver aberta e Valvula 02 estiver fechada entao teremos este comportamento
  if (!v1Fechada && v2Fechada){
    setFluxo(IDS.fluxoValvula1_esq, 'fluxo-esq', true);
    setFluxo(IDS.fluxoValvula1_dir, 'fluxo-dir', true);
    setFluxo(IDS.cano34, 'fluxo-parado', true);
    setFluxo(IDS.Fluxo_baixo, 'fluxo-baixo', true);
    setFluxo(IDS.Fluxo_cima, 'fluxo-cima', true);
    setFluxo(IDS.Fluxo_esquerda, 'fluxo-esq', true);
    setFluxo(IDS.Fluxo_direita, 'fluxo-dir', true);
  } 
  
  // Se a Valvula 02 estiver aberta e Valvula 01 estiver fechada entao teremos este comportamento
  if (!v2Fechada && v1Fechada) {
    setFluxo(IDS.fluxoValvula2_dir,'fluxo-dir', true);
    setFluxo(IDS.fluxoValvula2_esq,'fluxo-esq', true);
    setFluxo(IDS.Fluxo_baixo, 'fluxo-baixo', true);
    setFluxo(IDS.Fluxo_cima, 'fluxo-cima', true);
    setFluxo(IDS.Fluxo_esquerda, 'fluxo-esq', true);
    setFluxo(IDS.Fluxo_direita, 'fluxo-dir', true);
  } 
  
  // Se as duas valvula estiverem abertas
  if (!v1Fechada && !v2Fechada){
    setFluxo(IDS.fluxoValvula1_esq, 'fluxo-esq', true);
    setFluxo(IDS.fluxoValvula1_dir, 'fluxo-dir', true);
    setFluxo(IDS.cano34, 'fluxo-esq', true);
    setFluxo(IDS.cano43, 'fluxo-dir', true);
    setFluxo(IDS.Fluxo_baixo, 'fluxo-baixo', true);
    setFluxo(IDS.Fluxo_cima, 'fluxo-cima', true);
    setFluxo(IDS.Fluxo_esquerda, 'fluxo-esq', true);
    setFluxo(IDS.Fluxo_direita, 'fluxo-dir', true);
  } 

  // Se a Valvula 01 ou 02 estiver aberto
  if (!v1Fechada || !v2Fechada) {
      document.querySelector('#bomba-1 use').setAttribute('href', '#peca-bomba');
      document.querySelector('#bomba-2 use').setAttribute('href', '#peca-bomba');
      document.querySelector('#bomba-3 use').setAttribute('href', '#peca-bomba');
      document.querySelector('#bomba-4 use').setAttribute('href', '#peca-bomba');
      document.querySelector('#bomba-5 use').setAttribute('href', '#peca-bomba');
      document.querySelector('#bomba-6 use').setAttribute('href', '#peca-bomba');
    if (!v3Fechada) {
      setFluxo(IDS.cano71,'fluxo-dir', true);
    }
    if(!v4Fechada){
      setFluxo(IDS.cano88, 'fluxo-cima', true);
      setFluxo(IDS.cano68, 'fluxo-esq', true);
    }
    if (v3Fechada && v4Fechada && v5Fechada){
      setFluxo(IDS.saidatp,'fluxo-parado', true);
    }
    if (v3Fechada && v4Fechada && v6Fechada){
      setFluxo(IDS.entradatp,'fluxo-parado', true);
    }
    if (v5Fechada){
      setFluxo(IDS.saidatp,'fluxo-parado', true);
    }
    if (v6Fechada){
      setFluxo(IDS.entradatp,'fluxo-parado', true);
    }
  }

      if (v1Fechada && v2Fechada) {
        // Ambas fechadas → sem fluxo
        document.querySelector('#bomba-1 use').setAttribute('href', '#peca-bomba-vermelha');
        document.querySelector('#bomba-2 use').setAttribute('href', '#peca-bomba-vermelha');
        document.querySelector('#bomba-3 use').setAttribute('href', '#peca-bomba-vermelha');
        document.querySelector('#bomba-4 use').setAttribute('href', '#peca-bomba-vermelha');
        document.querySelector('#bomba-5 use').setAttribute('href', '#peca-bomba-vermelha');
        document.querySelector('#bomba-6 use').setAttribute('href', '#peca-bomba-vermelha');
       setFluxo(IDS.todos, 'fluxo-parado', true);
       mostrarPopup();

      }

      if (v3Fechada && v4Fechada ){
        if (v5Fechada || v6Fechada ){
          document.querySelector('#bomba-1 use').setAttribute('href', '#peca-bomba-vermelha');
          document.querySelector('#bomba-2 use').setAttribute('href', '#peca-bomba-vermelha');
          document.querySelector('#bomba-3 use').setAttribute('href', '#peca-bomba-vermelha');
          document.querySelector('#bomba-4 use').setAttribute('href', '#peca-bomba-vermelha');
          document.querySelector('#bomba-5 use').setAttribute('href', '#peca-bomba-vermelha');
          document.querySelector('#bomba-6 use').setAttribute('href', '#peca-bomba-vermelha');
          setFluxo(IDS.todos, 'fluxo-parado', true);
          mostrarPopup();
        }
      }

}

function initValvulas() {
  document.querySelectorAll('.valvula').forEach((valvula) => {
    if (valvula.dataset.init) return;
    valvula.dataset.init = '1';

    valvula.addEventListener('click', (e) => {
      e.stopPropagation();
      valvula.classList.toggle('fechada');
      atualizarFluxo(); // toda a lógica de estado fica aqui
    });
  });
}

const VALOR_INICIAL = 75;
const OSCILACAO_MAX = 10; // ±10%

// Valor "base" que será oscilado
let valorBase = VALOR_INICIAL;

/**
 * Atualiza o input 2 de acordo com o input 1
 */
function atualizar() {
    let v = parseInt(document.getElementById('valvula_fancoil').value) || 0;

    if (v < 0) v = 0;
    if (v > 100) v = 100;

    document.getElementById('valvula_fancoil').value = v;
    document.getElementById('bypass').value = 100 - v;

    // Sincroniza o valor base com o digitado
    valorBase = v;
}

/**
 * Botões + e − ajustam manualmente
 */
function ajustar(delta) {
    const input = document.getElementById('valvula_fancoil');
    input.value = (parseInt(input.value) || 0) + delta;
    atualizar();
}

/**
 * Oscilação aleatória e gradual (passo de 1 em 1)
 */
function oscilar() {
    // Sorteia um alvo dentro do intervalo ±10% do valor base
    const min = Math.max(0, valorBase - OSCILACAO_MAX);
    const max = Math.min(100, valorBase + OSCILACAO_MAX);
    const alvo = Math.floor(Math.random() * (max - min + 1)) + min;

    let atual = parseInt(document.getElementById('valvula_fancoil').value) || 0;

    // Move 1 passo em direção ao alvo (gradual)
    if (atual < alvo) atual++;
    else if (atual > alvo) atual--;

    document.getElementById('valvula_fancoil').value = atual;
    document.getElementById('bypass').value = 100 - atual;
}

// Executa a oscilação a cada 300ms para parecer suave
setInterval(oscilar, 2000);

  // ----------------------------------------------------------
  // Botões do painel (criados no HTML)
  // ----------------------------------------------------------
  if (btnReset) btnReset.addEventListener('click', centralizar);
  if (btnFit)   btnFit.addEventListener('click', fitScreen);

  window.addEventListener('resize', fitScreen);

  // ----------------------------------------------------------
  // Inicialização
  // ----------------------------------------------------------
  fitScreen();
  initValvulas();

})();
