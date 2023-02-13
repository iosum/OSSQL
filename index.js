/**
 * This function removes the string '[dbo].' from a SQL statement.
 * [dbo].[Table1] => [Table1]
 * @param {*} sql
 * @returns
 */
function removeDboWords(sql) {
  return sql.replace(/\[dbo\]\./g, "");
}

/**
 * This function wraps the table columns in curly braces ({}) if they are not already wrapped.
 * The table columns to be wrapped are passed as an argument to the function.
 * @param {*} sql
 * @param {*} tableColumn
 * @returns
 */
function wrapColumnsWithBrackets(sql, tableColumn) {
  tableColumn.forEach(function (column) {
    let regex = new RegExp(
      "(\\[(" + column + ")\\])|(" + column + ")(?![^\\{\\}]*\\})",
      "gm"
    );
    sql = sql.replace(regex, "{$2$3}");
  });

  return sql;
}

function removeDboWordsAndBrackets(sql, tableColumn) {
  tableColumn.forEach(function (column) {
    let regex = new RegExp(
      "\\[dbo\\]\\.\\[(" + column + ")\\]|dbo.\\[(" + column + ")\\]",
      "gm"
    );
    sql = sql.replace(regex, "$1$2");
  });

  return sql;
}

function removeDboKeyword(sql, tableColumn) {
  tableColumn.forEach(function (column) {
    let regex = new RegExp(
      "dbo\\.\\[(" + column + ")\\]|\\[(" + column + ")\\]|(" + column + ")",
      "gm"
    );
    sql = sql.replace(regex, "$1$2$3");
  });

  return sql;
}

/**
 * This function calls removeDboWords() and wrapColumnsWithBrackets() to format a SQL statement.
 * @param {*} sql
 * @param {*} tableColumn
 * @returns
 */
function formatSQL(sql, tableColumn) {
  //sql = removeDboWords(sql);

  sql = removeDboWordsAndBrackets(sql, tableColumn);
  //sql = removeDboKeyword(sql, tableColumn);

  sql = wrapColumnsWithBrackets(sql, tableColumn);
  return sql;
}

/**
 * This function enables users to copy the contents of a text area by clicking on it.
 * A feedback message is displayed to confirm that the text has been copied to the clipboard.
 * @param {*} textarea
 */
function copyTextOnClick(obj) {
  $(obj).click(function () {
    const selectedText = $(this).val();
    const tempInput = $("<textarea>");
    $("body").append(tempInput);
    tempInput.val(selectedText);
    tempInput.select();
    document.execCommand("copy");
    tempInput.remove();
    addActiveClass();
  });
}

/**
 * This function adds a class named copy-text-active to an element and changes its text to "Copied text to clipboard!" for 5 seconds.
 */
function addActiveClass() {
  $(".copy-text").addClass("copy-text-active");
  $(".copy-text").text("Copied text to clipboard!");
  setTimeout(function () {
    $(".copy-text").removeClass("copy-text-active");
    $(".copy-text").text("Click to copy");
  }, 5000);
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
 * This function calls formatSQL when the submit button is clicked.
 * The SQL statement and table columns are retrieved from the form fields, and the formatted SQL statement is displayed in the output text area.
 */
function submitBtnClicked() {
  $("#submit-btn").click(function () {
    const sql = $(".sql-script").val();
    let tableArray = $(".table-column").val();
    tableArray = trimString(tableArray);
    if (tableArray != "") {
      let tableColumns = splitTextIntoArray(tableArray);
      tableColumns = sortByLengthDescending(tableColumns);
      const formattedSQL = formatSQL(sql, tableColumns);
      $(".sql-script-output").val(formattedSQL);
    } else {
      $(".sql-script-output").val(sql);
    }
  });
}

$(".sql-script").val("");
$(".sql-script-output").val("");
$(".table-column").val("");
submitBtnClicked();
copyTextOnClick($(".sql-script-output"));
