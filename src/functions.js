/**
 * wrapTableColumnsWithBrackets - A function to wrap table columns with curly braces
 *
 * @param {string} sql - The SQL string
 * @param {array} tableColumn - The array of table columns
 * @returns {string} The SQL string with table columns wrapped with curly braces
 */
export function wrapTableColumnsWithBrackets(sql, tableColumn) {
    tableColumn.forEach(function (column) {
        let regex = new RegExp(
            '(\\[(' + column + ')\\])|\\b(' + column + ')\\b(?![^\\{\\}]*\\})',
            'gmi'
        );
        sql = sql.replace(regex, '{$2$3}');
    });

    return sql;
}

/**
 * Removes "dbo." prefix from table columns in SQL query.
 * @param {string} sql - SQL query string.
 * @param {string[]} tableColumn - Array of table column names.
 * @returns {string} SQL query string with "dbo." prefix removed.
 */
export function removeDboPrefixForTableColumns(sql, tableColumn) {
    let regex = new RegExp(
        '(\\[dbo\\]\\.)?(dbo\\.)?(\\[?' + tableColumn.join('|') + '\\]?)',
        'gi'
    );
    return sql.replace(regex, '$3');
}

/**
 * This function enables users to copy the contents of a text area by clicking on it.
 * A feedback message is displayed to confirm that the text has been copied to the clipboard.
 * @param {HTMLTextAreaElement} textarea The text area element to copy text from.
 */
export function copyTextOnClick(textarea) {
    $(textarea).click(function () {
        copySelectedText(this);
    });
}

/**
 * Copies the selected text in the text area to the clipboard.
 * @param {HTMLTextAreaElement} textarea The text area element to copy text from.
 */
function copySelectedText(textarea) {
    const selectedText = $(textarea).val();
    const tempInput = $('<textarea>');
    $('body').append(tempInput);
    tempInput.val(selectedText);
    tempInput.select();
    document.execCommand('copy');
    tempInput.remove();
    addCopyTextClass(
        '.copy-text',
        'copy-text-active',
        'Copied text to clipboard!',
        5000
    );
}

/**
 * addCopyTextClass - A function to add a class to an element and change its text
 *
 * @param {Element} element - The element to add class to
 * @param {string} className - The class name to add
 * @param {string} text - The text to change to
 * @param {number} timeout - The time in milliseconds to wait before removing class and changing text back
 */
function addCopyTextClass(element, className, text, timeout) {
    $(element).addClass(className);
    $(element).text(text);
    setTimeout(function () {
        $(element).removeClass(className);
        $(element).text('Click to copy');
    }, timeout);
}

/**
 * A function to sort an array of strings in descending order based on their length.
 * @param {An array of strings to sort.} arr
 * @returns A new array of strings sorted in descending order based on their length.
 */
export function sortByLengthDescending(arr) {
    if (arr.length > 0) {
        return arr.sort(function (a, b) {
            return b.length - a.length;
        });
    }
    return arr;
}

/**
 * This function splits a string of comma-separated values into an array of strings, trimming each string.
 * @param {*} text
 * @returns
 */
export function splitTextIntoArray(text) {
    if (text.length > 0) {
        return $.map(text.split(','), function (element) {
            return $.trim(element);
        });
    }
    return '';
}

/**
 * This function trims a string and removes any leading or trailing commas.
 * @param {*} str
 * @returns
 */
export function trimString(str) {
    if (str.length > 0) {
        return $.trim(str).replace(/^,|,$/g, '');
    }
    return str;
}

/**
 * This function formats and displays the SQL statement in the output text area
 * when the submit button is clicked.
 */
export function submitBtnClicked() {
    $('#submit-btn').click(function () {
        const sql = $('.sql-script').val();
        let tableArray = $('.table-column').val();
        tableArray = trimString(tableArray);

        // If table columns are specified, format the SQL statement with the columns.
        if (tableArray !== '') {
            let tableColumns = splitTextIntoArray(tableArray);
            tableColumns = sortByLengthDescending(tableColumns);
            const formattedSQL = formatSQL(sql, tableColumns);
            $('.sql-script-output').val(formattedSQL);
        }
        // If no table columns are specified, display the original SQL statement.
        else {
            $('.sql-script-output').val(sql);
        }
    });
}
