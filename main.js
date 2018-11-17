function readText(el) {
    return el.innerText || el.textContent;
}

function readTitle() {
    var h1 = document.querySelector("h1");
    return readText(h1);
}

function openZenMode(content) {
    var classes = content.className.split(' ');
    if (classes.indexOf("zen-mode") != -1) {
        return;
    }
    document.querySelector(".open-zen-mode").click();
}

function formatContent(content) {
    // We need to use `el.setAttribute()` instead of `el.style.property`
    // because there is an "!important" CSS rule that we need to override.
    wrapper.setAttribute("style", (
        "width: 45%;" +
        "margin: 0px 30px !important;" +
        "display: inline-block;" +
        "vertical-align: top;"
    ));
}

function createFeedbackWrapper(parent, id) {
    var div = parent.querySelector("#" + id);
    if (div) {
        return;
    }

    div = document.createElement("div");
    div.id = id;
    div.style.display = "inline-block";
    div.style.verticalAlign = "top";

    parent.appendChild(div);
    return div;
}

function listSections(introId) {
    var sections = [{
        id: introId,
        title: "Introduction",
        element: document.querySelector(".article-content").firstElementChild,
        url: window.location,
    }];
    var link,
        titles = document.querySelectorAll("h2:not(.subtitle)");

    for (title of titles) {
        link = title.querySelector("a");
        sections.push({
            id: title.id,
            title: readText(link),
            element: title,
            url: link.href,
        });
    }

    return sections;
}

function createFeedbackWidgets(sections, parent) {
    for (section of sections) {
        section.feedbackWidget = FeedbackWidget(section, parent);
    }
}


var content = document.getElementById("content");
var wrapper = document.querySelector(".content-wrapper");
var FEEDBACK_WRAPPER_ID = "feedback-wrapper";
var INTRO_SECTION_ID = "introduction";
var SEND_BTN_ID = "feedback-send-btn";
var FINAL_MSG_ID = "feedback-final-msg";


openZenMode(content);
formatContent(wrapper);
var feedbackWrapper = createFeedbackWrapper(content);
var sections = listSections(INTRO_SECTION_ID);
createFeedbackWidgets(sections, feedbackWrapper);










/*
 * Add selected text to feedback area
 */
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

function findActiveArea() {
    var cur = window.getSelection().anchorNode.parentNode;

    while ((cur = cur.previousSibling) && !isSectionTitle(cur)) {}

    var sectionId = cur ? cur.id : INTRO_SECTION_ID;
    for (var section of sections) {
        if (section.id == sectionId) {
            return section.feedbackWrapper.querySelector("textarea");
        }
    }
}

document.addEventListener("keyup", function(event) {
    var text = getSelectedText();    
    if (!text || event.keyCode != 13) // 13 == Enter
        return;
    var lines = text.split("\n");
    var quote = "> " + lines.join("\n> ");
    var area = findActiveArea();
    if (area == null)
        throw "Cannot find active area.";
    if (area.value) {
        area.value += "\n\n";
    }
    area.value += quote + "\n\n";
    area.focus();
});


/*
 * Create final message
 */
function editCopyBtn(btn, icon) {
    btn.innerHTML = "Copier";
}

(function(wrapper) {
    var finalMsg = document.createElement("textarea");
    finalMsg.id = FINAL_MSG_ID;
    finalMsg.style.display = "none";
    finalMsg.style.position = "fixed";
    finalMsg.style.top = "0px";
    finalMsg.style.left = "0px";
    finalMsg.style.width = "0px";
    finalMsg.style.height = "0px";

    var btn = document.createElement("button");
    btn.id = SEND_BTN_ID;
    btn.style.position = "fixed";
    btn.style.fontFamily = "Merriweather,Liberation Serif,Times New Roman,Times,Georgia,FreeSerif,serif";
    btn.style.backgroundColor = "#eee";
    btn.style.color = "#555";
    btn.style.cursor = "pointer";
    btn.style.border = "none";
    btn.style.fontSize = "none";
    btn.style.top = "5px";
    btn.style.right = "5px";
    btn.style.padding = "0px 10px";
    btn.style.fontSize = "12px";
    editCopyBtn(btn, "copy");

    wrapper.appendChild(btn);
    wrapper.appendChild(finalMsg);

    btn.addEventListener("mouseover", function() {
        btn.innerHTML = "Copier dans le presse-papier";
        //btn.style.backgroundImage = "none";
    });

    btn.addEventListener("mouseout", function() {
        editCopyBtn(btn, "copy");
    });
})(feedbackWrapper);

document.getElementById(SEND_BTN_ID).addEventListener("click", function() {
    var finalMsg = document.getElementById(FINAL_MSG_ID);
    var msg = mdTitle(mdLink(readTitle(), window.location), 1);
    var feedback;

    for (var section of sections) {
        feedback = section.feedbackWrapper.querySelector("textarea").value;
        if (!feedback) continue;
        msg += "\n\n";
        msg += mdTitle(mdLink(section.title, section.url), 2);
        msg += "\n\n";
        msg += feedback;
    }

    finalMsg.value = msg;
    finalMsg.style.display = "block";
    finalMsg.select();
    document.execCommand("copy");
    finalMsg.style.display = "none";
    
    var btn = document.getElementById(SEND_BTN_ID);
    editCopyBtn(btn, "check-circle");
    setTimeout(function() { editCopyBtn(btn, "copy"); }, 2000);
});
