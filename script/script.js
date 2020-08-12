const booksArray = [
    {
        id: 1,
        name: 'Оно',
        authors: ['Стивен Кинг'],
        publicationDate: 1986,
    },
    {
        id: 2,
        name: 'Гарии Поттер и Филосовский камень',
        authors: ['Джоан Роулинг'],
        publicationDate: 1997,
    },
    {
        id: 3,
        name: 'С/С++ Программирование на языке высокого уровня Учебник',
        authors: ['Павловская Т.А'],
        publicationDate: 2019,
    },
    {
        id: 4,
        name: 'Метро: Осада рая',
        authors: ['Андрей Буторин'],
        publicationDate: 2011,
    },
    {
        id: 5,
        name: 'Тёмная мишень',
        authors: ['Сергей Зайцев', 'Леонид Добкач', 'Андрей Буторин'],
        publicationDate: 2013,
    }
];

class Authors {
    constructor() {
        this.authors = [];
        this._setAuthors();
    }
    _setAuthors() {
        this.authors = this._getAuthors(booksArray);
        console.log(this.authors)
    }
    _getAuthors(booksArray) {
        const authorsArray = [];
        for (const book of booksArray) {
            for (const bookAuthor of book.authors) {
                authorsArray.push(bookAuthor);
            }
        }
        const authors = new Set(authorsArray);
        return [...authors];
    }
}

class Table {
    constructor() {
        this.bookTableContainer = document.querySelector('.book-table');
    }
    init(booksArray) {
        this._renderTable(booksArray);
    }
    _renderTable(booksArray) {
        this.bookTableContainer.innerHTML = '';

        const firstLine = this._createFirstLine();
        this._fillFirstLine(firstLine);
        this.bookTableContainer.appendChild(firstLine);

        this._renderBooks(booksArray);
    }
    _createFirstLine() {
        return document.createElement('tr');
    }
    _fillFirstLine(lineElement) {
        lineElement.innerHTML = this._getFirstLine()
    }
    _getFirstLine() {
        return `<td>Id</td>
                <td>Название</td>
                <td>Авторы</td>
                <td>Дата публикации</td>
                <td>Редактирование книги</td>`
    }
    _renderBooks(booksArray) {
        for (const book of booksArray) {
            const newBook = new Book(book);
            const bookTr = newBook.getBookTr();
            newBook.fillBookTr(bookTr);
            this.bookTableContainer.appendChild(bookTr);
        }
    }
}

class Book {
    constructor(book) {
        this.bookId = book.id;
        this.bookName = book.name;
        this.bookAuthors = book.authors.join(', ');
        this.bookPublicationDate = book.publicationDate;
    }
    getBookTr() {
        const bookTr = document.createElement('tr');
        bookTr.classList.add('book');
        return bookTr;
    }
    fillBookTr(bookLine) {
        bookLine.innerHTML = this._renderBook();
    }
    _renderBook() {
        return `<td data-id="${this.bookId}">${this.bookId}.</td>
                <td class="bookName">"${this.bookName}"</td>
                <td class="bookAuthors">${this.bookAuthors}</td>
                <td class="publicationDate">${this.bookPublicationDate}</td>
                <td>
                    <div class="buttons">
                        <div class="book-btn btn-edit"
                        data-name="${this.bookName}"
                        data-authors="${this.bookAuthors}"
                        data-publicdate="${this.bookPublicationDate}"
                        data-id="${this.bookId}">Редактировать</div>
                        <div class="book-btn btn-delete">Удалить</div>
                    </div>
                </td>`
    }
}

class BookFilter {
    constructor() {
        this.filterButton = document.querySelector('.filter-author__filter');
        this.filterInput = document.querySelector('.filter-author');
        this.formName = document.querySelector('.book-filter-form');
        this.filteredBooks = [];

        this._clickEventHandler();
    }
    _clickEventHandler() {
        this.filterButton.addEventListener('click', event => this._filterClick(event));
        this.formName.addEventListener('submit', event => {
            event.preventDefault();
        })
    }
    _filterClick() {
        const userRequest = this.filterInput.value;
        this._getFilteredBooksArray(userRequest);
        console.log(userRequest);

        table.init(this.filteredBooks)
    }
    _getFilteredBooksArray(value) {
        const regExp = new RegExp(value, 'i');
        this.filteredBooks = booksArray.filter(book => regExp.test(book.authors));
        console.log(this.filteredBooks);
    }
}

