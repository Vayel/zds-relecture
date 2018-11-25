var CommentGroup = function(anchor, topRef, deleteGroupCb) {
    var comments = [];

    var htmlElement = document.createElement("div");
    htmlElement.className = "comment-group";
    htmlElement.style.display = "flex";
    htmlElement.style.overflow = "hidden";
    htmlElement.style.position = "absolute";
    htmlElement.style.top = (getAbsolutePos(anchor) - topRef) + "px";
    htmlElement.style.width = "100%";

    var iconWrapper = document.createElement("div");
    iconWrapper.style.marginRight = "25px";
    iconWrapper.style.textAlign = "left";
    htmlElement.appendChild(iconWrapper);

    var icon = document.createElement("a");
    icon.href = "#";
    icon.title = "Afficher les commentaires";
    icon.innerHTML = (
        '<img ' +
        'src="' + browser.extension.getURL("icons/comments.png") + '" ' +
        'alt="Afficher les commentaires" />'
    );
    iconWrapper.appendChild(icon);

    var commentsWrapper = document.createElement("div");
    commentsWrapper.style.flexGrow = "1";
    commentsWrapper.style.display = "none";
    htmlElement.appendChild(commentsWrapper);

    function show() {
        icon.title = "Cacher les commentaires";
        icon.querySelector("img").alt = "Cacher les commentaires";
        commentsWrapper.style.display = "block";
    }

    icon.addEventListener("click", function(e) {
        e.preventDefault();
        if (commentsWrapper.style.display == "none") {
            show();
        } else {
            icon.title = "Afficher les commentaires";
            icon.querySelector("img").alt = "Afficher les commentaires";
            commentsWrapper.style.display = "none";
        }
    });

    function deleteComment(comment) {
        commentsWrapper.removeChild(comment);
        for (var i = 0; i < comments.length; i++) {
            if (comments[i].htmlElement == comment) break;
        }
        comments.splice(i, 1);
        if (!comments.length) {
            deleteGroupCb(htmlElement);
        }
    }

    return {
        anchor: anchor,
        htmlElement: htmlElement,
        addComment: function(quotedText) {
            var comment = Comment(quotedText, deleteComment);
            comments.push(comment);
            commentsWrapper.appendChild(comment.htmlElement);
            comment.show();
        },
        toMarkdown: function() {
            var md = [];
            for (var c of comments) {
                md.push(c.toMarkdown());
            }
            return md.join("\n\n");
        },
        show: show,
    };
};
