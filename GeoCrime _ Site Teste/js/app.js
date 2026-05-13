document.addEventListener('DOMContentLoaded', () => {
    // Configurações de visão para cada estado
    const configuracoesEstados = {
        "BRASIL": { centro: [-15.78, -47.93], zoom: 4 },
        "DF": { centro: [-15.7801, -47.9292], zoom: 11 },
        "BA": { centro: [-12.9714, -38.5014], zoom: 7 },
        "ES": { centro: [-19.1834, -40.3089], zoom: 8 },
        "MG": { centro: [-18.5122, -44.5550], zoom: 7 },
        "PA": { centro: [-1.4558, -48.4902], zoom: 6 },
        "RJ": { centro: [-22.9068, -43.1729], zoom: 9 },
        "SP": { centro: [-23.5505, -46.6333], zoom: 8 }
    };

    const map = L.map('map').setView(configuracoesEstados["BRASIL"].centro, configuracoesEstados["BRASIL"].zoom);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: 'GeoCrime'
    }).addTo(map);

    let heatLayer;

    // Gerador de dados fictícios filtrado por estado
    function carregarDadosEstado(sigla) {
        if (heatLayer) map.removeLayer(heatLayer);

        const config = configuracoesEstados[sigla];
        const pontos = [];
        
        // Simulação de densidade: quanto maior o zoom, mais pontos espalhados
        const numPontos = sigla === "BRASIL" ? 3000 : 800;
        const dispersao = sigla === "BRASIL" ? 15 : 1.5;

        for (let i = 0; i < numPontos; i++) {
            const lat = config.centro[0] + (Math.random() - 0.5) * dispersao;
            const lng = config.centro[1] + (Math.random() - 0.5) * dispersao;
            pontos.push([lat, lng, Math.random()]);
        }

        heatLayer = L.heatLayer(pontos, {
            radius: 25,
            blur: 15,
            gradient: { 0.4: 'blue', 0.6: 'lime', 1: 'red' }
        }).addTo(map);

        // Move a câmera suavemente para o estado
        map.flyTo(config.centro, config.zoom);
    }

    // Evento do botão/select
    document.getElementById('state-selector').addEventListener('change', (e) => {
        carregarDadosEstado(e.target.value);
    });

    // Carga inicial
    carregarDadosEstado("BRASIL");
});