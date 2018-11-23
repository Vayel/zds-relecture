var Toolbar = function(parent, id, copyFeedbackCb, clearFeedbackCb, quitCb) {
    var toolbar = document.getElementById(id);
    var ul;
    if (toolbar) {
        ul = toolbar.querySelector(ul);
        return toolbar; 
    }

    function addButton(html, hoverHTML) {
        var li = document.createElement("li");
        li.style.listStyleType = "none";
        li.style.textAlign = "right";
        li.style.padding = "5px 0";
        li.style.height = "30px";
        ul.appendChild(li);

        var btn = document.createElement("a");
        btn.href = "#";
        btn.innerHTML = html;
        btn.style.textAlign = "center";
        btn.style.fontFamily = "Merriweather,Liberation Serif,Times New Roman,Times,Georgia,FreeSerif,serif";
        btn.style.backgroundColor = "#eee";
        btn.style.color = "#555";
        btn.style.border = "none";
        btn.style.padding = "10px";
        btn.style.fontSize = "12px";
        li.appendChild(btn);

        if (hoverHTML !== undefined) {
            li.addEventListener("mouseover", function() {
                btn.innerHTML = hoverHTML;
            });

            li.addEventListener("mouseout", function() {
                btn.innerHTML = html;
            });
        }

        return btn;
    }

    toolbar = document.createElement("div");
    toolbar.style.position = "fixed";
    toolbar.style.top = "5px";
    toolbar.style.right = "5px";
    parent.appendChild(toolbar);
    
    ul = document.createElement("ul");
    toolbar.appendChild(ul);

    var copy= addButton(
        '<img src="' + browser.extension.getURL("icons/copy.png") + '" alt="Copier" />',
        "Copier dans le presse-papier"
    );
    copy.addEventListener("click", function(e) {
        e.preventDefault();
        copyFeedbackCb();
        copy.innerHTML = '<img src="' + browser.extension.getURL("icons/check.png") + '" alt="Copié !" />';
    });

    var clear = addButton(
        '<img src="' + browser.extension.getURL("icons/clear.png") + '" alt="Copier" />',
        "Effacer les retours"
    );
    clear.addEventListener("click", function(e) {
        e.preventDefault();
        clearFeedbackCb();
    });

    var quit = addButton(
        '<img src="' + browser.extension.getURL("icons/quit.png") + '" alt="Quitter le mode relecture" />',
        "Quitter le mode relecture"
    );
    quit.addEventListener("click", function(e) {
        e.preventDefault();
        quitCb();
    });
};
