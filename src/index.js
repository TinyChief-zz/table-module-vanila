import data from './MOCK_DATA.json';

const columnNames = [
  'Name',
  'Position',
  'Office',
  'Age',
  'Start date',
  'Salary',
];

// let tableItems = [];

class Table {
  currentPag = 0;
  tableItems = [];
  init = () => {
    const tableW = document.querySelector('.table');
    tableW.style.gridTemplateColumns = `repeat(${columnNames.length}, auto)`;
    tableW.style.gridTemplateRows = `50px repeat(10, aut)`;
    // COLUMN HEADER
    columnNames.forEach(el => {
      tableW.innerHTML += `<div class="column-title" key=${el} sort=1>${el}</div>`;
    });
    // TABLE ITEMS
    for (let i = 0; i < columnNames.length * 10; i++) {
      tableW.innerHTML += `<div class="table-item"></div>`;
    }
    this.tableItems = [...document.querySelectorAll('.table-item')];
    // PAGINATION
    const pagination = document.querySelector('.pagination');
    if (pagination) {
      pagination.innerHTML += `<li class="" key='prev'><span>Previous</span></li>`;
      for (let i = 0; i < data.length / 10; i++) {
        pagination.innerHTML += `<li class="pagination-item" key=${i +
          1}><span>${i + 1}</span></li>`;
      }
      pagination.innerHTML += `<li class="" key='next'><span>Next</span></li>`;
      const pagElems = [...document.querySelectorAll('.pagination li')];
      // В соответсвии с атрибутом каждого элемента пагинации назначаем обработчик клика
      pagElems.forEach(el => {
        el.addEventListener('click', () => {
          if (el.getAttribute('key') === 'prev') {
            this.paginate(this.currentPag - 1);
          } else if (el.getAttribute('key') === 'next') {
            this.paginate(this.currentPag + 1);
          } else {
            this.paginate(+el.getAttribute('key'));
          }
        });
      });
    }
    this.render(0);
    // Продолжение логики для шапки таблицы,
    // так как не работает, если вставить сразу после инизиализации
    const tableHeader = [...document.getElementsByClassName('column-title')];
    if (tableHeader) {
      tableHeader.forEach(el => {
        el.addEventListener('click', () => {
          let sortFlag = el.getAttribute('sort') == 1 ? 0 : 1;
          el.setAttribute('sort', sortFlag);
          this.sortData(el.getAttribute('key').toLowerCase(), sortFlag);
        });
      });
    }
  };
  // Рендерит нужную информацию в ячейки таблицы. Таблица заполняется по змейке.
  render = startIndex => {
    data.slice(startIndex, startIndex + 10).forEach((person, i) => {
      Object.keys(person).forEach((el, j) => {
        this.tableItems[i * columnNames.length + j].innerHTML = person[el];
      });
    });
  };
  paginate = newPag => {
    this.currentPag = newPag;
    this.render(newPag * columnNames.length);
  };
  sortData = (type, sortFlag) => {
    sortFlag == 1
      ? data.sort((personA, personB) => personA[type] > personB[type])
      : data.sort((personA, personB) => personA[type] < personB[type]);
    this.currentPag = 0;
    this.render(0);
  };
}

const myTable = new Table();

myTable.init();

window.myTable = myTable;
