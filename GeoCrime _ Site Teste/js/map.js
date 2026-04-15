/**
 * GeoCrime — map.js
 * Inicialização dos mapas Leaflet + heatmap do Brasil
 * Dependências: Leaflet 1.9.4 + leaflet-heat 0.2.0
 */
(function () {
  'use strict';

  /* ══════════════════════════════════════════
     TILE & DADOS
  ══════════════════════════════════════════ */

  var TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  var TILE_OPT = {
    attribution: '© OpenStreetMap © CARTO',
    subdomains: 'abcd',
    maxZoom: 19
  };

  /* Pontos de calor representativos — [lat, lng, intensidade] */
  var DATA = [
    /* Capitais e regiões metropolitanas */
    [-23.5505, -46.6333, 1.0],  /* São Paulo     */
    [-22.9068, -43.1729, 0.95], /* Rio de Janeiro*/
    [-19.9167, -43.9345, 0.88], /* Belo Horizonte*/
    [-30.0346, -51.2177, 0.82], /* Porto Alegre  */
    [-25.4284, -49.2733, 0.80], /* Curitiba      */
    [-12.9777, -38.5016, 0.85], /* Salvador      */
    [-3.7172,  -38.5433, 0.78], /* Fortaleza     */
    [-8.0476,  -34.8770, 0.82], /* Recife        */
    [-9.6658,  -35.7350, 0.70], /* Maceió        */
    [-2.5297,  -44.3028, 0.72], /* São Luís      */
    [-5.7945,  -35.2110, 0.68], /* Natal         */
    [-7.1195,  -34.8450, 0.72], /* João Pessoa   */
    [-7.2306,  -39.3210, 0.62], /* Juazeiro do Norte */
    [-15.7801, -47.9292, 0.88], /* Brasília      */
    [-16.6869, -49.2648, 0.80], /* Goiânia       */
    [-20.4428, -54.6460, 0.74], /* Campo Grande  */
    [-15.5989, -56.0949, 0.70], /* Cuiabá        */
    [-10.9472, -37.0731, 0.66], /* Aracaju       */
    [-8.7612,  -63.9004, 0.58], /* Porto Velho   */
    [-9.9750,  -67.8249, 0.52], /* Rio Branco    */
    [-3.1190,  -60.0217, 0.62], /* Manaus        */
    [-1.4558,  -48.5044, 0.68], /* Belém         */
    [-0.0349,  -51.0694, 0.54], /* Macapá        */
    [2.8235,   -60.6758, 0.42], /* Boa Vista     */
    [-22.3210, -49.0683, 0.60], /* Bauru         */
    [-21.1767, -47.8208, 0.58], /* Ribeirão Preto*/
    [-22.7478, -47.3318, 0.62], /* Campinas      */
    [-23.9618, -46.3322, 0.72], /* Santos        */
    [-23.1896, -45.8841, 0.68], /* SJC           */
    [-24.3058, -47.3443, 0.55], /* Registro      */

    /* Dispersão por bairros de SP */
    [-23.5329, -46.6395, 0.90], [-23.5475, -46.6361, 0.85],
    [-23.5618, -46.6502, 0.82], [-23.5700, -46.6220, 0.78],
    [-23.5150, -46.6500, 0.75], [-23.5800, -46.6100, 0.70],
    [-23.5400, -46.6800, 0.88], [-23.5250, -46.6600, 0.72],
    [-23.5900, -46.6400, 0.65], [-23.6050, -46.6200, 0.60],
    [-23.5350, -46.7100, 0.55], [-23.6200, -46.7000, 0.52],

    /* Dispersão por bairros do RJ */
    [-22.8900, -43.1800, 0.88], [-22.9200, -43.2200, 0.80],
    [-22.9500, -43.1600, 0.75], [-22.9800, -43.3000, 0.70],
    [-23.0100, -43.3200, 0.65], [-22.8600, -43.1000, 0.72],
    [-22.9300, -43.0500, 0.68], [-23.0000, -43.2500, 0.60],

    /* Interior SP */
    [-22.9050, -47.0608, 0.62], /* Campinas extra */
    [-21.7645, -41.3244, 0.55], /* Campos dos Goytacazes */
    [-20.3222, -40.3381, 0.60], /* Vitória */
    [-18.9113, -48.2622, 0.58], /* Uberlândia */
    [-21.2339, -45.9244, 0.52], /* Poços de Caldas */
    [-17.8619, -41.5044, 0.48], /* Governador Valadares */
    [-22.1250, -43.5540, 0.50], /* Petrópolis */
    [-22.4068, -45.4536, 0.48], /* Itajubá */
    [-23.3045, -51.1696, 0.55], /* Londrina */
    [-23.4205, -51.9333, 0.52], /* Maringá */
    [-26.3045, -48.8487, 0.58], /* Joinville */
    [-27.5969, -48.5495, 0.62], /* Florianópolis */
    [-29.6868, -53.8023, 0.55], /* Santa Maria */
    [-28.2618, -52.4083, 0.50], /* Passo Fundo */
    [-13.4125, -38.9131, 0.55], /* Ilhéus */
    [-10.8778, -37.0731, 0.50], /* Sergipe interior */
    [-6.4834,  -37.0862, 0.45], /* Caicó */
    [-4.9609,  -37.3531, 0.48], /* Mossoró */
    [-3.8672,  -42.0729, 0.45], /* Parnaíba */
    [-5.0920,  -42.8016, 0.50], /* Teresina */
    [-6.0274,  -35.1956, 0.48], /* Caicó RN */
    [-7.5150,  -46.0416, 0.42], /* Imperatriz */
    [-11.0139, -37.2005, 0.44], /* Estância */
    [-16.3373, -48.9527, 0.52], /* Anápolis */
    [-17.7217, -48.6189, 0.48], /* Anápolis GO extra */
    [-3.4653,  -62.2159, 0.40], /* Coari */
    [-6.6602,  -69.8682, 0.35], /* Eirunepé */
    [-5.3652,  -49.1252, 0.38], /* Marabá */
    [-1.7239,  -48.8922, 0.42], /* Castanhal */
    [-4.2661,  -56.0029, 0.40], /* Santarém */
    [-22.5150, -44.1560, 0.55], /* Volta Redonda */
    [-21.9800, -47.8700, 0.50], /* São Carlos */
    [-23.1040, -47.7100, 0.48], /* Itu */
    [-23.0500, -46.8400, 0.52], /* Mogi das Cruzes */
    [-23.7200, -46.5500, 0.58], /* Santo André ABC */
    [-23.7500, -46.5800, 0.55], /* São Bernardo */
    [-23.7800, -46.5200, 0.52], /* São Caetano */
    [-23.8000, -46.4800, 0.50]  /* Diadema */
  ];

  /* Subconjuntos por categoria */
  var SUBSETS = {
    all:       DATA,
    furto:     DATA.filter(function(_, i) { return i % 3 !== 0; }),
    roubo:     DATA.filter(function(_, i) { return i % 2 !== 0; }),
    homicidio: DATA.filter(function(p)    { return p[2] >= 0.75; })
  };

  /* ══════════════════════════════════════════
     FACTORY DE MAPA
  ══════════════════════════════════════════ */

  function makeMap(id, opts) {
    var el = document.getElementById(id);
    if (!el) return null;
    var map = L.map(id, {
      center:          opts.center   || [-15.79, -47.88],
      zoom:            opts.zoom     || 4,
      zoomControl:     !!opts.zoom_ctrl,
      scrollWheelZoom: !!opts.scroll,
      dragging:        opts.drag !== false,
      attributionControl: !!opts.zoom_ctrl
    });
    L.tileLayer(TILE_URL, TILE_OPT).addTo(map);
    return map;
  }

  /* ══════════════════════════════════════════
     MAPA HERO
  ══════════════════════════════════════════ */

  function initHero() {
    var map = makeMap('map-hero', {
      zoom: 4, drag: false, scroll: false
    });
    if (!map) return;
    L.heatLayer(DATA, {
      radius: 28, blur: 22, maxZoom: 10,
      gradient: { 0.2:'#1a56db', 0.5:'#f59e0b', 0.8:'#ef4444', 1.0:'#ff0000' }
    }).addTo(map);
  }

  /* ══════════════════════════════════════════
     MAPA FEATURES (SP)
  ══════════════════════════════════════════ */

  function initFeatures() {
    var map = makeMap('map-features', {
      center: [-23.55, -46.63], zoom: 10,
      drag: false, scroll: false
    });
    if (!map) return;
    var sp = DATA.filter(function(p) {
      return p[0] < -22.5 && p[0] > -24.5 && p[1] > -47.5 && p[1] < -45.5;
    });
    L.heatLayer(sp, {
      radius: 32, blur: 26, maxZoom: 14,
      gradient: { 0.2:'#1a56db', 0.5:'#f59e0b', 0.8:'#ef4444', 1.0:'#ff0000' }
    }).addTo(map);
  }

  /* ══════════════════════════════════════════
     MAPA FULL (interativo)
  ══════════════════════════════════════════ */

  var fullMap   = null;
  var heatLayer = null;

  function initFull() {
    fullMap = makeMap('map-full', {
      zoom: 4, zoom_ctrl: true, scroll: true, drag: true
    });
    if (!fullMap) return;
    heatLayer = L.heatLayer(DATA, {
      radius: 30, blur: 24, maxZoom: 12,
      gradient: { 0.2:'#1a56db', 0.5:'#f59e0b', 0.8:'#ef4444', 1.0:'#ff0000' }
    });
    heatLayer.addTo(fullMap);
  }

  /* ══════════════════════════════════════════
     FILTRO DE CATEGORIA
  ══════════════════════════════════════════ */

  window.setFilter = function (btn, cat) {
    document.querySelectorAll('.map-filter-btn').forEach(function (b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');

    if (!fullMap || !heatLayer) return;
    fullMap.removeLayer(heatLayer);
    heatLayer = L.heatLayer(SUBSETS[cat] || DATA, {
      radius: 30, blur: 24, maxZoom: 12,
      gradient: { 0.2:'#1a56db', 0.5:'#f59e0b', 0.8:'#ef4444', 1.0:'#ff0000' }
    });
    heatLayer.addTo(fullMap);
  };

  /* ══════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════ */

  document.addEventListener('DOMContentLoaded', function () {
    if (typeof L === 'undefined' || typeof L.heatLayer === 'undefined') {
      console.warn('GeoCrime: Leaflet ou leaflet-heat não encontrado.');
      return;
    }
    initHero();
    initFeatures();
    initFull();
  });
})();