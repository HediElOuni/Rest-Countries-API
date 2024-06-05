const darkModeToggle = document.getElementById('dark-mode-toggle');
const home = document.getElementById('home');
const searchInput = document.getElementById('search');
const regionFilter = document.getElementById('region-filter');
const detail = document.getElementById('detail');
const countryContainer = document.getElementById('country-container');
const countryDetail = document.getElementById('country-detail');
const backButton = document.getElementById('back-button');
let countries = [];

async function fetchCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        countries = await response.json();
        displayCountries(countries);
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
}

function displayCountries(countries) {
    const shuffledCountries = shuffleArray(countries);
    const randomCountries = shuffledCountries.slice(0, 8);
    countryContainer.innerHTML = '';
    randomCountries.forEach(country => {
        const countryCard = document.createElement('div');
        countryCard.innerHTML = `
            <img src="${country.flags.svg}" alt="Flag of ${country.name}">
            <div>
                <h3>${country.name.common}</h3>
                <p><span>Population:</span> ${country.population.toLocaleString()}</p>
                <p><span>Region:</span> ${country.region}</p>
                <p><span>Capital:</span> ${country.capital}</p>
            </div>
        `;
        countryCard.classList.add('country-card');
        countryContainer.appendChild(countryCard);
        countryCard.addEventListener('click', () => detailView(country));
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.toLowerCase();
    const regionValue = regionFilter.value;
    const filteredCountries = regionValue === '' ? countries.filter(country =>
        country.name.common.toLowerCase().includes(searchValue)
    ) : countries.filter(country =>
        country.region === regionValue && country.name.common.toLowerCase().includes(searchValue)
    );
    displayCountries(filteredCountries);
});

regionFilter.addEventListener('change', () => {
    const regionValue = regionFilter.value;
    const filteredCountries = regionValue === '' ? countries : countries.filter(country =>
        country.region === regionValue
    );
    displayCountries(filteredCountries);
});

function detailView(country) {
    home.style.display = 'none';
    detail.style.display = 'block';
    countryDetail.innerHTML = `
        <img src="${country.flags.svg}" alt="Flag of ${country.name}">
        <div class="detail-info-container">
            <h2>${country.name.common}</h2>
            <div class="detail-info">
                <div>
                    <p><span>Native Name:</span> ${country.name.official}</p>
                    <p><span>Population:</span> ${country.population.toLocaleString()}</p>
                    <p><span>Region:</span> ${country.region}</p>
                    <p><span>Sub Region:</span> ${country.subregion}</p>
                    <p><span>Capital:</span> ${country.capital}</p>
                </div>
                <div>
                    <p><span>Top Level Domain:</span> ${country.tld.join(', ')}</p>
                    <p><span>Currencies:</span> ${Object.values(country.currencies).map(currency => currency.name).join(', ')}</p>
                    <p><span>Languages:</span> ${Object.values(country.languages).join(', ')}</p>
                </div>
            </div>
            <div>
                <p><span class="border-label">Border Countries: </span> ${country.borders ? country.borders.map(border => `<span class="border-country">${border}</span>`).join('') : 'None'}</p>
            </div>
        </div>
    `;
}
backButton.addEventListener('click', () => {
    detail.style.display = 'none';
    home.style.display = 'block';
});

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode') ? 'true' : 'false');
});

window.addEventListener('DOMContentLoaded', () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', darkMode);

    searchInput.value = '';
    regionFilter.value = '';
});

fetchCountries();