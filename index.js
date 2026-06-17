// ============================================================
//  DIAGRAMA DE TUBULAÇÃO — index.js
//  Responsável por:
//    - Pan (arrastar o canvas com mouse e touch)
//    - Zoom (scroll do mouse e pinch no touch)
//    - Válvulas (toggle aberta/fechada)
//    - Controle de indicadores baseado em fluxo de água
//    - Oscilação de temperatura do tanque pulmão
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
  // Válvulas — toggle aberta / fechada ao clicar
  // ----------------------------------------------------------

  // Configuração estática (definida uma vez, fora de qualquer função)
  const IDS = {
    todos: [
      'sh-1','sh-2','sh-3','sh-4','sh-5','sh-6','sh-7','sh-8','sh-9','sh-10',
      'sh-11','sh-12','sh-13','sh-14','sh-15','sh-16','sh-17','sh-18','sh-19','sh-20',
      'sh-21','sh-22','sh-23','sh-24','sh-25','sh-26','sh-27','sh-28','sh-29','sh-30',
      'sh-31','sh-32','sh-33','sh-34','sh-35','sh-36','sh-37','sh-38','sh-39','sh-40',
      'sh-41','sh-42','sh-43','sh-44','sh-45','sh-46','sh-47','sh-48','sh-49','sh-50',
      'sh-51','sh-52','sh-53','sh-54','sh-55','sh-56','sh-57','sh-58','sh-59','sh-60',
      'sh-61','sh-62','sh-63','sh-64','sh-65','sh-66','sh-67','sh-68','sh-69','sh-97',
      'sh-70','sh-71','sh-72','sh-73','sh-74','sh-75','sh-76','sh-77','sh-78','sh-79',
      'sh-80','sh-81','sh-82','sh-83','sh-84','sh-85','sh-86','sh-87','sh-88','sh-89',
      'sh-90','sh-91','sh-92','sh-93','sh-94','sh-95','sh-96'
    ],

    // Condição normal
    Fluxo_baixo: [
      "sh-16","sh-17","sh-18","sh-19","sh-20","sh-21","sh-22","sh-23","sh-24","sh-25",
      "sh-26","sh-27","sh-44","sh-45","sh-46","sh-47","sh-48","sh-49","sh-50","sh-52",
      "sh-54","sh-56","sh-58","sh-85","sh-86"
    ],
    Fluxo_cima: [
      "sh-51","sh-53","sh-55","sh-57","sh-59","sh-82","sh-83","sh-84","sh-89","sh-90",
      "sh-91","sh-92","sh-93","sh-94","sh-95","sh-96"
    ],
    Fluxo_esquerda: [
      "sh-9","sh-10","sh-11","sh-12","sh-13","sh-14","sh-15","sh-63","sh-64","sh-65",
      "sh-66","sh-67","sh-69","sh-97","sh-70","sh-75","sh-76","sh-77","sh-78","sh-79",
      "sh-80"
    ],
    Fluxo_direita: [
      "sh-1","sh-2","sh-3","sh-4","sh-5","sh-6","sh-7","sh-8","sh-35","sh-36",
      "sh-37","sh-38","sh-39","sh-40","sh-41","sh-62","sh-68","sh-72","sh-73","sh-74",
      "sh-81"
    ],

    // Fluxos versas condições
    // Usado quando a valvula01 esta aberta e a valvula 02 esta fechada.
    fluxoValvula1_esq: ['sh-28','sh-29','sh-30','sh-31','sh-32','sh-33','sh-42'],
    fluxoValvula1_dir: ['sh-35','sh-36','sh-37','sh-38','sh-39','sh-40','sh-41'],

    // Usado quando a valvula02 esta aberta e a valvula 01 esta fechada.
    fluxoValvula2_dir: ['sh-29','sh-30','sh-31','sh-32','sh-33','sh-34'],
    fluxoValvula2_esq: ['sh-35','sh-36','sh-37','sh-38','sh-39','sh-40','sh-41','sh-43'],

    cano34: ['sh-34'],
    cano43: ['sh-43'],
    cano71: ['sh-71'],
    cano88: ['sh-88','sh-87'],
    cano68: ['sh-68'],
    saidatp: ['sh-69','sh-70','sh-97'],
    entradatp: ['sh-73','sh-74','sh-90']
  };

  const CHILLER_MAP = {
    'chiller01': ['sh-44', 'sh-50', 'sh-51'],
    'chiller02': ['sh-45', 'sh-52', 'sh-53'],
    'chiller03': ['sh-46', 'sh-54', 'sh-55'],
    'chiller04': ['sh-47', 'sh-56', 'sh-57'],
    'chiller05': ['sh-48', 'sh-58', 'sh-59'],
    'chiller06': ['sh-49', 'sh-60', 'sh-61'],
  };

  // Utilitário: aplica/remove classes de fluxo em um grupo de IDs
  function setFluxo(ids, classe, ativar) {
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList[ativar ? 'add' : 'remove'](classe);
    });
  }

  function desligarTodosChillers() {
    Object.keys(CHILLER_MAP).forEach(chillerId => {
      const el = document.getElementById(chillerId);
      if (el) {
        el.classList.remove('fachada');
        el.classList.add('desligado');
      }
    });
  }

  function aplicarFluxoChillers() {
    Object.entries(CHILLER_MAP).forEach(([chillerId, pipes]) => {
      const chillerEl = document.getElementById(chillerId);
      if (chillerEl && chillerEl.classList.contains('desligado')) {
        pipes.forEach(pipeId => {
          const pipeEl = document.getElementById(pipeId);
          if (pipeEl) {
            pipeEl.classList.remove('fluxo-baixo', 'fluxo-cima', 'fluxo-esq', 'fluxo-dir');
            pipeEl.classList.add('fluxo-parado');
          }
        });
      }
    });
  }

  // Verifica se há fluxo no sistema (baseado nas válvulas principais)
  function haFluxo() {
    const v1Fechada = document.getElementById('valvula_1').classList.contains('fechada');
    const v2Fechada = document.getElementById('valvula_2').classList.contains('fechada');

    // Há fluxo se pelo menos uma das válvulas principais estiver aberta
    // E o sistema não estiver totalmente bloqueado
    return !v1Fechada || !v2Fechada;
  }

  function atualizarFluxo() {
    const v1Fechada = document.getElementById('valvula_1').classList.contains('fechada');
    const v2Fechada = document.getElementById('valvula_2').classList.contains('fechada');
    const v3Fechada = document.getElementById('valvula_3').classList.contains('fechada');
    const v4Fechada = document.getElementById('valvula_4').classList.contains('fechada');
    const v5Fechada = document.getElementById('valvula_5').classList.contains('fechada');
    const v6Fechada = document.getElementById('valvula_6').classList.contains('fechada');

    // Limpa tudo primeiro — garante estado limpo sempre
    setFluxo(IDS.todos, 'fluxo-esq',    false);
    setFluxo(IDS.todos, 'fluxo-dir',    false);
    setFluxo(IDS.todos, 'fluxo-cima',   false);
    setFluxo(IDS.todos, 'fluxo-baixo',  false);
    setFluxo(IDS.todos, 'fluxo-parado', false);

    // Se a Valvula 01 estiver aberta e Valvula 02 estiver fechada
    if (!v1Fechada && v2Fechada) {
      setFluxo(IDS.fluxoValvula1_esq, 'fluxo-esq', true);
      setFluxo(IDS.fluxoValvula1_dir, 'fluxo-dir', true);
      setFluxo(IDS.cano34,            'fluxo-parado', true);
      setFluxo(IDS.Fluxo_baixo,       'fluxo-baixo',  true);
      setFluxo(IDS.Fluxo_cima,        'fluxo-cima',   true);
      setFluxo(IDS.Fluxo_esquerda,    'fluxo-esq',    true);
      setFluxo(IDS.Fluxo_direita,     'fluxo-dir',    true);
    }

    // Se a Valvula 02 estiver aberta e Valvula 01 estiver fechada
    if (!v2Fechada && v1Fechada) {
      setFluxo(IDS.fluxoValvula2_dir, 'fluxo-dir',   true);
      setFluxo(IDS.fluxoValvula2_esq, 'fluxo-esq',   true);
      setFluxo(IDS.Fluxo_baixo,       'fluxo-baixo', true);
      setFluxo(IDS.Fluxo_cima,        'fluxo-cima',  true);
      setFluxo(IDS.Fluxo_esquerda,    'fluxo-esq',   true);
      setFluxo(IDS.Fluxo_direita,     'fluxo-dir',   true);
    }

    // Se as duas valvulas estiverem abertas
    if (!v1Fechada && !v2Fechada) {
      setFluxo(IDS.fluxoValvula1_esq, 'fluxo-esq', true);
      setFluxo(IDS.fluxoValvula1_dir, 'fluxo-dir', true);
      setFluxo(IDS.cano34,            'fluxo-esq', true);
      setFluxo(IDS.cano43,            'fluxo-dir', true);
      setFluxo(IDS.Fluxo_baixo,       'fluxo-baixo', true);
      setFluxo(IDS.Fluxo_cima,        'fluxo-cima',  true);
      setFluxo(IDS.Fluxo_esquerda,    'fluxo-esq',  true);
      setFluxo(IDS.Fluxo_direita,     'fluxo-dir',  true);
    }

    // Se a Valvula 01 ou 02 estiver aberta
    if (!v1Fechada || !v2Fechada) {
      document.querySelector('#bomba-1 use').setAttribute('href', '#peca-bomba');
      document.querySelector('#bomba-2 use').setAttribute('href', '#peca-bomba');
      document.querySelector('#bomba-3 use').setAttribute('href', '#peca-bomba');
      document.querySelector('#bomba-4 use').setAttribute('href', '#peca-bomba');
      document.querySelector('#bomba-5 use').setAttribute('href', '#peca-bomba');
      document.querySelector('#bomba-6 use').setAttribute('href', '#peca-bomba');

      if (!v3Fechada) {
        setFluxo(IDS.cano71, 'fluxo-dir', true);
      }
      if (!v4Fechada) {
        setFluxo(IDS.cano88, 'fluxo-cima', true);
        setFluxo(IDS.cano68, 'fluxo-esq',  true);
      }
      if (v3Fechada && v4Fechada && v5Fechada) {
        setFluxo(IDS.saidatp, 'fluxo-parado', true);
      }
      if (v3Fechada && v4Fechada && v6Fechada) {
        setFluxo(IDS.entradatp, 'fluxo-parado', true);
      }
      if (v5Fechada) {
        setFluxo(IDS.saidatp, 'fluxo-parado', true);
      }
      if (v6Fechada) {
        setFluxo(IDS.entradatp, 'fluxo-parado', true);
      }
    }

    // Ambas fechadas → sem fluxo
    if (v1Fechada && v2Fechada) {
      document.querySelector('#bomba-1 use').setAttribute('href', '#peca-bomba-vermelha');
      document.querySelector('#bomba-2 use').setAttribute('href', '#peca-bomba-vermelha');
      document.querySelector('#bomba-3 use').setAttribute('href', '#peca-bomba-vermelha');
      document.querySelector('#bomba-4 use').setAttribute('href', '#peca-bomba-vermelha');
      document.querySelector('#bomba-5 use').setAttribute('href', '#peca-bomba-vermelha');
      document.querySelector('#bomba-6 use').setAttribute('href', '#peca-bomba-vermelha');
      setFluxo(IDS.todos, 'fluxo-parado', true);
      mostrarPopup();
      desligarTodosChillers();
    }

    if (v3Fechada && v4Fechada) {
      if (v5Fechada || v6Fechada) {
        document.querySelector('#bomba-1 use').setAttribute('href', '#peca-bomba-vermelha');
        document.querySelector('#bomba-2 use').setAttribute('href', '#peca-bomba-vermelha');
        document.querySelector('#bomba-3 use').setAttribute('href', '#peca-bomba-vermelha');
        document.querySelector('#bomba-4 use').setAttribute('href', '#peca-bomba-vermelha');
        document.querySelector('#bomba-5 use').setAttribute('href', '#peca-bomba-vermelha');
        document.querySelector('#bomba-6 use').setAttribute('href', '#peca-bomba-vermelha');
        setFluxo(IDS.todos, 'fluxo-parado', true);
        mostrarPopup();
        desligarTodosChillers();
      }
    }

    aplicarFluxoChillers();
  }

  function initValvulas() {
    document.querySelectorAll('.valvula').forEach((valvula) => {
      // Evita registrar o listener mais de uma vez
      if (valvula.dataset.init) return;
      valvula.dataset.init = '1';

      valvula.addEventListener('click', (e) => {
        e.stopPropagation(); // não propaga para o pan/zoom do canvas
        valvula.classList.toggle('fechada');
        atualizarFluxo();    // toda a lógica de estado fica aqui

        // Atualiza os indicadores após mudança de estado das válvulas
        atualizarIndicadores();
      });
    });
  }

  // Atualiza os indicadores de % com base na presença de fluxo
  function atualizarIndicadores() {
    const haFluxoSistema = haFluxo();

    if (!haFluxoSistema) {
      // Sem fluxo: forçar ambos os indicadores para 0%
      document.getElementById('valvula_fancoil').value = 0;
      document.getElementById('bypass').value = 0;

      // Também zerar o valor base para evitar oscilações indesejadas
      valorBase = 0;
    } else {
      // Com fluxo: permitir comportamento normal
      // Se os valores estiverem zerados devido à falta de fluxo anterior,
      // restaurar para um valor padrão ou manter o último valor conhecido
      const currentFancoil = parseInt(document.getElementById('valvula_fancoil').value) || 0;
      const currentBypass = parseInt(document.getElementById('bypass').value) || 0;

      // Se ambos estiverem zerados (indicando que veio de estado sem fluxo),
      // restaurar para valores padrão
      if (currentFancoil === 0 && currentBypass === 0) {
        document.getElementById('valvula_fancoil').value = VALOR_INICIAL;
        document.getElementById('bypass').value = 100 - VALOR_INICIAL;
        valorBase = VALOR_INICIAL;
      }
      // Se pelo menos um valor não estiver zerado, manter o valor atual
      // (já que o comportamento normal de sincronização já está em vigor)
    }
  }

  // ----------------------------------------------------------
  // Chillers (RL01–RL06) — toggle fachada/desligado
  // ----------------------------------------------------------
  function initChillers() {
    const chillers = [
      document.getElementById('chiller01'),
      document.getElementById('chiller02'),
      document.getElementById('chiller03'),
      document.getElementById('chiller04'),
      document.getElementById('chiller05'),
      document.getElementById('chiller06'),
    ];

    chillers.forEach((el) => {
      if (!el) return;
      el.addEventListener('click', () => {
        el.classList.toggle('fachada');
        el.classList.toggle('desligado');
        atualizarFluxo();
      });
    });

    const chiller06Desligado = document.getElementById('chiller06')
      ?.classList.contains('desligado');

    if (chiller06Desligado) {
      console.log('verdadeiro');
    }
  }

  // ----------------------------------------------------------
  // Popups (CAG + Componentes)
  // ----------------------------------------------------------
  function mostrarPopup() {
    document.getElementById('popup-cag').classList.remove('hidden');
  }

  function fecharPopup() {
    document.getElementById('popup-cag').classList.add('hidden');
  }

  function initPopupCag() {
    const popup = document.getElementById('popup-cag');
    if (!popup) return;
    popup.addEventListener('click', function (e) {
      if (e.target === this) fecharPopup();
    });
  }

  const componentes = {
    chiller: {
      titulo: "Chiller",
      imagem: "./img/Chiller.jpg",
      texto: `O chiller é o equipamento da CAG que resfria a água de processo através de um ciclo de compressão. No evaporador Shell and Tube, o fluido refrigerante absorve o calor da água, resfriando-a para o sistema. O compressor eleva a pressão desse fluido, que é direcionado ao condensador a ar. Ali, ventiladores dissipam o calor na atmosfera por convecção forçada, reiniciando o ciclo.`

    },
    bomba: {
      titulo: "Bombas Centrífugas",
      imagem: "./img/bomba.png",
      texto: `As bombas centrífugas da Armstrong (Série 4300) integram o sistema de CAG (Central de Água Gelada). Elas servem para succionar a água de retorno e recalcá-la por todo o circuito, passando pelo chiller, pulmões e fancoils. O conjunto opera com 6 unidades, cada uma com vazão de 234 m³/h, pressão de 65 MCA e potência de 75 HP.
      `
    },
    tanque: {
      titulo: "Tanque Pulmão",
      imagem: "./img/tanque.png",
      texto: `O tanque pulmão de 117 m³ está ligado em série com a tubulação de AAG (Alimentacão de Água Gelada) do sistema de CAG. Ele serve para estabilizar a temperatura térmica do circuito, "absorvendo" o impacto do retorno de água quente. Essa função de amortecimento é crucial durante os rodízios de chillers ou em cenários de quedas repentinas na CAG.
      `
    },
    bypass: {
      titulo: "Válvula de By-pass",
      imagem: "./img/bypass.png",
      texto: `A válvula de by-pass por atuador é instalada entre as tubulações de AAG e RAG (Alimentacão de Água Gelada e Retorno de Água Gelada). Ela serve para regular o fluxo do sistema balanceando a pressão, manobrando automaticamente conforme a demanda dos fancoils. Essa modulação técnica garante que os trocadores dos chillers mantenham sempre a vazão mínima adequada de operação.
      `
    },
    servico: {
      titulo: "Válvulas de Serviço",
      imagem: "./img/valvula_serviço.png",
      texto: `As válvulas de serviço são componentes estratégicos integrados nas tubagens de climatização do sistema de CAG. Elas servem para isolar equipamentos específicos que necessitam de reparação ou trechos de tubagem com vazamentos indesejados. Tecnicamente, estas válvulas garantem que as intervenções de manutenção mecânica em equipamentos de HVAC ocorram com o mínimo impacto operacional.
      `
    },
    bloqueio: {
      titulo: "Válvula de Bloqueio",
      imagem: "./img/valvula_bloqueio.jpg",
      texto: `As válvulas de bloqueio por atuador são instaladas estrategicamente na saída dos trocadores dos chillers da CAG. Elas servem para controlar a abertura do fluxo de água gelada que passa pelo trocador antes do arranque do equipamento. Tecnicamente, após a sua abertura automática, um sensor de vazão registre o fluxo de água, permitindo a partida do chiller com total segurança.
      `
    },
    balanceadora: {
      titulo: "Válvula Balanceadora",
      imagem: "./img/valvula_balanceadora.jpg",
      texto: `A válvula balanceadora é um componente de calibração hidráulica instalado em sistemas de HVAC de grande porte. Ela serve para garantir que cada equipamento da instalação receba a vazão de água ideal estipulada no seu data sheet. Tecnicamente, o dispositivo passa por uma regulagem precisa de perda de carga durante o comissionamento, assegurando a ótima performance e eficiência térmica do sistema.
      `
    },
    purgador: {
      titulo: "Purgador de Ar",
      imagem: "./img/purgador.jpg",
      texto: `O purgador de ar é um dispositivo de proteção hidrónica instalado em pontos estratégicos e elevados da linha de água gelada. Ele serve para eliminar o ar preso no circuito, o qual prejudica a troca térmica e causa ruídos ou cavitação. Tecnicamente, o componente agrupa as bolhas de ar no seu topo e realiza a purga automática assim que um determinado volume acumulado desloca o seu mecanismo interno de boia.
      `
    },
    filtro: {
      titulo: "Filtro Y",
      imagem: "./img/filtro_y.jpg",
      texto: `O filtro Y é um componente de proteção mecânica instalado na entrada de equipamentos hidráulicos da CAG. Ele serve para reter sujeira, detritos e partículas sólidas em suspensão, evitando que esses contaminantes inconvenientes adentrem e danifiquem os componentes protegidos. Tecnicamente, o fluido passa por uma malha ou tela de filtragem interna perfurada, onde as impurezas ficam retidas para posterior remoção durante a manutenção.
      `
    },
    manometro: {
      titulo: "Manômetros",
      imagem: "./img/manometro.jpg",
      texto: `Os manómetros e vacuómetros são instrumentos de metrologia instalados em pontos estratégicos e cavaletes de tubagem da CAG. Eles servem para monitorizar as pressões operacionais do fluido, permitindo também obter a leitura do diferencial de pressão entre a entrada e a saída dos equipamentos. Tecnicamente, enquanto o manómetro indica pressões positivas, o mano-vacuómetro conta com uma escala negativa que viabiliza a leitura de pressões abaixo da atmosférica (vácuo).
      `
    },

    caixa: {
      titulo: "Caixa",
      imagem: "./img/caixa.jpg",
      texto: `A caixa de reposição de água é um reservatório de compensação volumétrica integrado ao circuito hidráulico da CAG. Ela serve para reabastecer automaticamente a linha de água gelada sempre que houver perdas de fluido detectadas pela queda de pressão interna. Tecnicamente, possui capacidade total de 200 litros e conta com três boias para a medição e controlo de nível: uma mecânica e duas elétricas.
      `
    },
    hidrometro: {
      titulo: "Hidrometro",
      imagem: "./img/hidrometro.jpg",
      texto: `O fluxostato e o hidrómetro são instrumentos de monitoramento e medição instalados na tubulacao de entrada da caixa de reposição da CAG. Eles atuam em conjunto para supervisionar o reabastecimento do circuito de água gelada, detectando fluxo e consumo. Tecnicamente, o fluxostato identifica e sinaliza eletronicamente a presença real de fluxo de água na linha, enquanto o hidrómetro regista e mede o volume exato de água consumida no processo.`
    },
    redutora: {
      titulo: "Valvula Redutora",
      imagem: "./img/valvula_redutora.jpg",
      texto: `A válvula redutora de pressão opera de forma automática para manter a estabilidade hidrónica do sistema de CAG. Ela serve para monitorizar a pressão da linha e, caso esta caia abaixo do setpoint regulado (como os 1,5 bar), a válvula abre para iniciar o processo de abastecimento e reposição de água. Tecnicamente, o fluxo de entrada é mantido até que a pressão interna seja restabelecida e estabilizada, momento em que a válvula fecha novamente para isolar a linha.`
    },
    Registro: {
      titulo: "Registro de Bypass",
      imagem: "./img/registro_bypass.jpg",
      texto: `A válvula de by-pass manual é uma linha de contingência e segurança instalada em paralelo com a válvula redutora de pressão da CAG. Ela serve para garantir a continuidade do abastecimento de água do sistema em situações extraordinárias ou emergenciais. Tecnicamente, permanece na condição normalmente fechada (NF), sendo acionada manualmente apenas em cenários de avaria da valvula redutora ou durante paradas programadas para manutenção mecânica do cavalete.`
    },
    solenoide: {
      titulo: "Solenoide",
      imagem: "./img/Solenoide.jpg",
      texto: `A válvula solenoide de segurança é um dispositivo de intertravamento eletromecânico integrado à linha de alimentação do circuito. Ela serve como proteção crítica para interromper o fluxo de água caso o reservatório atinja um limite operacional perigoso. Tecnicamente, atua recebendo o sinal elétrico da boia de nível extra baixo da caixa de compensação e, ao fechar instantaneamente em estado crítico, evita a entrada de ar na sucção do sistema e previne danos graves por cavitação nas bombas da CAG.`
    }

  };

  // Lista de chaves na mesma ordem das <option> do <select>
  const chavesComponentes = Object.keys(componentes);
  let indiceAtual = 0;

  function abrirPopupComponente(chave) {
    const idx = chavesComponentes.indexOf(chave);
    if (idx === -1) return;
    indiceAtual = idx;
    mostrarComponente(indiceAtual);
    document.getElementById("popup-componente").classList.remove("hidden");
  }

  function fecharPopupComponente() {
    document.getElementById("popup-componente").classList.add("hidden");
  }

  function mostrarComponente(idx) {
    const chave = chavesComponentes[idx];
    const item  = componentes[chave];
    if (!item) return;

    document.getElementById("popup-titulo").textContent = item.titulo;
    document.getElementById("popup-imagem").src       = item.imagem;
    document.getElementById("popup-texto").innerHTML   = item.texto;
    document.getElementById("popup-counter").textContent =
      `${idx + 1} / ${chavesComponentes.length}`;

    const btnPrev = document.getElementById("popup-prev");
    const btnNext = document.getElementById("popup-next");
    btnPrev.disabled = idx === 0;
    btnNext.disabled = idx === chavesComponentes.length - 1;

    // Mantém o <select> do painel sincronizado com o popup
    const menu = document.getElementById("componentes-menu");
    if (menu.value !== chave) menu.value = chave;
  }

  function navegarPopup(delta) {
    const novo = indiceAtual + delta;
    if (novo < 0 || novo >= chavesComponentes.length) return;
    indiceAtual = novo;
    mostrarComponente(indiceAtual);
  }

  function initPopupComponente() {
    const menu  = document.getElementById("componentes-menu");
    const popup = document.getElementById("popup-componente");
    if (!menu || !popup) return;

    menu.addEventListener("change", function () {
      const chave = this.value;
      if (!chave) return;
      abrirPopupComponente(chave);
    });

    document.getElementById("popup-prev")
      .addEventListener("click", () => navegarPopup(-1));
    document.getElementById("popup-next")
      .addEventListener("click", () => navegarPopup( 1));

    // Fecha apenas se clicar no fundo escuro
    popup.addEventListener("click", function (e) {
      if (e.target === popup) popup.classList.add("hidden");
    });

    // Teclado: ← / → navegam; Esc fecha
    document.addEventListener("keydown", (e) => {
      const popupAberto = !popup.classList.contains("hidden");
      if (!popupAberto) return;
      if (e.key === "ArrowLeft")  { e.preventDefault(); navegarPopup(-1); }
      if (e.key === "ArrowRight") { e.preventDefault(); navegarPopup( 1); }
      if (e.key === "Escape")     { popup.classList.add("hidden"); }
    });
  }

  // ----------------------------------------------------------
  // Inputs de Válvula Fancoil / By-pass
  // ----------------------------------------------------------
  const VALOR_INICIAL = 75;
  const OSCILACAO_MAX = 10; // ±10%

  // Valor "base" que será oscilado
  let valorBase = VALOR_INICIAL;

  // Temperaturas base do tanque pulmão (valores em Celsius com ponto decimal)
  const TEMPERATURAS_BASE = [
    17.58, // temp-1
    17.72, // temp-2
    17.08, // temp-3
    17.89  // temp-4
  ];

  // Oscilação de temperatura: ±0.9 graus
  const OSCILACAO_TEMP_MAX = 0.9;
  // Passo de oscilação para temperatura (mais suave que as válvulas)
  const PASSO_TEMP = 0.01;

  /**
   * Atualiza o input 2 de acordo com o input 1
   */
  function atualizar() {
    // Só permite atualização normal se houver fluxo
    if (!haFluxo()) {
      // Sem fluxo: manter valores zerados
      document.getElementById('valvula_fancoil').value = 0;
      document.getElementById('bypass').value = 0;
      return;
    }

    let v = parseInt(document.getElementById('valvula_fancoil').value) || 0;

    if (v < 0)   v = 0;
    if (v > 100) v = 100;

    document.getElementById('valvula_fancoil').value = v;
    document.getElementById('bypass').value = 100 - v;

    // Sincroniza o valor base com o digitado (apenas se houver fluxo)
    valorBase = v;
  }

  /**
   * Botões + e − ajustam manualmente
   */
  function ajustar(delta) {
    // Só permite ajuste se houver fluxo
    if (!haFluxo()) {
      // Sem fluxo: manter valores zerados
      document.getElementById('valvula_fancoil').value = 0;
      document.getElementById('bypass').value = 0;
      return;
    }

    const input = document.getElementById('valvula_fancoil');
    input.value = (parseInt(input.value) || 0) + delta;
    atualizar();
  }

  /**
   * Formata número para exibição com vírgula como separador decimal
   */
  function formatarTemperatura(num) {
    return num.toFixed(2).replace('.', ',');
  }

  /**
   * Oscilação aleatória e gradual (passo de 1 em 1 para válvulas, passo pequeno para temperaturas)
   */
  function oscilar() {
    // OSCILAÇÃO DAS VÁLVULAS (existente)
    // Só permite oscilação se houver fluxo
    if (!haFluxo()) {
      // Sem fluxo: manter valores zerados
      document.getElementById('valvula_fancoil').value = 0;
      document.getElementById('bypass').value = 0;
    } else {
      // Sorteia um alvo dentro do intervalo ±10% do valor base
      const min  = Math.max(0, valorBase - OSCILACAO_MAX);
      const max  = Math.min(100, valorBase + OSCILACAO_MAX);
      const alvo = Math.floor(Math.random() * (max - min + 1)) + min;

      let atual = parseInt(document.getElementById('valvula_fancoil').value) || 0;

      // Move 1 passo em direção ao alvo (gradual)
      if (atual < alvo)      atual++;
      else if (atual > alvo) atual--;

      document.getElementById('valvula_fancoil').value = atual;
      document.getElementById('bypass').value = 100 - atual;
    }

    // OSCILAÇÃO DAS TEMPERATURAS DO TANQUE PULMÃO (nova funcionalidade)
    // Só permite oscilação se houver fluxo
    if (!haFluxo()) {
      // Sem fluxo: manter temperaturas nos valores base (sem oscilar)
      for (let i = 0; i < TEMPERATURAS_BASE.length; i++) {
        const tempElement = document.getElementById(`temp-${i + 1}`);
        if (tempElement) {
          tempElement.textContent = formatarTemperatura(TEMPERATURAS_BASE[i]) + ' ºC';
        }
      }
    } else {
      // Com fluxo: oscilar cada temperatura independentemente
      for (let i = 0; i < TEMPERATURAS_BASE.length; i++) {
        const tempElement = document.getElementById(`temp-${i + 1}`);
        if (!tempElement) continue;

        // Valor atual exibido (converte de string com vírgula para número)
        const textoAtual = tempElement.textContent.replace(' ºC', '').replace(',', '.');
        let atual = parseFloat(textoAtual) || TEMPERATURAS_BASE[i];

        // Define alvo aleatório dentro do intervalo ±0.9 do valor base desta sensor
        const base = TEMPERATURAS_BASE[i];
        const minTemp = Math.max(0, base - OSCILACAO_TEMP_MAX); // Temperatura mínima realista
        const maxTemp = base + OSCILACAO_TEMP_MAX;
        const alvoTemp = parseFloat((Math.random() * (maxTemp - minTemp) + minTemp).toFixed(2));

        // Move em direção ao alvo com passo pequeno para oscilação suave
        if (atual < alvoTemp) {
          atual += PASSO_TEMP;
          if (atual > alvoTemp) atual = alvoTemp; // Não ultrapassa o alvo
        } else if (atual > alvoTemp) {
          atual -= PASSO_TEMP;
          if (atual < alvoTemp) atual = alvoTemp; // Não ultrapassa o alvo
        }

        // Atualiza o display com formatação correta (vírgula como decimal)
        tempElement.textContent = formatarTemperatura(atual) + ' ºC';
      }
    }
  }

  // Executa a oscilação a cada 2s para parecer suave
  setInterval(oscilar, 2000);

  // ----------------------------------------------------------
  // Botões do painel
  // ----------------------------------------------------------
  if (btnReset) btnReset.addEventListener('click', centralizar);
  if (btnFit)   btnFit.addEventListener('click', fitScreen);

  // ----------------------------------------------------------
  // Inicialização
  // ----------------------------------------------------------
  window.addEventListener('resize', fitScreen);
  fitScreen();
  // Set initial zoom to 65%
  scale = 0.65;
  // Recalculate offsets to keep diagram centered
  offsetX = (window.innerWidth - DIAGRAM_W * scale) / 2;
  offsetY = (window.innerHeight - DIAGRAM_H * scale) / 2;
  aplicarTransform();
  initValvulas();
  initChillers();
  initPopupCag();
  initPopupComponente();

  // Inicializa os indicadores com o estado correto
  atualizarIndicadores();

  // Inicializa a exibição das temperaturas com os valores base
  for (let i = 0; i < TEMPERATURAS_BASE.length; i++) {
    const tempElement = document.getElementById(`temp-${i + 1}`);
    if (tempElement) {
      tempElement.textContent = formatarTemperatura(TEMPERATURAS_BASE[i]) + ' ºC';
    }
  }

  atualizarFluxo();
})();
