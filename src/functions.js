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
    if (tableColumn.length > 0) {
        let regex = new RegExp(
            '(\\[dbo\\]\\.)?(dbo\\.)?(\\[?' + tableColumn.join('|') + '\\]?)',
            'gi'
        );
        return sql.replace(regex, '$3');
    }
    return sql;
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
    debugger;
    if (str.length > 0 && str != ' ') {
        return $.trim(str).replace(/^,|,$/g, '');
    }
    return '';
}
