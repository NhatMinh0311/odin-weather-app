class Unit {
    constructor(system) {
        switch (system) {
            case "metric":
                this.temperature = '°C';
                this.humidity = '%';
                break;
            case "uk":
                this.temperature = '°C';
                this.humidity = '%';
                break;
            case "us":
                this.temperature = '°F';
                this.humidity = '%';
                break;
        }
    }
}

async function getData(city, unitGroup) {
    const query = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${unitGroup}&key=9ACKTQREWYFJWA9SALDYCVG73&contentType=json`;
    const response = await fetch(query, 
                    {mode: 'cors'}
                    );
    const data = await response.json();
    return data;              
}

async function getCurrentData(city, unitGroup){
    const allData = await getData(city, unitGroup);
    const userLocation = allData.resolvedAddress;
    const currentData = allData.currentConditions;
    const {datetime, temp, feelslike, icon, conditions, humidity} = currentData;
    console.log(icon);
    return {userLocation, datetime, temp, feelslike, icon, conditions, humidity};
}

function renderContent(data, unit) {
    const contentDiv = document.querySelector("#content-div");
    contentDiv.innerHTML = "";

    const conditionsDiv = document.createElement("div");
    const imageContainer = document.createElement("div");
    imageContainer.setAttribute("id", "img-container");
    const weatherIconImage = document.createElement("img");
    weatherIconImage.src = `./images/${data.icon}.png`;
    weatherIconImage.alt = data.icon;
    imageContainer.appendChild(weatherIconImage);
    const conditionsPara = document.createElement("p");
    conditionsPara.innerText = data.conditions;
    conditionsDiv.append(imageContainer, conditionsPara);
    contentDiv.appendChild(conditionsDiv);

    const indexInfoDiv = document.createElement("div");

    const locationHeader = document.createElement("h1");
    locationHeader.innerText = data.userLocation;

    const timeHeader = document.createElement("h3");
    timeHeader.innerText = data.datetime;

    const temperatureDiv = document.createElement("div");
    const temperaturePara = document.createElement("h2");
    temperaturePara.style.textAlign = "center";
    temperaturePara.innerText = `${data.temp}${unit.temperature}`;
    const feelingTemperaturePara = document.createElement("p");
    feelingTemperaturePara.style.textAlign = "center";
    feelingTemperaturePara.innerText = `Feels like ${data.feelslike}${unit.temperature}`;
    temperatureDiv.append(temperaturePara, feelingTemperaturePara);

    const humidityPara = document.createElement("p");
    humidityPara.innerText = `Humidity ${data.humidity}${unit.humidity}`;

    indexInfoDiv.append(locationHeader, timeHeader, temperatureDiv, humidityPara);
    contentDiv.appendChild(indexInfoDiv);
}

function getInput() {
    const userInputLocation = document.querySelector("#location").value;
    const userInputUnit = document.querySelector("#unit-group").value;
    return {userInputLocation, userInputUnit};
}
const searchBtn = document.querySelector("button");
let userUnit = new Unit("metric");

searchBtn.addEventListener("click", () => {
    const {userInputLocation, userInputUnit} = getInput();
    userUnit = new Unit(userInputUnit);
    getCurrentData(userInputLocation, userInputUnit).then(data => renderContent(data, userUnit)).catch(error => {alert("Location not found")});
});
