function createTextarea() {
    var el = document.createElement("textarea");
    return el;
}

function readText(el) {
    return el.innerText || el.textContent;
}

function readTitle() {
    var h1 = document.querySelector("h1");
    return readText(h1);
}

function readSections() {
    var els = document.querySelectorAll("h2:not(.subtitle)");
    var sections = [];
    var link;
    for(el of els) {
        link = el.querySelector("a");
        sections.push({
            id: el.id,
            text: readText(link),
            url: link.href,
        });
    }
    return sections;
}

function openZenMode(content) {
    var classes = content.className.split(' ');
    if(classes.indexOf("zen-mode") != -1) return;
    var btn = document.querySelector(".open-zen-mode");
    btn.click();
}

var content = document.getElementById("content");
var wrapper = document.querySelector(".content-wrapper");

openZenMode(content);
