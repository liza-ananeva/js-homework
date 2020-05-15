/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответсвует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

function addTableRow(name, value) {
    const tdName = document.createElement('td');
    const tdValue = document.createElement('td');
    
    tdName.innerText = name;
    tdValue.innerText = value;

    const button = document.createElement('button');
    const tdDelete = document.createElement('td');
    
    button.className += 'delete-button';
    button.innerText = 'Удалить';
    tdDelete.appendChild(button);

    let fragment = document.createDocumentFragment();

    fragment.appendChild(tdName);
    fragment.appendChild(tdValue);
    fragment.appendChild(tdDelete);
    
    const tr = document.createElement('tr');

    tr.id = name;
    tr.appendChild(fragment);
    listTable.appendChild(tr);
}

function deleteTableRow(row) {
    row.parentNode.removeChild(row);
}

function parseCookies() {
    return document.cookie.split('; ').reduce((prev, current) => {
        let [name, value] = current.split('=');
        
        if (name != '') {
            prev[name] = value;
        }

        return prev;
    }, {})
}

function isMatching(full, chunk) {
    let regexp = new RegExp(chunk, 'i');
    
    return regexp.test(full);
}

let cookies = {};

window.addEventListener('DOMContentLoaded', () => {
    listTable.innerHTML = '';

    cookies = parseCookies();

    for (let name in cookies) {
        if (cookies.hasOwnProperty(name)) {
            addTableRow(name, cookies[name]);
        }
    }
});

listTable.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-button')) {
        let row = event.target.closest('tr');
        let name = row.id;
        
        if (row) {
            deleteTableRow(row);
        }
        document.cookie = `${name}=''; max-age=0`;
    }
});

filterNameInput.addEventListener('keyup', function() {
    // здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie
    let filter = filterNameInput.value;
    
    listTable.innerHTML = '';
    cookies = parseCookies();

    for (let name in cookies) {
        if (isMatching(name, filter) || isMatching(cookies[name], filter)) {
            if (cookies.hasOwnProperty(name)) {
                addTableRow(name, cookies[name]);
            }
        }
    }
});

addButton.addEventListener('click', () => {
    // здесь можно обработать нажатие на кнопку "добавить cookie"
    let name = addNameInput.value;
    let value = addValueInput.value;

    cookies = parseCookies();

    let filter = filterNameInput.value;

    if (cookies.hasOwnProperty(name) && !isMatching(filter, value)) {
        // let row = document.querySelector(`#${name}`);
        let row = document.getElementById(name);
        
        if (row) {
            deleteTableRow(row);
        }
    }
        
    if (isMatching(name, filter) || isMatching(value, filter)) {
        addTableRow(name, value);
    }
    
    if (name) {
        document.cookie = `${name}=${value}`;
    }
});