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
        id: "introduction",
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
            section.feedbackWrapper.style.top = relYCur + "px";
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
