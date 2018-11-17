function readText(el) {
    return el.innerText || el.textContent;
}

function readTitle() {
    var h1 = document.querySelector("h1");
    return readText(h1);
}

var content = document.getElementById("content");
var wrapper = document.querySelector(".content-wrapper");
var FEEDBACK_WRAPPER_ID = "feedback-wrapper";


/*
 * Open zen mode
 */
(function(content) {
    var classes = content.className.split(' ');
    if(classes.indexOf("zen-mode") != -1)
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
    if(content.querySelector("#" + FEEDBACK_WRAPPER_ID))
        return;

    var div = document.createElement(FEEDBACK_WRAPPER_ID);
    div.id = FEEDBACK_WRAPPER_ID;
    div.style.display = "inline-block";
    div.style.verticalAlign = "top";
    div.style.width = "45%";
    content.appendChild(div);
})(content);


/*
 * Create feedback areas 
 */
function createFeedbackArea(wrapper, section) {
    var id = section.id + "-feedback";
    // We use this syntax because ids contain numbers
    if(wrapper.querySelector("[id='" + id + "']"))
        return;

    var div = document.createElement("div");
    div.id = id;

    var label = document.createElement("div");
    label.innerHTML = section.title;
    label.style.fontWeight = "bold";
    div.appendChild(label);

    var textarea = document.createElement("textarea");
    div.appendChild(textarea);

    wrapper.appendChild(div);
}

var feedbackWrapper = document.getElementById(FEEDBACK_WRAPPER_ID);
var sections = (function() {
    var titles = document.querySelectorAll("h2:not(.subtitle)");
    var sections = {};
    var link;
    for(title of titles) {
        link = title.querySelector("a");
        sections[title.id] = {
            id: title.id,
            title: readText(link),
            url: link.href,
        };
    }
    return sections;
})();

for(var id in sections) {
    createFeedbackArea(feedbackWrapper, sections[id]); 
}