class BookEditButtons {
    constructor() {
        this.bookTable = document.querySelector('.book-table');
        this.bookEditor = document.querySelector('.book-edit__container');
        this.addButton = document.querySelector('.add-button');
        this.sbmButton = document.querySelector('.sbm-button');

        this._eventHandlers();
    }
    _eventHandlers() {
        this.bookTable.addEventListener('click', (event) => this._bookButtonEvents(event))
    }
    _bookButtonEvents(event) {
        if (event.target.classList.contains('btn-delete')) {
            this._bookDelete(event);
        } else if (event.target.classList.contains('btn-edit')) {
            this._openBookEditor(event);
        }
    }
    _bookDelete(event) {
        const book = event.target.parentNode.parentNode.parentNode;
        const bookId = book.querySelector('td').dataset.id;

        for (const book of booksArray) {
            if (Number(bookId) === book.id) {
                const bookIndex = booksArray.indexOf(book);
                booksArray.splice(bookIndex, 1);
                console.log(booksArray);

                table.init(booksArray)
            }
        }

        authorsTable.init();
    }
    _openBookEditor(event) {
        this.bookEditor.classList.add('book-edit__container_open');
        this.bookEditor.addEventListener('click', (event) => this._closeBookEditor(event));
        editAuthors.init(event);

        this._setBookInfoToEditor(event);

        document.body.classList.add('body_hidden');
        this.sbmButton.style.display = 'block';
        this.addButton.style.display = 'none';
    }
    _closeBookEditor(event) {
        if (event.target.classList.contains('wrapper')) {
            this.bookEditor.classList.remove('book-edit__container_open');
            document.body.classList.remove('body_hidden');
        }

    }
    _setBookInfoToEditor(event) {
        const inputName = document.querySelector('input[name="editName"]');
        const inputPublicYear = document.querySelector('input[name="editPublicationYear"]');
        const sbmButton = document.querySelector('.sbm-button');
        const bookId = event.target.dataset.id;

        sbmButton.addEventListener('click', () => this._getAndSetUserValues(bookId));

        const bookName = event.target.dataset.name;
        const publicYear = event.target.dataset.publicdate;

        inputName.value = bookName;
        inputPublicYear.value = publicYear;
        sbmButton.textContent = 'Сохранить';
    }
    _getAndSetUserValues(bookId) {
        const inputName = document.querySelector('input[name="editName"]');
        const inputPublicYear = document.querySelector('input[name="editPublicationYear"]');
        const selectAuthors = document.querySelector('.select-author');
        const allAuthors = [...selectAuthors.querySelectorAll('option')];

        const newName = inputName.value;
        const newYear = inputPublicYear.value;
        const newAuthors = [];

        for (const auth of allAuthors) {
            if (auth.selected) {
                newAuthors.push(auth.textContent);
            }
        }

        if (!newName.match(/[a-zA-Zа-яА-Я]/ig) || !newYear.match(/[0-9]{4}/g) || newAuthors.length === 0) {
            alert ('Одно из полей не заполнено!');
            return;
        }

        for (const book of booksArray) {
            if (Number(bookId) === book.id) {
                const bookIndex = booksArray.indexOf(book);
                const neededBook = booksArray[bookIndex];
                neededBook.name = newName;
                neededBook.publicationDate = newYear;
                neededBook.authors = newAuthors;

                table.init(booksArray)
            }
        }

        this.bookEditor.classList.remove('book-edit__container_open');
        document.body.classList.remove('body_hidden');
        console.log(booksArray);
    }
}

class EditAuthors {
    constructor() {
        this.editAuthorsContainer = document.querySelector('.select-author');
        this.authorName = authors.authorName;
        this.formName = document.querySelector('.edit-form');
        this.authorsArray = authors.authors;
    }
    init(){
        this._formPreventDefault();
        this._renderSelectAuthors();
    };
    _formPreventDefault() {
        this.formName
            .addEventListener('submit', event => {
                event.preventDefault();
            });
    }
    _renderSelectAuthors() {
        this.editAuthorsContainer.innerHTML = '';
        for (const author of this.authorsArray) {
            const option = document.createElement('option');
            option.innerHTML = this._createAuthorOption(author);
            option.textContent = author;
            this.editAuthorsContainer.appendChild(option);
        }
    }
    _createAuthorOption(author) {
        return `<option class="author-option" value="${author}">${author}</option>`
    }
}

