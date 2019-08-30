for (var a = 0; a < 9; a++) {
    var str = "";
    for (var b = 0; b < 8 - a; b++) {
        str += " ";
    }
    for (var b = 0; b < a * 2 - 1; b++) {
        str += "*";
    }
    console.info(str);
}