# Bookshelf — Book Management Service

## 1. Service Topic

Bookshelf is a CRUD front-end service for managing a personal book collection. Users can browse books, add new records, view book details, edit existing information, and delete records.

The project uses HTML, CSS, Bootstrap, and JavaScript. Book records are stored in the browser's `localStorage`, so changes remain after refreshing the page. The data is specific to the current browser and website origin; it is not stored in a shared server database.

## 2. Data Fields

Each book contains the following six data fields:

| Field | Description | Example |
| --- | --- | --- |
| Book title | The title of the book | The Quiet Garden |
| Author | The name of the author | Avery Morgan |
| Publisher | The company that published the book | Willow Press |
| Publication year | The year the book was published | 2024 |
| ISBN | The book's ISBN-10 or ISBN-13 identifier | 9780000000019 |
| Category | The type of book | Fiction |

The initial records are fictional examples for this assignment. Each record also has an internal `id`, which identifies the selected book when navigating between pages. This ID is separate from the six editable fields.

## 3. List Page

The main page, `index.html`, displays book records in a table with five data fields:

- Book title
- Author
- Publisher
- Publication year
- Category

An **Add book** button opens `add.html`. Clicking a book title or its **View** link opens `view.html` with the selected record's ID in the URL.

The detail page displays all six fields. Its **Edit book** link opens `edit.html`, and its **Delete book** button displays a confirmation dialog before deleting the record. All four pages provide a **Library** link that returns to the list page.

## 4. Validation

Both `add.html` and `edit.html` use the shared JavaScript `validateBook()` function in `app.js`.

| Validation condition | Add page (`add.html`) | Edit page (`edit.html`) |
| --- | --- | --- |
| Required fields | All six fields must be completed. Input containing only spaces is rejected. | All six fields must remain completed after editing. |
| Text length | The title must contain 2–100 characters, the author 2–60, and the publisher 2–80. | The same length limits apply to the updated values. |
| Publication year | The year must be an integer between 1450 and the current year plus one. | The updated year must be within the same range. |
| ISBN format | After removing spaces and hyphens, the ISBN must contain 13 digits, or 10 characters with an optional X as the final character. | The updated ISBN must follow the same format. |
| Category selection | A category must be selected from the predefined options. | The selected category must remain one of the predefined options. |

ISBN validation checks the format only; it does not verify the checksum or whether the ISBN belongs to a real book.

Invalid fields receive an error message and a highlighted border. The form focuses on the first invalid field. After a validation error, correcting the affected field updates its error message without requiring another submission. All fields are checked again when the form is submitted.

On the add page, valid input triggers an `alert()` before the record is saved. On the edit page, the existing values are prefilled, and a `confirm()` dialog asks the user to confirm the changes before saving.

## 5. RWD — Responsive Web Design

The pages adapt to desktop and mobile screens using Bootstrap's responsive layout classes and custom CSS.

- **Page layout:** The Bootstrap `container` class provides responsive spacing, while the custom `.page-width` class limits the maximum content width.
- **Forms:** Each field uses `col-12 col-md-6`. Fields appear in one column on mobile screens and two columns on screens at least 768 pixels wide.
- **Tables:** The table is wrapped in `.table-responsive`, allowing horizontal scrolling within the table area on smaller screens.
- **Navigation and buttons:** Flexbox and `flex-wrap` allow navigation links and action buttons to wrap when there is not enough horizontal space.
- **Typography and spacing:** CSS `clamp()` adjusts the main heading size, and a media query reduces table cell padding on small screens.

These adjustments keep the forms usable and allow users to access the table, navigation, and buttons on different screen sizes.

## 6. Bootstrap

Bootstrap 5.3.8 is used for the basic layout and reusable interface components.

| Component or class | Usage |
| --- | --- |
| `container` | Responsive page layout |
| `row`, `col-12`, `col-md-6` | Responsive form grid |
| `navbar`, `nav-link` | Shared navigation |
| `table`, `table-hover`, `table-responsive` | Book list and scrollable table |
| `form-label`, `form-control`, `form-select` | Form labels, inputs, and category selection |
| `btn`, `btn-primary`, `btn-outline-danger` | Add, edit, delete, and navigation controls |
| `card`, `card-header`, `card-body`, `card-footer` | List, form, and detail containers |
| `alert`, `is-invalid`, `invalid-feedback` | Error messages and validation feedback |
| `badge` | Category labels |
| Spacing and flex utilities | Padding, margins, alignment, and wrapping |

All four CRUD pages load the shared `my.css` file after Bootstrap's stylesheet. It customizes the colors, layout, navigation, forms, buttons, tables, cards, headers, and footers.

The separate `example.html` page is a landscape gallery based on Bootstrap examples. It uses its own `style.css` stylesheet.

## 7. Problem & Solution

**Problem:** HTML and CSS allowed me to create the page structure and appearance, but implementing data storage, updates, and deletion required JavaScript. I needed to understand how user actions could change the data and how those changes could remain after refreshing the page.

**Solution:** I used Google searches and worked with AI to understand and implement the JavaScript logic. This helped me connect form inputs to book records, handle button clicks, and use `localStorage` to save data. I also used the same validation function for both adding and editing records.

## 8. Reflection

This project helped me explore how to use my own CSS stylesheet together with Bootstrap. Bootstrap provides useful layout classes and components, while my own stylesheet allows me to customize their appearance.

I learned to load Bootstrap first and place `my.css` after it. However, stylesheet order is not the only factor that determines which style is applied: selector specificity and `!important` can also affect the result. I want to become more confident in using browser developer tools to identify the applied styles and understand why a custom rule does or does not override a Bootstrap rule.
