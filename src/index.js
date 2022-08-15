import './css/styles.css';
import debounce from 'debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {fetchCountries} from '../src/js/fetchCountries'


const DEBOUNCE_DELAY = 300;
const findInput = document.querySelector('#search-box');
const findList = document.querySelector('.country-list');
const findInfo = document.querySelector('.country-info');

findInput.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));

function inputHandler(event) {
    const input = event.target.value.trim();
    let promise = fetchCountries(input);
    promise.then((countries) => {
        clearDiv()
        if(countries.length === 1) {
            let html = createCountryInfo(countries) 
            findInfo.innerHTML = html
        } else if(countries.length <= 10) {
            let list = createCountryList(countries)
            findList.innerHTML = list
        } else if (countries.length > 10) {
            Notify.info('Too many matches found. Please enter a more specific name.')
        }
    }, (error) => {
        clearDiv()
        
        Notify.failure('Oops, there is no country with that name')
        
    });
    return input;
}

function clearDiv() {
    findInfo.innerHTML = " ";
    findList.innerHTML = " ";
}

const createCountryInfo = data => {
    return data.map(({name,capital,population,flags,languages}) => 
    `<h1><img src="${flags.png}" alt="${name.official}" width="40"> ${name.official}</h1>
    <p>capital: ${capital}</p>
    <p>population: ${population}</p>
    <p>languages: ${Object.values(languages).join(', ')}</p>`)
};


const createCountryList = data => {
    return data.map(({name, flags}) => 
    `<li><img src="${flags.png}" alt="${name.official}" width="20"> ${name.official}</li>`
    ).join('')
}
findList.style.cssText = `list-style: none;`;