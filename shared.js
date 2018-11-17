function mdLink(txt, url) {
    return "[" + txt + "](" + url + ")";
}

function mdTitle(txt, order) {
    return "#".repeat(order) + " " + txt;
}

function getSelectedText() {
    var text = "";
    if (typeof window.getSelection != "undefined") {
        text = window.getSelection().toString();
    } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
        text = document.selection.createRange().text;
    }
    return text;
}

function isSectionTitle(el) {
    return el.tagName == "H2" && el.className.split(" ").indexOf(".subtitle") == -1;
}