class AddBook {
    constructor() {
        this.bookEditor = document.querySelector('.book-edit__container');
        this.addBookButton = document.querySelector('.add-book');
        this.formName = document.querySelector('.edit-form');
        this.submitButton = document.querySelector('.add-button');
        this.inputName = document.querySelector('input[name="editName"]');
        this.inputYear = document.querySelector('input[name="editPublicationYear"]');
        this.authors = document.querySelector('.select-author');
        this.addButton = document.querySelector('.add-button');
        this.sbmButton = document.querySelector('.sbm-button');
        this.validate = false;

        this._eventHandlers();
    }
    _eventHandlers() {
        this.addBookButton.addEventListener('click', () => this._openBookEditor());
        this.formName.addEventListener('submit', event => {
            event.preventDefault();
        });
        this.bookEditor.addEventListener('click', event => this._closeBookEditor(event));
    }
    _openBookEditor() {
        this.bookEditor.classList.add('book-edit__container_open');
        editAuthors.init();
        this._resetInputs();

        document.body.classList.add('body_hidden');
        this.addButton.style.display = 'block';
        this.sbmButton.style.display = 'none';
    }
    _resetInputs() {
        this.inputName.value = '';
        this.inputYear.value = '';
        this.submitButton.textContent = 'Добавить';
    }
    _closeBookEditor(event) {
        if (event.target.classList.contains('add-button')) {
            console.log(event);

            this._getUserValues();

            if (this.validate) {
                this._removeOpenClasses();
                authorsTable.init();
            }
        } else if (event.target.classList.contains('wrapper')) {
            this._removeOpenClasses();
        }

    }
    _getUserValues() {
        const newName = this.inputName.value;
        const newYear = this.inputYear.value;
        const allAuthors = this.authors.querySelectorAll('option');
        const newAuthors = [];

        for (const auth of allAuthors) {
            if (auth.selected) {
                newAuthors.push(auth.textContent);
            }
        }

        if (!newName.match(/[a-zA-Zа-яА-Я]/ig) || !newYear.match(/[0-9]{4}/g) || newAuthors.length === 0) {
            alert ('Одно из полей не заполнено!');
            this.validate = false;
            return;
        }

        const id = booksArray.length+1;
        console.log(id);

        booksArray.push({
            id: id,
            name: newName,
            authors: newAuthors,
            publicationDate: newYear

        });
        console.log(booksArray);
        console.log(newName);
        table.init(booksArray);
    }
    _removeOpenClasses() {
        this.bookEditor.classList.remove('book-edit__container_open');
        document.body.classList.remove('body_hidden');
    }
}

