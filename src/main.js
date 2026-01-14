import "./style.css";
import { MeteoService } from "./meteo-service.js";
import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement, TimeScale} from "chart.js";
import 'chartjs-adapter-moment';

const service = new MeteoService();

service.getMeteoData().then(meteoData => displayMeteo(meteoData));

function displayMeteo(meteoData) {

    const temperaturepoints = getTemperaturePoints(meteoData);
    const rainpoints = getRainPoints(meteoData);
    const windpoints = getWindPoints(meteoData);

    testChart("temperature-chart", temperaturepoints);
    testChart("rain-chart", rainpoints);
    testChart("wind-chart", windpoints);

    const container = document.getElementById('app');
    container.innerHTML = "";


    for (const data of meteoData) {

        const card = document.createElement('div');

        const spanTime = document.createElement('span');
        spanTime.innerHTML = data.time;
        card.appendChild(spanTime);

        const spanRain = document.createElement('span');
        spanRain.innerHTML = data.rain;
        card.appendChild(spanRain);

        const spanTemp = document.createElement('span');
        spanTemp.innerHTML = data.temperature;
        card.appendChild(spanTemp);

        const imgCode = document.createElement('img');
        imgCode.src = "/icons/" + data.code + "d.png";
        imgCode.style.backgroundColor = "lightblue";
        card.appendChild(imgCode);

        const spanWind = document.createElement('span');
        spanWind.innerHTML = data.wind;
        card.appendChild(spanWind);

        container.appendChild(card);
    }

}

function getTemperaturePoints(meteoData) {
    console.log("meteo data for temp", meteoData);

    const points = [];

    for (const data of meteoData) {
        const point = {
            x: data.time,
            y: data.temperature
        };
        points.push(point);
    }


    return points;
}

function getRainPoints(meteoData) {
    return meteoData.map(data => {
        return {x: data.time, y:data.rain}
    });
}

function getWindPoints(meteoData) {
    return meteoData.map(data => ({x: data.time, y:data.wind}));
}

function testChart(canvasId, dataPoints) {

    console.log("data points", dataPoints);

    //[{x:"2026-01-13T00:00", y:9},
    //{x:"2026-01-13T01:00", y:8},
    //{x:"2026-01-13T02:00", y:7},...]

    Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, TimeScale);

    const labels = []

    const data = {
        labels: labels,
        datasets: [{
            label: 'My First Dataset',
            data: dataPoints,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            scales: {
                x: {
                    type: 'time',
                }
            }
        }
    };

    const canvas = document.getElementById(canvasId)

    new Chart(canvas, config)

}