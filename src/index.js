import users from './MOCK_DATA.json';

const columns = ['Name', 'Position', 'Office', 'Age', 'Start date', 'Salary'];

class Table {
  currentPag = 0;
  tableItems = [];
  columnArrowActive = null;
  columnActive = null;
  filteredData = null;
  actualData = null;
  columnNames = null;
  pageLength = 10;
  init = (data, columns, onPage) => {
    // Если не даны имена колонок, то делаем именами ключю первого элемента data
    columns
      ? (this.columnNames = columns)
      : (this.columnNames = Object.keys(data[0]));
    // Устанавлием сколько строк на одной странице, по умолчанию 10
    onPage ? (this.pageLength = onPage) : '';
    // Хранит информацию в неизменном виде
    this.actualData = data;
    // Для реализации фильтрации, сортировки и т.д.
    this.filteredData = data;
    if (
      document.querySelector('#search-button') &&
      document.querySelector('#search-input')
    ) {
      document.querySelector('#search-button').addEventListener('click', e => {
        e.preventDefault();
        this.searchData();
      });
    }
    // Инициализируем таблицу
    const tableW = document.querySelector('.table');
    tableW.style.gridTemplateColumns = `repeat(${
      this.columnNames.length
    }, auto)`;
    tableW.style.gridTemplateRows = `50px repeat(${this.pageLength}, aut)`;
    // COLUMN HEADER
    this.columnNames.forEach((el, i) => {
      tableW.innerHTML += `
      <div class="column-title" column=${i + 1} key=${el} sort=1>
        ${el} 
        <div class="arrows">
          <span>&#9650;</span>
          <span>&#9660;</span>
        </div>
      </div>`;
    });
    // TABLE ITEMS
    for (let i = 0; i < this.columnNames.length * this.pageLength; i++) {
      const columnNum = (i % this.columnNames.length) + 1;
      if (Math.floor(i / this.columnNames.length) % 2 == 0) {
        tableW.innerHTML += `<div column=${columnNum} class="table-item odd-row"></div>`;
      } else {
        tableW.innerHTML += `<div column=${columnNum} class="table-item even-row"></div>`;
      }
    }
    this.tableItems = [...document.querySelectorAll('.table-item')];
    // PAGINATION
    const pagination = document.querySelector('.pagination');
    if (pagination) {
      pagination.innerHTML += `<li class="" key='prev'><span>Previous</span></li>`;
      for (let i = 0; i < data.length / this.pageLength; i++) {
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
        // К каждому заглавию столбца добавляем обработчик клика по нему
        el.addEventListener('click', () => {
          let sortFlag = el.getAttribute('sort') == 1 ? 0 : 1;
          el.setAttribute('sort', sortFlag);
          // Убираем подсветку стрелки у предыдущей, и добавляем подсветку на ту, на которую нажали
          if (this.columnArrowActive) {
            this.columnArrowActive.classList.remove('active');
          } else {
            this.columnArrowActive =
              el.children[0].children[sortFlag == 1 ? 0 : 1];
            this.columnActive = el.getAttribute('column');
          }
          this.columnArrowActive =
            el.children[0].children[sortFlag == 1 ? 0 : 1];
          el.children[0].children[sortFlag == 1 ? 0 : 1].classList.add(
            'active',
          );
          // Убираем подсветку и добавляем подсветку отсортированного столбца
          this.tableItems.forEach(item => {
            if (
              item.getAttribute('column') === this.columnActive &&
              item.getAttribute('column') !== el.getAttribute('column')
            ) {
              item.classList.remove('sorted');
            } else if (
              item.getAttribute('column') === el.getAttribute('column')
            ) {
              item.classList.add('sorted');
            }
          });
          this.columnActive = el.getAttribute('column');
          this.sortData(el.getAttribute('key').toLowerCase(), sortFlag);
        });
      });
    }
  };
  // Рендерит нужную информацию в ячейки таблицы. Таблица заполняется по змейке.
  render = startIndex => {
    if (this.filteredData.length < this.pageLength) {
      this.clearTable();
    }
    this.filteredData
      .slice(startIndex, startIndex + this.pageLength)
      .forEach((person, i) => {
        Object.keys(person).forEach((el, j) => {
          this.tableItems[i * this.columnNames.length + j].innerHTML =
            person[el];
        });
      });
  };
  paginate = newPag => {
    this.currentPag = newPag;
    this.render(newPag * this.columnNames.length);
  };
  sortData = (type, sortFlag) => {
    sortFlag == 1
      ? this.filteredData.sort(
          (personA, personB) => personA[type] > personB[type],
        )
      : this.filteredData.sort(
          (personA, personB) => personA[type] < personB[type],
        );
    this.currentPag = 0;
    this.render(0);
  };
  searchData = () => {
    const searchString = document.querySelector('#search-input').value;
    this.filteredData = this.actualData.filter(el => {
      return el.name.includes(searchString);
    });
    this.render(0);
  };
  clearTable = () => {
    for (let i = 0; i < this.columnNames.length * this.pageLength; i++) {
      this.tableItems[i].innerHTML = '';
    }
  };
}

const myTable = new Table();

myTable.init(users, columns, 20);

window.myTable = myTable;
