function readText(el) {
    return el.innerText || el.textContent;
}

function readTitle() {
    var h1 = document.querySelector("h1");
    return readText(h1);
}

function getAbsoluteTop(element) {
    var bodyRect = document.body.getBoundingClientRect(),
        elemRect = element.getBoundingClientRect();
    return elemRect.top - bodyRect.top;
}

var content = document.getElementById("content");
var wrapper = document.querySelector(".content-wrapper");
var FEEDBACK_WRAPPER_ID = "feedback-wrapper";
var INTRO_SECTION_ID = "introduction";
var SEND_BTN_ID = "feedback-send-btn";
var FINAL_MSG_ID = "feedback-final-msg";


/*
 * Open zen mode
 */
(function(content) {
    var classes = content.className.split(' ');
    if (classes.indexOf("zen-mode") != -1)
        return;
    document.querySelector(".open-zen-mode").click();
})(content);


/*
 * Format content
 */
// We need to use `el.setAttribute()` instead of `el.style.property`
// because there is an "!important" CSS rule that we need to override.
wrapper.setAttribute("style", (
    "width: 45%;" +
    "margin: 0px 30px !important;" +
    "display: inline-block;" +
    "vertical-align: top;"
));


/*
 * Create feedback wrapper
 */
(function(content) {
    if (content.querySelector("#" + FEEDBACK_WRAPPER_ID))
        return;

    var div = document.createElement(FEEDBACK_WRAPPER_ID);
    div.id = FEEDBACK_WRAPPER_ID;
    div.style.display = "inline-block";
    div.style.verticalAlign = "top";
    content.appendChild(div);
})(content);


/*
 * Create feedback areas 
 */
function getFeedbackAreaId(sectionId) {
    return sectionId + "-feedback";
}

function createFeedbackArea(wrapper, section) {
    var id = getFeedbackAreaId(section.id);
    // We use this syntax because ids contain numbers
    if (wrapper.querySelector("[id='" + id + "']"))
        return;

    var div = document.createElement("div");
    div.id = id;
    div.style.position = "fixed";
    div.style.top = "30px";
    div.style.width = "45%";

    var label = document.createElement("div");
    label.innerHTML = section.title;
    label.style.fontWeight = "bold";
    div.appendChild(label);

    var textarea = document.createElement("textarea");
    textarea.style.height = (window.innerHeight * 0.5) + "px";
    div.appendChild(textarea);

    wrapper.appendChild(div);
    section.feedbackWrapper = div;
}

var feedbackWrapper = document.getElementById(FEEDBACK_WRAPPER_ID);
var sections = (function() {
    var titles = document.querySelectorAll("h2:not(.subtitle)");
    var sections = [{
        id: INTRO_SECTION_ID,
        title: readTitle(),
        titleElement: document.querySelector("h1"),
        url: window.location,
        top: getAbsoluteTop(document.querySelector("h1")),
    }];

    var link;
    for (title of titles) {
        link = title.querySelector("a");
        sections.push({
            id: title.id,
            title: readText(link),
            titleElement: link,
            url: link.href,
            top: getAbsoluteTop(link),
        });
    }
    return sections;
})();

for (var section of sections) {
    createFeedbackArea(feedbackWrapper, section); 
}

function displayFeedbackAreas() {
    var scrollTop = (((t = document.documentElement) || (t = document.body.parentNode))
                     && typeof t.scrollTop == 'number' ? t : document.body).scrollTop;
    var section, relYCur, relYNext, height;
    var MARGIN = 20;

    for (var i=0; i < sections.length; i++) {
        section = sections[i];
        relYCur = section.top - scrollTop;
        relYNext = (sections[i+1] !== undefined) ? (sections[i+1].top - scrollTop) : Infinity;
        height = section.feedbackWrapper.getBoundingClientRect().height;

        if (relYCur > 0 && relYCur < window.innerHeight) {
            // The section title appears on the screen
            section.feedbackWrapper.style.visibility = "visible";
            section.feedbackWrapper.style.top = Math.max(relYCur, 20) + "px";
        } else if (relYCur < 0 && relYNext - (height + MARGIN) > 0) {
            // We are between the section title and the next section title
            section.feedbackWrapper.style.visibility = "visible";
        } else {
            section.feedbackWrapper.style.visibility = "hidden";
        }
    }
}

document.addEventListener("scroll", displayFeedbackAreas);
displayFeedbackAreas();


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
    btn.innerHTML = "Copier";
    btn.style.position = "fixed";
    btn.style.fontFamily = "Merriweather,Liberation Serif,Times New Roman,Times,Georgia,FreeSerif,serif";
    btn.style.background = "#eee";
    btn.style.color = "#555";
    btn.style.cursor = "pointer";
    btn.style.border = "none";
    btn.style.fontSize = "none";
    btn.style.top = "5px";
    btn.style.right = "5px";
    btn.style.padding = "0px 10px";
    btn.style.fontSize = "12px";

    wrapper.appendChild(btn);
    wrapper.appendChild(finalMsg);

    btn.addEventListener("mouseover", function() {
        btn.innerHTML = "Copier les retours dans le presse-papiers.";
    });

    btn.addEventListener("mouseout", function() {
        btn.innerHTML = "Copier";
    });
})(feedbackWrapper);

document.getElementById(SEND_BTN_ID).addEventListener("click", function() {
    var finalMsg = document.getElementById(FINAL_MSG_ID);
    var msg = "TODO";
    finalMsg.value = msg;
    finalMsg.style.display = "block";
    finalMsg.select();
    document.execCommand("copy");
    finalMsg.style.display = "none";
    
    var btn = document.getElementById(SEND_BTN_ID);
    btn.innerHTML = "Copié !"
    setTimeout(function() { btn.innerHTML = "Copier"; }, 2000);
});