class AuthorsTable {
    constructor() {
        this.authorsContainer = document.querySelector('.authors-container');
        this.authorsTable = document.querySelector('.authors__table');
        this.authorsButton = document.querySelector('.authors-button');
        this.adderWindow = this.authorsContainer.querySelector('.redactionAuthor');
        this.adderAuthorForm = this.authorsContainer.querySelector('.authorAdderForm');
        this.parentForEdit = null;
        this.nameForEdit = null;

        this.init();
        this._eventsHandler();
    }
    init() {
        this._resetTable();
        this._renderAuthorTable();
    }
    _resetTable() {
        this.authorsTable.innerHTML = '';
    }
    _renderAuthorTable() {
        this.renderFirstLine();
        this.renderAuthors();
    }
    renderFirstLine() {
        const tr = this.getHtmlFirstLine();
        this.addFirstLine(tr);
    }
    getHtmlFirstLine() {
        return `<tr>
                    <td>id</td>
                    <td>ФИО</td>
                    <td>Количество книг</td>
                    <td>Редактирование автора</td>
                </tr>`
     }
    addFirstLine(tr) {
        this.authorsTable.insertAdjacentHTML("beforeend", tr)
    }
    renderAuthors() {
        for (const author of authors.authors) {
            const authorId = authors.authors.indexOf(author)+1;
            const authorBookAmount = this.getAuthorBookAmount(author);
            const tr = this.getHtmlAuthorTr(author, authorId, authorBookAmount);
            this.authorsTable.insertAdjacentHTML("beforeend", tr);
        }
    }
    getHtmlAuthorTr(author, authorId, authorBookAmount) {
        return `<tr>
                    <td>${authorId}</td>
                    <td class="author-name">${author}</td>
                    <td>${authorBookAmount}</td>
                    <td>
                        <div 
                        data-id="${authorId}" 
                        data-name="${author}" 
                        data-authorBookAmount="${authorBookAmount}" 
                        class="author-buttons">
                            <div class="auth-btn edit-author">Редактировать</div>
                            <div class="auth-btn delete-author">Удалить</div>
                        </div>
                    </td>
                </tr>`
    }
    getAuthorBookAmount(author) {
        let bookNumbers = 0;
        for (const book of booksArray) {
            if (book.authors.includes(author)) {
                bookNumbers++;
            }
        }
        return bookNumbers;
    }
    _eventsHandler() {
        this.authorsButton.addEventListener('click', () => this._openAuthorsWindow());
        this.authorsContainer.addEventListener('click', event => this._authorsWindowHandler(event));
        this.adderWindow.addEventListener('click', event => this._authorAdderHandler(event));
        this.adderAuthorForm.addEventListener('click', event => {
            event.preventDefault();
        });
    }
    _openAuthorsWindow() {
        this.authorsContainer.classList.add('authors-container_open');
    }
    _authorsWindowHandler(event) {
        if (event.target.classList.contains('wrapper')) {
            this._closeAuthorsWindow();
        } else if (event.target.classList.contains('delete-author')) {
            this._deleteAuthor(event);
        } else if (event.target.classList.contains('add-author')) {
            this._openAdderWindow();
        } else if (event.target.classList.contains('edit-author')) {
            this.parentForEdit = this._getAuthorParent(event);
            this.nameForEdit = this._getAuthorName(this.parentForEdit);
            this._setAuthorNameToInput(this.nameForEdit);
            this._openEditWindow();
            console.log(this.nameForEdit);
        } else if (event.target.classList.contains('editAuthor-save')) {
            const newName = this._getAuthorNewName();

            if(authors.authors.indexOf(newName) === -1) {
                alert('Можно выбрать только уже созданного автора');
                return;
            }
            if(authors.authors.indexOf(newName)) {
                alert('Такой автор уже есть');
                return;
            }

            const allAuthorRows = this.authorsTable.querySelectorAll('tr');
            for (const row of allAuthorRows) {
                const tdAll = row.querySelectorAll('td');

                for (const td of tdAll) {
                    if (td.textContent ===  this.nameForEdit) {
                        td.innerHTML = newName;
                    }
                }
            }
        }
    }
    _closeAuthorsWindow() {
        this.authorsContainer.classList.remove('authors-container_open');
        this.adderWindow.classList.remove('redactionAuthor_open');
    }
    _deleteAuthor(event) {
        // const allRows = [...this.authorsTable.querySelectorAll('tr')];
        // const parent = event.target.parentNode;
        // const rowId = parent.dataset.id;
        // let rowToDelete = allRows[rowId];
        // rowToDelete.remove();
        // console.log(parent);
        // console.log(rowId);
        // console.log(allRows);
        // console.log(rowToDelete)

        const parent = this._getAuthorParent(event);
        const authorName = this._getAuthorName(parent);
        const authorIndex = this._getAuthorIndex(authorName);
        authors.authors.splice(authorIndex, 1);
        this.init();
    }
    _getAuthorParent(event) {
        return event.target.parentNode;
    }
    _getAuthorName(parent) {
        return parent.dataset.name;
    }
    _getAuthorIndex(author) {
        return authors.authors.indexOf(author);
    }
    _openAdderWindow() {
        const inputName = document.querySelector('input[name="authorName"]');
        inputName.value = '';
        this.adderWindow.classList.add('redactionAuthor_open');
        this.authorsContainer.querySelector('.editAuthor-add').style.display = 'inline-block';
        this.authorsContainer.querySelector('.editAuthor-save').style.display = 'none';
    }
    _authorAdderHandler(event) {
        if (event.target.classList.contains('editAuthor-cancel')) {
            this._closeAdderWindow();
        } else if (event.target.classList.contains('editAuthor-add')) {
            const authorNewName = this._getAuthorNewName();
            const authorId = authors.authors.length+1;
            // const regExp = /[a-zA-Zа-яА-Я]+/ig

            if (!authors.authors.includes(authorNewName)) {
                if (!authorNewName.match(/[a-zA-Zа-яА-Я]+/ig)) {
                    alert('Имя должно быть больше одного символа')
                } else {
                    const authorBookAmount = this.getAuthorBookAmount(authorNewName);
                    const tr = this.getHtmlAuthorTr(authorNewName, authorId, authorBookAmount);
                    this.authorsTable.insertAdjacentHTML("beforeend", tr);
                    authors.authors.push(authorNewName);
                }
            } else {
                alert('Именя авторов не должны совпадать')
            }



            // console.log(authorNewName);
            console.log(authorId);
            // console.log(authorBookAmount)
        }
        //     //todo найти автора в массиве, поменять там имя, перерендерить список. сделать проверку полей
        // }
    //todo доделать закрытие сраного окна аддера. сделать redactionAuthor на весь экран и добавить к нему лисенер
    }
    _closeAdderWindow() {
        this.adderWindow.classList.remove('redactionAuthor_open');
    }
    _getAuthorNewName() {
        const inputName = document.querySelector('input[name="authorName"]');
        return inputName.value;
    }
    _setAuthorNameToInput(name) {
        const inputName = document.querySelector('input[name="authorName"]');
        inputName.value = name;
    }
    _openEditWindow() {
        this.adderWindow.classList.add('redactionAuthor_open');
        this.authorsContainer.querySelector('.editAuthor-add').style.display = 'none';
        this.authorsContainer.querySelector('.editAuthor-save').style.display = 'inline-block';
    }
}

const authors = new Authors();
const table = new Table();
table.init(booksArray);
const bookFilter = new BookFilter(booksArray);
const bookEditButtons = new BookEditButtons(booksArray);
const editAuthors = new EditAuthors();
const addBook = new AddBook();
const authorsTable = new AuthorsTable();
