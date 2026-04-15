/**
 * GeoCrime — js/map-page.js
 * Inicialização do mapa Leaflet + heatmap para a página do mapa interativo.
 * Dependências: Leaflet 1.9.4, leaflet-heat 0.2.0, PapaParse 5.3.0
 */
(function () {
  'use strict';

  /* ══════════════════════════════════════════
     CONFIGURAÇÕES DO MAPA
  ══════════════════════════════════════════ */

  const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  const TILE_OPT = {
    attribution: '© OpenStreetMap © CARTO',
    subdomains: 'abcd',
    maxZoom: 19
  };

  let fullMap = null;
  let heatLayer = null;
  let allCrimeData = []; // Armazena todos os dados do CSV
  let crimeTypes = new Set(); // Armazena os tipos de crime únicos
  const CRIME_TYPE_COLUMN = 4; // Coluna 'TIPO_CRIME_DESCRICAO' no CSV (índice 4)
  const LAT_COLUMN = 40; // Coluna 'latitude' no CSV (índice 40)
  const LNG_COLUMN = 41; // Coluna 'longitude' no CSV (índice 41)

  /* ══════════════════════════════════════════
     FUNÇÕES AUXILIARES
  ══════════════════════════════════════════ */

  /**
   * Cria e retorna uma instância do mapa Leaflet.
   * @param {string} id O ID do elemento HTML onde o mapa será renderizado.
   * @param {object} options Opções de configuração do mapa.
   * @returns {L.Map|null} A instância do mapa ou null se o elemento não for encontrado.
   */
  function makeMap(id, options) {
    const el = document.getElementById(id);
    if (!el) {
      console.warn(`GeoCrime: Elemento #${id} não encontrado para o mapa.`);
      return null;
    }

    const defaultOptions = {
      center: [-18.5122, -44.5550], // Centro de Minas Gerais
      zoom: 7,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: options.zoom_ctrl !== false, // Controla o zoom
      scrollWheelZoom: options.scroll !== false, // Roda do mouse para zoom
      dragging: options.drag !== false, // Arrastar o mapa
      tap: false // Desabilita tap para evitar problemas em alguns dispositivos móveis
    };

    const map = L.map(id, { ...defaultOptions, ...options });
    L.tileLayer(TILE_URL, TILE_OPT).addTo(map);
    return map;
  }

  /**
   * Carrega os dados do CSV e os processa.
   * @param {function} callback Função a ser executada após o carregamento dos dados.
   */
  function loadCSVData(callback) {
    Papa.parse('MG_microdados_bairro_parcial.csv', {
      download: true,
      header: false, // O CSV não tem cabeçalho na primeira linha
      skipEmptyLines: true,
      complete: function (results) {
        // Ignora a primeira linha se for um cabeçalho ou dados irrelevantes
        const rawData = results.data.slice(1);

        allCrimeData = rawData.map(row => {
          const lat = parseFloat(row[LAT_COLUMN]);
          const lng = parseFloat(row[LNG_COLUMN]);
          const crimeType = row[CRIME_TYPE_COLUMN] ? String(row[CRIME_TYPE_COLUMN]).trim() : 'Outros'; // Garante que é string

          if (!isNaN(lat) && !isNaN(lng)) {
            crimeTypes.add(crimeType);
            return { lat: lat, lng: lng, type: crimeType };
          }
          return null;
        }).filter(Boolean); // Remove entradas nulas

        console.log(`GeoCrime: ${allCrimeData.length} ocorrências carregadas.`);
        console.log('Tipos de crime encontrados:', Array.from(crimeTypes));

        if (callback) callback();
      },
      error: function (err) {
        console.error('GeoCrime: Erro ao carregar CSV:', err);
        alert('Erro ao carregar os dados de criminalidade. Verifique o arquivo CSV.');
      }
    });
  }

  /**
   * Gera os botões de filtro dinamicamente com base nos tipos de crime encontrados.
   */
  function generateFilterButtons() {
    const filtersContainer = document.getElementById('map-filters-container');
    if (!filtersContainer) return;

    // Limpa apenas os botões gerados dinamicamente, mantendo o "Todos os crimes" se ele já estiver lá
    // Uma abordagem melhor é limpar tudo e regenerar, ou ter um placeholder
    // Para simplificar, vamos limpar tudo e recriar, incluindo o "Todos os crimes"
    filtersContainer.innerHTML = '';

    // Botão "Todos os crimes"
    const allBtn = document.createElement('button');
    allBtn.className = 'map-filter-btn active';
    allBtn.textContent = 'Todos os crimes';
    allBtn.onclick = function () {
      setFilter(this, 'all');
    };
    filtersContainer.appendChild(allBtn);

    // Botões para cada tipo de crime
    const sortedCrimeTypes = Array.from(crimeTypes).sort();
    sortedCrimeTypes.forEach(type => {
      const btn = document.createElement('button');
      btn.className = 'map-filter-btn';
      btn.textContent = type;
      btn.onclick = function () {
        setFilter(this, type);
      };
      filtersContainer.appendChild(btn);
    });
  }

  /* ══════════════════════════════════════════
     MAPA INTERATIVO
  ══════════════════════════════════════════ */

  /**
   * Inicializa o mapa de calor interativo na página.
   */
  function initFullMap() {
    fullMap = makeMap('map-full', {
      zoom: 7, zoom_ctrl: true, scroll: true, drag: true
    });
    if (!fullMap) return;

    // Adiciona a camada de calor inicial com todos os dados
    updateHeatmap(allCrimeData);

    // Ajusta o mapa para mostrar todos os pontos de MG
    if (allCrimeData.length > 0) {
      const latLngs = allCrimeData.map(p => [p.lat, p.lng]);
      fullMap.fitBounds(L.latLngBounds(latLngs), { padding: [50, 50] }); // Adiciona um padding
    }

    generateFilterButtons(); // Gera os botões após o mapa ser inicializado e dados carregados
  }

  /**
   * Atualiza a camada de calor do mapa com novos dados.
   * @param {Array<object>} data Os dados a serem exibidos no mapa de calor.
   */
  function updateHeatmap(data) {
    if (heatLayer) {
      fullMap.removeLayer(heatLayer);
    }

    const heatPoints = data.map(p => [p.lat, p.lng, 1]); // Intensidade 1 para todos os pontos

    heatLayer = L.heatLayer(heatPoints, {
      radius: 30, blur: 24, maxZoom: 12,
      gradient: { 0.2:'#1a56db', 0.5:'#f59e0b', 0.8:'#ef4444', 1.0:'#ff0000' }
    });
    heatLayer.addTo(fullMap);
  }

  /* ══════════════════════════════════════════
     FILTRO DE CATEGORIA
  ══════════════════════════════════════════ */

  /**
   * Filtra os dados do mapa de calor com base no tipo de crime selecionado.
   * @param {HTMLElement} btn O botão de filtro clicado.
   * @param {string} category A categoria de crime para filtrar ('all' para todos).
   */
  window.setFilter = function (btn, category) {
    document.querySelectorAll('.map-filter-btn').forEach(function (b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');

    if (!fullMap) return;

    let filteredData = [];
    if (category === 'all') {
      filteredData = allCrimeData;
    } else {
      filteredData = allCrimeData.filter(item => item.type === category);
    }
    updateHeatmap(filteredData);
  };

  /* ══════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════ */

  document.addEventListener('DOMContentLoaded', function () {
    if (typeof L === 'undefined' || typeof L.heatLayer === 'undefined') {
      console.warn('GeoCrime: Leaflet ou leaflet-heat não encontrado. Certifique-se de que os scripts estão carregados.');
      // Tenta carregar Leaflet e Leaflet-Heat se não estiverem presentes
      // Esta parte é mais robusta se os scripts forem incluídos no HTML
      // mas mantemos a lógica de PapaParse para o caso de ser dinâmico
    }

    // Inclui PapaParse dinamicamente se não estiver presente
    if (typeof Papa === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js';
      script.onload = function() {
        loadCSVData(initFullMap);
      };
      script.onerror = function() {
        console.error('GeoCrime: Falha ao carregar PapaParse.');
        alert('Erro ao carregar a biblioteca de processamento de dados. Tente novamente.');
      };
      document.head.appendChild(script);
    } else {
      loadCSVData(initFullMap);
    }
  });
})();