// ============================================================
//  DIAGRAMA DE TUBULAÇÃO — index.js
//  Responsável por:
//    - Pan (arrastar o canvas com mouse e touch)
//    - Zoom (scroll do mouse e pinch no touch)
//    - Válvulas (toggle aberta/fechada + atualização de fluxo)
//    - Chillers (toggle ligado/desligado)
//    - Popup de alarme crítico
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
  const canvas   = document.getElementById('canvas');
  const btnReset = document.getElementById('btn-reset');
  const btnFit   = document.getElementById('btn-fit');
  const coordsEl = document.getElementById('coords');
  const escalaEl = document.getElementById('escala-label');
  const popup    = document.getElementById('popup-cag');

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
    if (coordsEl) coordsEl.textContent = `x: ${Math.round(offsetX)} · y: ${Math.round(offsetY)}`;
    if (escalaEl) escalaEl.textContent = `zoom: ${Math.round(scale * 100)}%`;
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
  // Popup de alarme crítico
  // ----------------------------------------------------------
  function mostrarPopup() {
    popup.classList.remove('hidden');
  }

  function fecharPopup() {
    popup.classList.add('hidden');
  }

  // Fecha ao clicar no overlay (fora da caixa)
  popup.addEventListener('click', (e) => {
    if (e.target === popup) fecharPopup();
  });

  // ----------------------------------------------------------
  // Grupos de IDs para controle de fluxo
  // ----------------------------------------------------------
  const IDS = {
    todos: [
      'sh-1','sh-2','sh-3','sh-4','sh-5','sh-6','sh-7','sh-8','sh-9','sh-10',
      'sh-11','sh-12','sh-13','sh-14','sh-15','sh-16','sh-17','sh-18','sh-19','sh-20',
      'sh-21','sh-22','sh-23','sh-24','sh-25','sh-26','sh-27','sh-28','sh-29','sh-30',
      'sh-31','sh-32','sh-33','sh-34','sh-35','sh-36','sh-37','sh-38','sh-39','sh-40',
      'sh-41','sh-42','sh-43','sh-44','sh-45','sh-46','sh-47','sh-48','sh-49','sh-50',
      'sh-51','sh-52','sh-53','sh-54','sh-55','sh-56','sh-57','sh-58','sh-59','sh-60',
      'sh-61','sh-62','sh-63','sh-64','sh-65','sh-66','sh-67','sh-68','sh-69','sh-70',
      'sh-71','sh-72','sh-73','sh-74','sh-75','sh-76','sh-77','sh-78','sh-79','sh-80',
      'sh-81','sh-82','sh-83','sh-84','sh-85','sh-86','sh-87','sh-88','sh-89','sh-90',
      'sh-91','sh-92','sh-93','sh-94','sh-95','sh-96','sh-97',
    ],

    // Fluxo geral (condição normal)
    Fluxo_baixo:    ['sh-16','sh-17','sh-18','sh-19','sh-20','sh-21','sh-22','sh-23','sh-24','sh-25','sh-26','sh-27','sh-44','sh-45','sh-46','sh-47','sh-48','sh-49','sh-50','sh-52','sh-54','sh-56','sh-58','sh-60','sh-85','sh-86'],
    Fluxo_cima:     ['sh-51','sh-53','sh-55','sh-57','sh-59','sh-61','sh-82','sh-83','sh-84','sh-89','sh-90','sh-91','sh-92','sh-93','sh-94','sh-95','sh-96'],
    Fluxo_esquerda: ['sh-9','sh-10','sh-11','sh-12','sh-13','sh-14','sh-15','sh-63','sh-64','sh-65','sh-66','sh-67','sh-69','sh-97','sh-70','sh-75','sh-76','sh-77','sh-78','sh-79','sh-80'],
    Fluxo_direita:  ['sh-1','sh-2','sh-3','sh-4','sh-5','sh-6','sh-7','sh-8','sh-35','sh-36','sh-37','sh-38','sh-39','sh-40','sh-41','sh-62','sh-68','sh-72','sh-73','sh-74','sh-81'],

    // Fluxo específico por condição de válvula
    fluxoV1_esq: ['sh-28','sh-29','sh-30','sh-31','sh-32','sh-33','sh-42'],  // V1 aberta, V2 fechada
    fluxoV1_dir: ['sh-35','sh-36','sh-37','sh-38','sh-39','sh-40','sh-41'],

    fluxoV2_dir: ['sh-29','sh-30','sh-31','sh-32','sh-33','sh-34'],          // V2 aberta, V1 fechada
    fluxoV2_esq: ['sh-35','sh-36','sh-37','sh-38','sh-39','sh-40','sh-41','sh-43'],

    // Segmentos individuais
    cano34:    ['sh-34'],
    cano43:    ['sh-43'],
    cano71:    ['sh-71'],
    cano88:    ['sh-88','sh-87'],
    cano68:    ['sh-68'],
    saidaTP:   ['sh-69','sh-70','sh-97'],
    entradaTP: ['sh-73','sh-74','sh-90'],
  };

  // ----------------------------------------------------------
  // Utilitário: aplica ou remove uma classe de fluxo em vários elementos
  // ----------------------------------------------------------
  function setFluxo(ids, classe, ativar) {
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList[ativar ? 'add' : 'remove'](classe);
    });
  }

  // ----------------------------------------------------------
  // Utilitário: troca o símbolo visual de todas as bombas
  // ----------------------------------------------------------
  const BOMBAS = ['#bomba-1','#bomba-2','#bomba-3','#bomba-4','#bomba-5','#bomba-6'];

  function setBombas(simbolo) {
    BOMBAS.forEach((sel) => {
      const el = document.querySelector(`${sel} use`);
      if (el) el.setAttribute('href', simbolo);
    });
  }

  // ----------------------------------------------------------
  // Lógica principal de fluxo — chamada sempre que uma válvula muda
  // ----------------------------------------------------------
  function atualizarFluxo() {
    const v1 = document.getElementById('valvula_1').classList.contains('fechada');
    const v2 = document.getElementById('valvula_2').classList.contains('fechada');
    const v3 = document.getElementById('valvula_3').classList.contains('fechada');
    const v4 = document.getElementById('valvula_4').classList.contains('fechada');
    const v5 = document.getElementById('valvula_5').classList.contains('fechada');
    const v6 = document.getElementById('valvula_6').classList.contains('fechada');

    // 1. Limpa todo o estado de fluxo — ponto de partida sempre limpo
    const todasClasses = ['fluxo-esq','fluxo-dir','fluxo-cima','fluxo-baixo','fluxo-parado'];
    todasClasses.forEach((cls) => setFluxo(IDS.todos, cls, false));

    // 2. Condição crítica: V1 e V2 ambas fechadas → sem fluxo algum
    if (v1 && v2) {
      setBombas('#peca-bomba-vermelha');
      setFluxo(IDS.todos, 'fluxo-parado', true);
      mostrarPopup();
      return; // nenhuma regra adicional se aplica
    }

    // 3. Pelo menos uma das principais está aberta → bombas verdes
    setBombas('#peca-bomba');

    // 3a. Fluxo pelo segmento de V1 (V1 aberta)
    if (!v1) {
      setFluxo(IDS.fluxoV1_esq, 'fluxo-esq', true);
      setFluxo(IDS.fluxoV1_dir, 'fluxo-dir', true);
      setFluxo(IDS.cano34, v2 ? 'fluxo-parado' : 'fluxo-esq', true); // parado se V2 fechada
    }

    // 3b. Fluxo pelo segmento de V2 (V2 aberta)
    if (!v2) {
      setFluxo(IDS.fluxoV2_dir, 'fluxo-dir', true);
      setFluxo(IDS.fluxoV2_esq, 'fluxo-esq', true);
      setFluxo(IDS.cano43, v1 ? 'fluxo-parado' : 'fluxo-dir', true); // parado se V1 fechada
    }

    // 3c. Fluxo geral (comum a qualquer combinação com pelo menos V1 ou V2 aberta)
    setFluxo(IDS.Fluxo_baixo,    'fluxo-baixo', true);
    setFluxo(IDS.Fluxo_cima,     'fluxo-cima',  true);
    setFluxo(IDS.Fluxo_esquerda, 'fluxo-esq',   true);
    setFluxo(IDS.Fluxo_direita,  'fluxo-dir',   true);

    // 3d. Segmentos dependentes de V3 e V4
    if (!v3) setFluxo(IDS.cano71, 'fluxo-dir', true);

    if (!v4) {
      setFluxo(IDS.cano88, 'fluxo-cima', true);
      setFluxo(IDS.cano68, 'fluxo-esq',  true);
    }

    // 3e. Saída do torre de pressão: parada se V5 fechada ou se V3+V4 bloqueiam
    if (v5 || (v3 && v4)) {
      setFluxo(IDS.saidaTP, 'fluxo-parado', true);
    }

    // 3f. Entrada do torre de pressão: parada se V6 fechada ou se V3+V4 bloqueiam
    if (v6 || (v3 && v4)) {
      setFluxo(IDS.entradaTP, 'fluxo-parado', true);
    }

    // 4. Condição crítica secundária: V3+V4 bloqueadas junto com V5 ou V6
    if (v3 && v4 && (v5 || v6)) {
      setBombas('#peca-bomba-vermelha');
      setFluxo(IDS.todos, 'fluxo-parado', true);
      mostrarPopup();
    }
  }

  // ----------------------------------------------------------
  // Inicializa as válvulas (click → toggle → atualiza fluxo)
  // ----------------------------------------------------------
  function initValvulas() {
    document.querySelectorAll('.valvula').forEach((valvula) => {
      if (valvula.dataset.init) return;
      valvula.dataset.init = '1';

      valvula.addEventListener('click', (e) => {
        e.stopPropagation();
        valvula.classList.toggle('fechada');
        atualizarFluxo();
      });
    });
  }

  // ----------------------------------------------------------
  // Inicializa os chillers (click → toggle ligado/desligado)
  // ----------------------------------------------------------
  function initChillers() {
    ['chiller01','chiller02','chiller03','chiller04','chiller05','chiller06'].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('click', () => {
        el.classList.toggle('fachada');
        el.classList.toggle('desligado');
      });
    });
  }

  // ----------------------------------------------------------
  // Botões do painel
  // ----------------------------------------------------------
  if (btnReset) btnReset.addEventListener('click', centralizar);
  if (btnFit)   btnFit.addEventListener('click', fitScreen);

  window.addEventListener('resize', fitScreen);

  // ----------------------------------------------------------
  // Inicialização
  // ----------------------------------------------------------
  fitScreen();
  initValvulas();
  initChillers();
  atualizarFluxo();

})();
