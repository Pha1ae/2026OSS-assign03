const STORAGE_KEY = 'bookshelf-coursework-v1';
const categories = ['Fiction', 'Technology', 'Science', 'History', 'Art', 'Other'];
const fieldLabels = {
    title: 'Book title', author: 'Author', publisher: 'Publisher',
    year: 'Publication year', isbn: 'ISBN', category: 'Category'
};
const sampleBooks = [
    { id: 'book-1', title: 'The Quiet Garden', author: 'Avery Morgan', publisher: 'Willow Press', year: 2024, isbn: '9780000000019', category: 'Fiction' },
    { id: 'book-2', title: 'A World of Small Discoveries', author: 'Jamie Park', publisher: 'Northstar Books', year: 2023, isbn: '9780000000026', category: 'Science' },
    { id: 'book-3', title: 'Designing for Everyday Life', author: 'Robin Ellis', publisher: 'Studio Editions', year: 2025, isbn: '9780000000033', category: 'Art' }
];

function showError(message) {
    const box = document.getElementById('page-error');
    box.textContent = message;
    box.hidden = false;
}

function loadBooks() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) return structuredClone(sampleBooks);
    const books = JSON.parse(saved);
    if (!Array.isArray(books) || !books.every(book => book && typeof book.id === 'string'
        && Object.keys(fieldLabels).every(key => ['string', 'number'].includes(typeof book[key])))) {
        throw new Error('Invalid saved data');
    }
    return books;
}

function saveBooks(books) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
        return true;
    } catch {
        showError('Your changes could not be saved. Please allow browser storage and try again.');
        return false;
    }
}

function element(tag, text, className = '') {
    const node = document.createElement(tag);
    node.textContent = text;
    node.className = className;
    return node;
}

function renderList(books) {
    document.getElementById('book-count').textContent = `${books.length} books in your collection`;
    document.getElementById('empty-state').hidden = books.length !== 0;
    const tbody = document.getElementById('book-list');
    for (const book of books) {
        const row = document.createElement('tr');
        const titleCell = document.createElement('th');
        titleCell.scope = 'row';
        const titleLink = element('a', book.title);
        titleLink.href = `./view.html?id=${encodeURIComponent(book.id)}`;
        titleCell.append(titleLink);
        row.append(titleCell);
        for (const key of ['author', 'publisher', 'year']) row.append(element('td', book[key]));
        const categoryCell = document.createElement('td');
        categoryCell.append(element('span', book.category, 'badge category-badge'));
        row.append(categoryCell);
        const actionCell = element('td', '', 'text-end');
        const viewLink = element('a', 'View');
        viewLink.href = titleLink.href;
        viewLink.setAttribute('aria-label', `View ${book.title}`);
        actionCell.append(viewLink);
        row.append(actionCell);
        tbody.append(row);
    }
}

function renderDetails(book, books) {
    document.getElementById('detail-panel').hidden = false;
    document.getElementById('detail-title').textContent = book.title;
    document.getElementById('detail-author').textContent = `By ${book.author}`;
    document.getElementById('detail-category').textContent = book.category;
    const details = document.getElementById('book-details');
    for (const [key, label] of Object.entries(fieldLabels)) {
        details.append(element('dt', label, 'col-12 col-sm-4'));
        details.append(element('dd', book[key], 'col-12 col-sm-8'));
    }
    document.getElementById('edit-link').href = `./edit.html?id=${encodeURIComponent(book.id)}`;
    document.getElementById('delete-button').addEventListener('click', () => {
        if (!confirm(`Delete "${book.title}" from your library?`)) return;
        let latestBooks;
        try {
            latestBooks = loadBooks();
        } catch {
            showError('Unable to read the latest data. Please reload the page.');
            return;
        }
        const remainingBooks = latestBooks.filter(item => item.id !== book.id);
        if (saveBooks(remainingBooks)) {
            location.href = './index.html';
        }
    });
}

