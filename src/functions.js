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
      "(\\[(" + column + ")\\])|\\b(" + column + ")\\b(?![^\\{\\}]*\\})",
      "gmi"
    );
    sql = sql.replace(regex, "{$2$3}");
  });

  return sql;
}

/**
 * Remove dbo. and brackets surrounding it for specified columns in the table
 *
 * @param {string} sql - SQL statement
 * @param {array} tableColumn - List of columns to remove dbo. from
 *
 * @return {string} - SQL statement with dbo. and brackets removed for specified columns
 */
export function removeDboAndBracketsFromColumns(sql, tableColumn) {
  tableColumn.forEach(function (column) {
    let regex = new RegExp(
      "\\[dbo\\]\\.\\[(" + column + ")\\]|dbo.\\[(" + column + ")\\]",
      "gmi"
    );
    sql = sql.replace(regex, "$1$2");
  });

  return sql;
}

/**
 * Remove 'dbo.' prefix for table columns in SQL string
 * @param {string} sql - The SQL string to modify
 * @param {Array} tableColumn - An array of table column names
 * @returns {string} - The modified SQL string with 'dbo.' prefix removed
 */
function removeDboPrefixForTableColumns(sql, tableColumn) {
  let regex = new RegExp("dbo\\.(" + tableColumn.join("|") + ")", "gi");
  return sql.replace(regex, "$1");
}

/**
 * Format SQL - a function to format a SQL statement by calling `removeDBOPrefix()`, `removeDBOAndBrackets()`, and `wrapTableColumnsWithBrackets()`
 *
 * @param {*} sql
 * @param {*} tableColumn
 * @returns
 */
function formatSQL(sql, tableColumn) {
  sql = removeDboPrefixForTableColumns(sql, tableColumn);
  sql = removeDboAndBracketsFromColumns(sql, tableColumn);
  sql = wrapTableColumnsWithBrackets(sql, tableColumn);
  return sql;
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
  const tempInput = $("<textarea>");
  $("body").append(tempInput);
  tempInput.val(selectedText);
  tempInput.select();
  document.execCommand("copy");
  tempInput.remove();
  addCopyTextClass(
    ".copy-text",
    "copy-text-active",
    "Copied text to clipboard!",
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
    $(element).text("Click to copy");
  }, timeout);
}

/**
 * A function to sort an array of strings in descending order based on their length.
 * @param {An array of strings to sort.} arr
 * @returns A new array of strings sorted in descending order based on their length.
 */
function sortByLengthDescending(arr) {
  return arr.sort(function (a, b) {
    return b.length - a.length;
  });
}

/**
 * This function splits a string of comma-separated values into an array of strings, trimming each string.
 * @param {*} text
 * @returns
 */
function splitTextIntoArray(text) {
  return $.map(text.split(","), function (element) {
    return $.trim(element);
  });
}

/**
 * This function trims a string and removes any leading or trailing commas.
 * @param {*} str
 * @returns
 */
function trimString(str) {
  return $.trim(str).replace(/^,|,$/g, "");
}

/**
 * This function formats and displays the SQL statement in the output text area
 * when the submit button is clicked.
 */
export function submitBtnClicked() {
  $("#submit-btn").click(function () {
    const sql = $(".sql-script").val();
    let tableArray = $(".table-column").val();
    tableArray = trimString(tableArray);

    // If table columns are specified, format the SQL statement with the columns.
    if (tableArray !== "") {
      let tableColumns = splitTextIntoArray(tableArray);
      tableColumns = sortByLengthDescending(tableColumns);
      const formattedSQL = formatSQL(sql, tableColumns);
      $(".sql-script-output").val(formattedSQL);
    }
    // If no table columns are specified, display the original SQL statement.
    else {
      $(".sql-script-output").val(sql);
    }
  });
}

// $(".sql-script").val("");
// $(".sql-script-output").val("");
// $(".table-column").val("");
// submitBtnClicked();
// copyTextOnClick($(".sql-script-output"));
