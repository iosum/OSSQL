import {
    trimString,
    removeDboPrefixForTableColumns,
    wrapTableColumnsWithBrackets,
    splitTextIntoArray,
    sortByLengthDescending,
} from './functions.js';

$('.sql-script').val('');
$('.sql-script-output').val('');
$('.table-column').val('');

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

$('.sql-script-output').click(function () {
    const selectedText = $(this).val();
    const tempInput = $('<textarea>');
    $('body').append(tempInput);
    tempInput.val(selectedText);
    tempInput.select();
    document.execCommand('copy');
    tempInput.remove();

    $('.copy-text').addClass('copy-text-active');
    $('.copy-text').text('Copied text to clipboard!');
    setTimeout(function () {
        $('.copy-text').removeClass('copy-text-active');
        $('.copy-text').text('Click to copy');
    }, 5000);
});
