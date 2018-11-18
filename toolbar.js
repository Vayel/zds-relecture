var Toolbar = function(parent, id, copyFeedbackCb, clearFeedbackCb) {
    var toolbar = document.getElementById(id);
    if (toolbar) {
        return toolbar; 
    }

    function addButton(html, hoverHTML) {
        var btn = document.createElement("button");
        btn.innerHTML = html;
        btn.style.fontFamily = "Merriweather,Liberation Serif,Times New Roman,Times,Georgia,FreeSerif,serif";
        btn.style.backgroundColor = "#eee";
        btn.style.color = "#555";
        btn.style.cursor = "pointer";
        btn.style.border = "none";
        btn.style.padding = "0px 10px";
        btn.style.marginBottom = "5px";
        btn.style.fontSize = "12px";
        toolbar.appendChild(btn);
        toolbar.appendChild(document.createElement("br"));

        if (hoverHTML !== undefined) {
            btn.addEventListener("mouseover", function() {
                btn.innerHTML = hoverHTML;
            });

            btn.addEventListener("mouseout", function() {
                btn.innerHTML = html;
            });
        }

        return btn;
    }

    var toolbar = document.createElement("div");
    toolbar.style.position = "fixed";
    toolbar.style.top = "5px";
    toolbar.style.right = "5px";
    parent.appendChild(toolbar);

    var copy= addButton(
        '<img src="' + browser.extension.getURL("icons/copy.png") + '" alt="Copier" />',
        "Copier dans le presse-papier"
    );
    copy.addEventListener("click", function() {
        copyFeedbackCb();
        copy.innerHTML = '<img src="' + browser.extension.getURL("icons/check.png") + '" alt="Copié !" />';
    });

    var clear = addButton(
        '<img src="' + browser.extension.getURL("icons/clear.png") + '" alt="Copier" />',
        "Effacer les retours"
    );
    clear.addEventListener("click", clearFeedbackCb);
};
