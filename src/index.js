import { submitBtnClicked, copyTextOnClick } from "./functions.js";

$(".sql-script").val("");
$(".sql-script-output").val("");
$(".table-column").val("");
submitBtnClicked();
copyTextOnClick($(".sql-script-output"));
