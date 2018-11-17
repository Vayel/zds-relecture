var Toolbar = function(parent, id, copyFeedbackCb) {
    var toolbar = document.getElementById(id);
    if (toolbar) {
        return toolbar; 
    }

    var toolbar = document.createElement("div");
    toolbar.style.position = "fixed";
    toolbar.style.top = "5px";
    toolbar.style.right = "5px";

    var copyBtn = document.createElement("button");
    copyBtn.innerHTML = "Copier";
    copyBtn.style.position = "fixed";
    copyBtn.style.fontFamily = "Merriweather,Liberation Serif,Times New Roman,Times,Georgia,FreeSerif,serif";
    copyBtn.style.backgroundColor = "#eee";
    copyBtn.style.color = "#555";
    copyBtn.style.cursor = "pointer";
    copyBtn.style.border = "none";
    copyBtn.style.fontSize = "none";
    copyBtn.style.top = "5px";
    copyBtn.style.right = "5px";
    copyBtn.style.padding = "0px 10px";
    copyBtn.style.fontSize = "12px";

    toolbar.appendChild(copyBtn);
    parent.appendChild(toolbar);
    
    copyBtn.addEventListener("mouseover", function() {
        copyBtn.innerHTML = "Copier dans le presse-papier";
    });

    copyBtn.addEventListener("mouseout", function() {
        copyBtn.innerHTML = "Copier";
    });

    copyBtn.addEventListener("click", function() {
        copyFeedbackCb();
        copyBtn.innerHTML = "Copié !";
        setTimeout(function() { copyBtn.innerHTML = "Copier"; }, 2000);
    });
};
