const apiKey = '74df1e8b2685284cdbf0267da7a6051b';
const botonUbicacion = document.querySelector('.btn-ubicacion');
const infoHoy = document.querySelector('.info-hoy');
const iconoClimaHoy = document.querySelector('.clima-hoy i');
const tempHoy = document.querySelector('.temperatura');
const listaDias = document.querySelector('.lista-dias');
const videoFondo = document.getElementById('background-video');

// Mapeo de códigos de condiciones climáticas a iconos y videos
const mapaIconosClima = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'sun',
    '02n': 'moon',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloud',
    '04n': 'cloud',
    '09d': 'cloud-rain',
    '09n': 'cloud-rain',
    '10d': 'cloud-rain',
    '10n': 'cloud-rain',
    '11d': 'cloud-lightning',
    '11n': 'cloud-lightning',
    '13d': 'cloud-snow',
    '13n': 'cloud-snow',
    '50d': 'water',
    '50n': 'water'
};

// Diccionario de traducción para las descripciones del clima y videos de fondo
const mapaDescripcionClima = {
    "clear sky": { descripcion: "Cielo Despejado", video: "/videos/cielo-despejado.mp4" },
    "few clouds": { descripcion: "Pocas Nubes", video: "/videos/pocas-nubes.mp4" },
    "scattered clouds": { descripcion: "Nubes dispersas", video: "/videos/Nubes dispersas2.mp4" },
    "broken clouds": { descripcion: "Nubes dispersas", video: "/videos/Nubes dispersas.mp4" },
    "shower rain": { descripcion: "Lluvia Pesada", video: "/videos/lluvia-pesada.mp4" },
    "rain": { descripcion: "Lluvia", video: "/videos/lluvia.mp4" },
    "thunderstorm": { descripcion: "Tormenta", video: "/videos/Tormenta.mp4" },
    "snow": { descripcion: "Nevada", video: "/videos/Nevada.mp4" },
    "mist": { descripcion: "Niebla", video: "/videos/Nublado.mp4" },
    "overcast clouds": { descripcion: "Nublado", video: "/videos/Nublado.mp4" },
    "light rain": { descripcion: "Llovizna", video: "/videos/llovizna.mp4" },
    "light snow": { descripcion: "Nevada Ligera", video: "/videos/Nevada.mp4" },
    "moderate rain": { descripcion: "Llovizna", video: "/videos/llovizna.mp4" }
};

function obtenerDatosClima(ubicacion) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${ubicacion}&appid=${apiKey}&units=metric`;

    // Obtener datos climáticos de la API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Actualizar información de hoy
            const climaHoy = data.list[0].weather[0].description;
            const temperaturaHoy = `${Math.round(data.list[0].main.temp)}°C`;
            const iconoClimaHoyCodigo = data.list[0].weather[0].icon;

            infoHoy.querySelector('h2').textContent = new Date().toLocaleDateString('es', { weekday: 'long' });
            infoHoy.querySelector('span').textContent = new Date().toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });
            iconoClimaHoy.className = `bx bx-${mapaIconosClima[iconoClimaHoyCodigo]}`;
            tempHoy.textContent = temperaturaHoy;

            // Actualizar ubicación y descripción del clima en la sección "info-izquierda"
            const elementoUbicacion = document.querySelector('.info-hoy > div > span');
            elementoUbicacion.textContent = `${data.city.name}, ${data.city.country}`;

            const elementoDescripcionClima = document.querySelector('.clima-hoy > h3');
            const infoClima = mapaDescripcionClima[climaHoy] || { descripcion: climaHoy, video: "default.mp4" };
            elementoDescripcionClima.textContent = infoClima.descripcion;
            videoFondo.src = infoClima.video;

            // Actualizar información de hoy en la sección "info-dia"
            const precipitacionHoy = `${data.list[0].pop}%`;
            const humedadHoy = `${data.list[0].main.humidity}%`;
            const velocidadVientoHoy = `${data.list[0].wind.speed} km/h`;

            const contenedorInfoDia = document.querySelector('.info-dia');
            contenedorInfoDia.innerHTML = `
                <div>
                    <span class="titulo">PRECIPITACIÓN</span>
                    <span class="valor">${precipitacionHoy}</span>
                </div>
                <div>
                    <span class="titulo">HUMEDAD</span>
                    <span class="valor">${humedadHoy}</span>
                </div>
                <div>
                    <span class="titulo">VEL. DEL VIENTO</span>
                    <span class="valor">${velocidadVientoHoy}</span>
                </div>
            `;

            // Actualizar clima de los próximos 4 días
            const hoy = new Date();
            const datosProximosDias = data.list.slice(1);

            const diasUnicos = new Set();
            let contador = 0;
            listaDias.innerHTML = '';
            for (const datosDia of datosProximosDias) {
                const fechaPronostico = new Date(datosDia.dt_txt);
                const abreviaturaDia = fechaPronostico.toLocaleDateString('es', { weekday: 'short' });
                const tempDia = `${Math.round(datosDia.main.temp)}°C`;
                const codigoIcono = datosDia.weather[0].icon;

                // Asegurarse de que el día no esté duplicado y no sea hoy
                if (!diasUnicos.has(abreviaturaDia) && fechaPronostico.getDate() !== hoy.getDate()) {
                    diasUnicos.add(abreviaturaDia);
                    listaDias.innerHTML += `
                        <li>
                            <i class='bx bx-${mapaIconosClima[codigoIcono]}'></i>
                            <span>${abreviaturaDia}</span>
                            <span class="temperatura-dia">${tempDia}</span>
                        </li>
                    `;
                    contador++;
                }

                // Detener después de obtener 4 días distintos
                if (contador === 4) break;
            }
        })
        .catch(error => {
            alert(`Error al obtener datos del clima: ${error} (Error de API)`);
        });
}

// Obtener datos climáticos al cargar el documento para la ubicación predeterminada (Lima)
document.addEventListener('DOMContentLoaded', () => {
    const ubicacionPredeterminada = 'Lima';
    obtenerDatosClima(ubicacionPredeterminada);
});

botonUbicacion.addEventListener('click', () => {
    const ubicacion = prompt('Introducir una ubicación:');
    if (!ubicacion) return;

    obtenerDatosClima(ubicacion);
});
