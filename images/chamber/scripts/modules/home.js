
const myKey = "90158c8799bb28ca5c3054efdcbe85fd";

// Lima, Peru
const myLat = "-12.0464";
const myLon = "-77.0428";

const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

document.addEventListener("DOMContentLoaded", () => {
    const spotlightsMainBox = document.querySelector(".spotlights-main-box");
    if (!spotlightsMainBox) return;

    spotlightsMainBox.innerHTML = "";

    const createSpotCard = (index) => {
        const spotCard = document.createElement("div");
        spotCard.className = `spot-card spot-card-0${index}`;

        spotCard.innerHTML = `
            <div class="title-spot">
                <h4 id="business-name-0${index}"></h4>
                <h3 id="tag0${index}"></h3>
            </div>
            <div class="spot-img">
                <img id="img-0${index}-spot" width="80" alt="">
            </div>
            <div class="spot-data">
                <p id="phone-0${index}"></p>
                <p><a id="url-0${index}" target="_blank"></a></p>
                <p id="member-since-0${index}"></p>
            </div>
        `;
        return spotCard;
    };

    for (let i = 1; i <= 3; i++) {
        spotlightsMainBox.appendChild(createSpotCard(i));
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("data/members.json");
        const data = await response.json();

        const shuffledData = data.sort(() => 0.5 - Math.random()).slice(0, 3);

        shuffledData.forEach((member, index) => {
            const i = index + 1;

            document.querySelector(`#business-name-0${i}`).textContent = member.Name;
            document.querySelector(`#tag0${i}`).textContent = member.Industry;
            document.querySelector(`#phone-0${i}`).textContent = `Phone: ${member.Phone}`;
            document.querySelector(`#member-since-0${i}`).textContent =
                `Membership: ${member.Membership} | Member since: ${member.MemberSince}`;

            const link = document.querySelector(`#url-0${i}`);
            link.href = member.Website;
            link.textContent = "Visit website";

            const img = document.querySelector(`#img-0${i}-spot`);
            img.src = member.logo;
            img.alt = `${member.Name} logo`;
        });
    } catch (error) {
        console.error("Error loading members:", error);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLon}&units=metric&lang=en&appid=${myKey}`;

    async function fetchWeather() {
        try {
            const response = await fetch(weatherUrl);
            if (!response.ok) throw new Error("Weather fetch failed");

            const data = await response.json();
            displayWeather(data);
        } catch (error) {
            console.error(error);
        }
    }

    function displayWeather(data) {
        const box = document.querySelector("#weather-main");
        if (!box) return;

        const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        const day = weekdays[new Date().getDay()];

        box.innerHTML = `
            <div class="current-weather">
                <h2>Current Weather in ${data.name}, Peru</h2>
                <h4>${day}</h4>
                <p>Temperature: <strong>${Math.round(data.main.temp)}°C</strong></p>
                <figure>
                    <img src="${icon}" alt="${data.weather[0].description}">
                    <figcaption>${data.weather[0].description}</figcaption>
                </figure>
            </div>
        `;
    }

    fetchWeather();
});

document.addEventListener("DOMContentLoaded", () => {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${myLat}&lon=${myLon}&units=metric&lang=en&appid=${myKey}`;

    async function fetchForecast() {
        try {
            const response = await fetch(forecastUrl);
            if (!response.ok) throw new Error("Forecast fetch failed");

            const data = await response.json();
            displayForecast(data);
        } catch (error) {
            console.error(error);
        }
    }

    function displayForecast(data) {
        const container = document.querySelector("#weather-forecast");
        if (!container) return;

        container.innerHTML = `
            <h3>3-Day Weather Forecast</h3>
            <div class="main-day-box"></div>
        `;

        const box = container.querySelector(".main-day-box");

        const daily = data.list
            .filter(item => item.dt_txt.includes("12:00:00"))
            .slice(0, 3);

        daily.forEach(day => {
            const date = new Date(day.dt_txt);
            const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

            const div = document.createElement("div");
            div.className = "day-box";
            div.innerHTML = `
                <h4>${weekdays[date.getDay()]}</h4>
                <figure>
                    <img src="${icon}" alt="${day.weather[0].description}">
                    <figcaption>${day.weather[0].description}</figcaption>
                </figure>
                <p>Temperature: ${Math.round(day.main.temp)}°C</p>
            `;
            box.appendChild(div);
        });
    }

    fetchForecast();
});

async function getEvents() {
    try {
        const response = await fetch("data/events.json");
        const data = await response.json();
        return data.events || [];
    } catch (error) {
        console.error("Error loading events:", error);
        return [];
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const eventsContainer = document.getElementById("events-list");
    if (!eventsContainer) return;

    const events = await getEvents();
    eventsContainer.innerHTML = "";

    if (events.length === 0) {
        eventsContainer.innerHTML = "<p>No upcoming events at this time.</p>";
        return;
    }

    events
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3)
        .forEach(event => {
            const div = document.createElement("div");
            div.className = "event";
            div.innerHTML = `
                <h3>${event.name}</h3>
                <p>Date: ${new Date(event.date).toDateString()}</p>
            `;
            eventsContainer.appendChild(div);
        });
});