function validateBook(data) {
    const errors = {};
    for (const [key, label] of Object.entries(fieldLabels)) {
        if (!data[key]) errors[key] = `${label} is required.`;
    }
    for (const [key, max] of [['title', 100], ['author', 60], ['publisher', 80]]) {
        if (data[key] && (data[key].length < 2 || data[key].length > max)) {
            errors[key] = `Use between 2 and ${max} characters.`;
        }
    }
    const maxYear = new Date().getFullYear() + 1;
    const year = Number(data.year);
    if (data.year && (!Number.isInteger(year) || year < 1450 || year > maxYear)) {
        errors.year = `Enter a whole year between 1450 and ${maxYear}.`;
    }
    const isbn = data.isbn.replace(/[\s-]/g, '').toUpperCase();
    if (data.isbn && !/^(\d{9}[\dX]|\d{13})$/.test(isbn)) {
        errors.isbn = 'Enter an ISBN-10 or ISBN-13. Only the final ISBN-10 character may be X.';
    }
    if (data.category && !categories.includes(data.category)) errors.category = 'Choose a valid category.';
    return errors;
}

function setupForm(mode, book, books) {
    const form = document.getElementById('book-form');
    function recheckField(event) {
        const input = event.target;
        const key = input.name;
        if (!Object.hasOwn(fieldLabels, key)) return;
        if (!input.classList.contains('is-invalid')) return;
        const data = {};
        for (const field of Object.keys(fieldLabels)) {
            data[field] = form.elements[field].value.trim();
        }
        const errors = validateBook(data);
        input.classList.toggle('is-invalid', Boolean(errors[key]));
        input.setAttribute('aria-invalid', errors[key] ? 'true' : 'false');
        document.getElementById(`${key}-error`).textContent =
            errors[key] || '';
        if (!form.querySelector('.is-invalid')) {
            document.getElementById('validation-summary').hidden = true;
        }
    }
    
    form.addEventListener('input', recheckField);
    form.addEventListener('change', recheckField);
    form.elements.year.max = new Date().getFullYear() + 1;
    if (mode === 'edit') {
        for (const key of Object.keys(fieldLabels)) form.elements[key].value = book[key];
        document.getElementById('cancel-link').href = `./view.html?id=${encodeURIComponent(book.id)}`;
    }
    form.addEventListener('submit', event => {
        event.preventDefault();
        const data = {};
        for (const key of Object.keys(fieldLabels)) data[key] = form.elements[key].value.trim();
        const errors = validateBook(data);
        for (const key of Object.keys(fieldLabels)) {
            const input = form.elements[key];
            input.classList.toggle('is-invalid', Boolean(errors[key]));
            input.setAttribute('aria-invalid', errors[key] ? 'true' : 'false');
            document.getElementById(`${key}-error`).textContent = errors[key] || '';
        }
        const summary = document.getElementById('validation-summary');
        summary.hidden = Object.keys(errors).length === 0;
        if (!summary.hidden) {
            summary.textContent = 'Please correct the highlighted fields before saving.';
            form.elements[Object.keys(errors)[0]].focus();
            return;
        }
        if (mode === 'edit' && !confirm('Save changes to this book?')) return;
        if (mode === 'add') alert('This book will be added to your library.');
        const record = {
            ...data,
            year: Number(data.year),
            isbn: data.isbn.replace(/[\s-]/g, '').toUpperCase(),
            id: mode === 'edit' ? book.id : crypto.randomUUID()
        };
        let latestBooks;
        try {
            latestBooks = loadBooks();
        } catch {
            showError('Unable to read the latest data. Please reload the page.');
            return;
        }
        if (
            mode === 'edit' &&
            !latestBooks.some(item => item.id === book.id)
        ) {
            showError('This book has already been deleted.');
            return;
        }
        const updated = mode === 'edit'
            ? latestBooks.map(item => item.id === book.id ? record : item)
            : [...latestBooks, record];
        if (saveBooks(updated)) location.href = `./view.html?id=${encodeURIComponent(record.id)}`;
    });
}

function init() {
    const page = document.body.dataset.page;
    let books;
    try { books = loadBooks(); }
    catch {
        showError('Saved books could not be read. Please check browser storage permissions or use a fresh browser profile.');
        const form = document.getElementById('form-panel');
        if (form) form.hidden = true;
        return;
    }
    if (page === 'index') return renderList(books);
    if (page === 'add') return setupForm('add', null, books);
    const id = new URLSearchParams(location.search).get('id');
    const book = id === null ? books[0] : books.find(item => item.id === id);
    if (!book) {
        showError('Book not found. Return to Library to select another book.');
        const form = document.getElementById('form-panel');
        if (form) form.hidden = true;
        return;
    }
    if (page === 'view') renderDetails(book, books);
    if (page === 'edit') setupForm('edit', book, books);
}

init();