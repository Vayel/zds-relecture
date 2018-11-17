var FeedbackWidget = function(section, wrapper) {
    var widget = Widget(section.element, section.id + "-feedback", wrapper);

    if (!widget.innerHTML) {
        var label = document.createElement("div");
        label.innerHTML = section.title;
        label.style.fontWeight = "bold";
        widget.appendChild(label);

        var textarea = document.createElement("textarea");
        textarea.style.height = (window.innerHeight * 0.5) + "px";
        widget.appendChild(textarea);
    }

    function mdLink(txt, url) {
        return "[" + txt + "](" + url + ")";
    }

    function mdTitle(txt, order) {
        return "#".repeat(order) + " " + txt;
    }

    return {
        toMarkdown: function() {
            var feedback = textarea.value;
            if (feedback) {
                return (
                    mdTitle(mdLink(section.title, section.url), 2) +
                    "\n\n" +
                    feedback
                );
            }
        },
        clear: function() { textarea.value = ""; },
        fill: function(text) { textarea.value = text; },
    };
};
