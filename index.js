// const tableColumn = [
//   "vw_GetUserSecurityGroup",

//   "vw_GetUserBy_eCapexDataAccessGroup",
// ];

function removeDboWords(sql) {
  return sql.replace(/\[dbo\]\./g, "");
}

function removeSquareBrackets(sql) {
  return sql.replace(/\[\]\./g, "");
}

// 在 column 的左右，如果有[]，移除[]，並加上{}
// 如果已經有{}，則會跳過該字，不再重複加
function wrapColumnsWithBrackets(sql, tableColumn) {
  tableColumn.forEach(function (column) {
    let regex = new RegExp(
      "(\\[(" + column + ")\\])|(" + column + ")(?![^\\{\\}]*\\})",
      "g"
    );
    sql = sql.replace(regex, "{$2$3}");
  });

  return sql;
}

function formatSQL(sql, tableColumn) {
  sql = removeSquareBrackets(sql);
  sql = removeDboWords(sql);
  sql = wrapColumnsWithBrackets(sql, tableColumn);
  return sql;
}

function copyTextOnClick(textarea) {
  $(textarea).click(function () {
    const selectedText = $(this).val();
    const tempInput = $("<textarea>");
    $("body").append(tempInput);
    tempInput.val(selectedText);
    tempInput.select();
    document.execCommand("copy");
    tempInput.remove();
    addActiveBtnClass($(".copy-btn"));
  });
}

function addActiveBtnClass(obj) {
  $(obj).addClass("copy-btn-active");
  $(obj).text("Copied text to clipboard!");
  setTimeout(function () {
    $(obj).removeClass("copy-btn-active");
    $(obj).text("Click to copy");
  }, 5000);
}

function submitBtnClicked() {
  $("#submit-btn").click(function () {
    const sql = $(".sql-script").val();
    //console.log(sql);
    const tableString = $(".table-column").val();
    const tableColumns = splitTextIntoArray(tableString);
    console.log(tableColumns);
    const formattedSQL = formatSQL(sql, tableColumns);
    $(".sql-script-output").val(formattedSQL);
  });
}

function splitTextIntoArray(text) {
  return text.split(",");
}

$(".sql-script").val("");
$(".sql-script-output").val("");
submitBtnClicked();
copyTextOnClick($(".sql-script-output"));
