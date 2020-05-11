/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загрузки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */
function loadTowns() {
    return (async () => {
        let response = await fetch('https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json');
        let towns = await response.json();

        return towns.sort((a, b) => a.name > b.name ? 1 : -1);
  })()
}

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
    let regexp = new RegExp(chunk, 'i');
    return regexp.test(full);
}

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');

let towns = [];

function loadData() {
    return (async () => {
        loadingBlock.innerText = 'Загрузка...';
        towns = await loadTowns();
        loadingBlock.style.color = 'transparent';
        filterBlock.style.display = 'block';
    })()
}

document.addEventListener('DOMContentLoaded', async (event) => {
    try {
        await loadData();
    } catch {
        loadingBlock.innerText = 'Не удалось загрузить города';
        
        let button = document.createElement('button');
        
        button.id = 'reload';
        button.innerText = 'Повторить';
        homeworkContainer.appendChild(button);

        button.addEventListener('click', async (event) => {
            try {
                await loadData();
                homeworkContainer.querySelector('#reload').remove();
            } catch(error) {
                loadingBlock.innerText = 'Не удалось загрузить города';
            }
        })
    }
});

filterInput.addEventListener('keyup', (event) => {
    // это обработчик нажатия кливиш в текстовом поле
    let chunk = event.target.value;
    
    filterResult.innerHTML = '';
    
    if (chunk) {
        let fragment = document.createDocumentFragment();
        
        for (let town of towns) {
            if (isMatching(town.name, chunk)) {
                let div = document.createElement('div');
                
                div.innerText = town.name;
                fragment.appendChild(div);
            }
        }
        filterResult.appendChild(fragment);
    } else {
        filterResult.innerHTML = '';
    }
});

export {
    loadTowns,
    isMatching
};