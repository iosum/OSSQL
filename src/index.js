import {
    submitBtnClicked,
    copyTextOnClick,
    trimString,
    removeDboPrefixForTableColumns,
    wrapTableColumnsWithBrackets,
    splitTextIntoArray,
    sortByLengthDescending,
} from './functions.js';

$('.sql-script').val('');
$('.sql-script-output').val('');
$('.table-column').val('');
//submitBtnClicked();

$('#submit-btn').click(function () {
    const sql = $('.sql-script').val();
    let tableArray = $('.table-column').val();
    tableArray = trimString(tableArray);

    // If table columns are specified, format the SQL statement with the columns.
    if (tableArray !== '') {
        tableArray = splitTextIntoArray(tableArray);
        tableArray = sortByLengthDescending(tableArray);

        let formattedSQL = removeDboPrefixForTableColumns(sql, tableArray);
        formattedSQL = wrapTableColumnsWithBrackets(sql, tableArray);
        $('.sql-script-output').val(formattedSQL);
    }
    // If no table columns are specified, display the original SQL statement.
    else {
        $('.sql-script-output').val(sql);
    }
});
copyTextOnClick($('.sql-script-output'));
