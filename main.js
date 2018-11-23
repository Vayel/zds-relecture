function readText(el) {
    return el.innerText || el.textContent;
}

function readTitle() {
    var h1 = document.querySelector("h1");
    return readText(h1);
}

function switchZenMode(content, open) {
    var classes = content.className.split(' ');
    if (open && classes.indexOf("zen-mode") != -1) {
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
        div.style.display = "inline-block";
        return div;
    }
    
    document.addEventListener("keyup", function(event) {
        var text = getSelectedText();    
        if (text && event.keyCode == 13) { // 13 == Enter
            var widget = findActiveFeedbackWidget(sections, INTRO_SECTION_ID);
            if (!widget) {
                return alert("Error: cannot find active widget.");
            }
            widget.quote(text);
        }
    });

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

function createFeedbackWidgets(sections, wrapper) {
    for (section of sections) {
        section.feedbackWidget = FeedbackWidget(section, wrapper);
    }
}

function createFeedbackMessage(parent) {
    var id = "feedback-message";
    var el = parent.querySelector("#" + id);
    if (el) {
        return el;
    }

    el = document.createElement("textarea");
    el.style.display = "none";
    el.style.position = "fixed";
    el.style.top = "0px";
    el.style.left = "0px";
    el.style.width = "0px";
    el.style.height = "0px";

    parent.appendChild(el);
    return el;
}

function getLastParentBeforeArticle(cur) {
    var par = cur;
    var article = document.querySelector("section.article-content");
    
    do {
        cur = par;
        par = cur.parentNode;
    } while (par != article);

    return cur;
}

function findActiveFeedbackWidget(sections, introId) {
    var cur = getLastParentBeforeArticle(window.getSelection().anchorNode);

    while ((cur = cur.previousSibling) && !isSectionTitle(cur)) {}

    var sectionId = cur ? cur.id : introId;
    for (var section of sections) {
        if (section.id == sectionId) {
            return section.feedbackWidget;
        }
    }
}

function clearFeedback() {
    for (var section of sections) {
        section.feedbackWidget.clear();
    }
}

var content = document.getElementById("content");
var wrapper = document.querySelector(".content-wrapper");
var INTRO_SECTION_ID = "introduction";


switchZenMode(content);
formatContent(wrapper);
var feedbackWrapper = createFeedbackWrapper(content, "feedback-wrapper");
var sections = listSections(INTRO_SECTION_ID);
createFeedbackWidgets(sections, feedbackWrapper);

var copyFeedback = (function(parent) {
    var feedbackMsg = createFeedbackMessage(parent);

    return function() {
        var msg = mdTitle(mdLink(readTitle(), window.location), 1);
        var feedback;

        for (var section of sections) {
            feedback = section.feedbackWidget.toMarkdown();
            if (!feedback) continue;
            msg += "\n\n" + feedback;
        }

        feedbackMsg.value = msg + "\n\n___________\n\n";
        feedbackMsg.style.display = "block";
        feedbackMsg.select();
        document.execCommand("copy");
        feedbackMsg.style.display = "none";
    }
})(feedbackWrapper);

function quit() {
    switchZenMode(content); 
    feedbackWrapper.style.display = "none";
    wrapper.setAttribute("style", "");
}

var toolbar = Toolbar(
    feedbackWrapper,
    "feedback-toolbar",
    copyFeedback,
    clearFeedback,
    quit,
);
