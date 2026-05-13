document.addEventListener('DOMContentLoaded', () => {
    // Definições geográficas
    const states = {
        "BRASIL": { c: [-14.235, -51.925], z: 4, n: 4000 },
        "DF": { c: [-15.780, -47.929], z: 11, n: 1000 },
        "BA": { c: [-12.971, -38.501], z: 7, n: 1400 },
        "ES": { c: [-19.183, -40.308], z: 8, n: 800 },
        "MG": { c: [-18.512, -44.555], z: 7, n: 1800 },
        "PA": { c: [-1.455, -48.504], z: 6, n: 950 },
        "RJ": { c: [-22.906, -43.172], z: 10, n: 2200 },
        "SP": { c: [-23.550, -46.633], z: 9, n: 3200 }
    };

    // Inicializa mapa com estilo CLARO
    const map = L.map('map-container', { zoomControl: false }).setView(states.BRASIL.c, states.BRASIL.z);

    // Tile Layer: CartoDB Positron (Versão Clara)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; GeoCrime PI'
    }).addTo(map);

    let heat;

    function renderHeatmap(key) {
        if (heat) map.removeLayer(heat);

        const config = states[key];
        const points = [];
        const radius = key === "BRASIL" ? 10 : 0.6; // Ajusta dispersão por zoom

        for (let i = 0; i < config.n; i++) {
            const lat = config.c[0] + (Math.random() - 0.5) * radius;
            const lng = config.c[1] + (Math.random() - 0.5) * radius;
            points.push([lat, lng, Math.random()]);
        }

        heat = L.heatLayer(points, {
            radius: 25, blur: 15,
            gradient: { 0.4: '#3b82f6', 0.6: '#10b981', 0.8: '#f59e0b', 1.0: '#ef4444' }
        }).addTo(map);

        map.flyTo(config.c, config.z);
        document.getElementById('count-display').innerText = config.n.toLocaleString();
    }

    document.getElementById('state-selector').addEventListener('change', (e) => renderHeatmap(e.target.value));

    // Carga inicial
    renderHeatmap("BRASIL");
});