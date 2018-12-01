var Widget = function(section, id, wrapper) {
    // We use this syntax because ids may contain numbers
    var widget = wrapper.querySelector("[id='" + id + "']");
    if (widget) {
        return widget.querySelector(".widget-content");
    }
    
    function findNextSection(section) {
        var cur = section;
        while ((cur = cur.nextSibling) && !isSectionTitle(cur)) {}
        return cur;
    }

    var nextSection = findNextSection(section.element);
    var topSection = getAbsolutePos(section.element, "bottom");
    var topNextSection;
    if (nextSection) {
        topNextSection = getAbsolutePos(nextSection, "top");
    } else {
        topNextSection = Infinity;
    }

    widget = document.createElement("div");
    widget.id = id;
    widget.className = "review-widget";
    widget.style.position = "absolute";
    widget.style.top = topSection + "px";
    widget.style.width = "45%";
    wrapper.appendChild(widget);

    /*
    var label = document.createElement("div");
    label.className = "label";
    label.innerHTML = section.title;
    label.style.fontWeight = "bold";
    label.style.marginBottom = "5px";
    widget.appendChild(label);
    */

    var content = document.createElement("div");
    content.className = "widget-content";
    content.style.overflow = "auto";
    widget.appendChild(content);
    content.style.maxHeight = (topNextSection - topSection - content.offsetTop) + "px";

    /*
    function updatePosition() {
        var scrollTop = (((t = document.documentElement) || (t = document.body.parentNode))
                         && typeof t.scrollTop == 'number' ? t : document.body).scrollTop;
        
        var relYCur = topSection - scrollTop,
            relYNext = topNextSection - scrollTop,
            height = widget.getBoundingClientRect().height,
            yMargin = 25,
            totalHeight = height + 2*yMargin;

        if (relYCur > 0 && relYCur < window.innerHeight) {
            // The section title appears on the screen
            widget.style.visibility = "visible";
            widget.style.top = Math.max(relYCur, yMargin) + "px";
        } else if (relYCur < 0 && (relYNext - totalHeight) > 0) {
            // We are between the section title and the next section title
            // and we have enough space to display the whole widget (with the
            // margins).
            widget.style.visibility = "visible";
            widget.style.top = yMargin + "px";
            widget.style.opacity = "1";
        } else if (relYNext < window.innerHeight && relYNext > 0) {
            // We are between the section title and the next section title
            // but we don't have enough space to display the widget so we
            // reduce the opacity.
            widget.style.top = (relYNext - (height + yMargin)) + "px";
            widget.style.opacity = Math.pow(relYNext / window.innerHeight, 2).toString();
            widget.style.visibility = "visible";
        } else {
            widget.style.visibility = "hidden";
        }
    }

    document.addEventListener("scroll", updatePosition);
    updatePosition();
    */

    return content;
};
