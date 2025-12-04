// 1. INICIALIZAÇÃO DO MAPA
const map = L.map('map', {
    center: [-27.59, -48.54],
    zoom: 12,
    zoomControl: false // Desativamos o controle de zoom padrão para reposicioná-lo
});

// 2. ADIÇÃO DO MAPA BASE (TILE LAYER)
// Usamos um tema "light" do CartoDB, que é limpo e combina com a estética
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

// 3. REPOSICIONANDO O CONTROLE DE ZOOM
L.control.zoom({
    position: 'bottomright' // Coloca o zoom no canto inferior direito
}).addTo(map);

// 4. DEFINIÇÃO DOS ÍCONES (COM CSS PURO / L.DivIcon)
// Estes ícones usam as classes CSS que definimos no style.css

const iconeVerde = L.divIcon({
    className: 'div-icon-base icone-mangue-verde', // Combina a base + cor
    iconSize: [40, 40], // Tamanho do ícone
    iconAnchor: [20, 40], // Ponto de ancoragem (metade da largura, base)
    popupAnchor: [0, -40], // Ponto do pop-up
    html: '🌿' // Vamos usar um emoji de folha!
});

const iconeAmarelo = L.divIcon({
    className: 'div-icon-base icone-mangue-amarelo',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    html: '🌿'
});

const iconeVermelho = L.divIcon({
    className: 'div-icon-base icone-mangue-vermelho',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    html: '🌿'
});


// 5. CARREGAMENTO DOS DADOS (Pop-ups)
fetch('dados.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                let icone;
                if (feature.properties.status === 'Saudável') {
                    icone = iconeVerde;
                } else if (feature.properties.status === 'Requer Atenção') {
                    icone = iconeAmarelo;
                } else { // 'Crítico'
                    icone = iconeVermelho;
                }
                return L.marker(latlng, { icon: icone });
            },
            onEachFeature: function (feature, layer) {
                if (feature.properties) {
                    const popupContent = `
                        <h3>${feature.properties.nome}</h3>
                        <p>${feature.properties.descricao}</p>
                        <img src="${feature.properties.imagem_url}" alt="Foto de ${feature.properties.nome}">
                    `;
                    
                    // AQUI ESTÁ A MUDANÇA MÁGICA:
                    layer.bindPopup(popupContent, {
                        autoPan: true,             // Garante que o mapa se mova
                        autoPanPadding: [50, 50],  // Adiciona uma margem de 50px (cima/baixo e lados)
                        keepInView: true           // Tenta manter o popup dentro do container
                    });
                }
            }
        }).addTo(map);
    });

// 6. CORREÇÃO DO "FATIAMENTO"
// (Ainda necessário para garantir que o mapa carregue no container)
setTimeout(function() {
    map.invalidateSize();
}, 100);
