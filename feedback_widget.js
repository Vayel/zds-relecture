var FeedbackWidget = function(section, wrapper) {
    var widget = Widget(section, section.id + "-feedback", wrapper);
    var commentGroups = [];

    var noCommentDiv = widget.querySelector(".no-comment");
    if (!noCommentDiv) {
        noCommentDiv = document.createElement("div");
        noCommentDiv.className = "no-comment";
        noCommentDiv.innerHTML = (
            "Aucun commentaire pour le moment.<br>" +
            "Sélectionnez du texte puis pressez « Entrée » pour en insérer un."
        );
    }

    function resetHTML() {
        widget.innerHTML = "";
        widget.appendChild(noCommentDiv);
    }

    if (!widget.innerHTML) {
        resetHTML();
    }
    
    function deleteGroup(group) {
        widget.removeChild(group);
        for (var i = 0; i < commentGroups.length; i++) {
            if (commentGroups[i].htmlElement == group) break;
        }
        commentGroups.splice(i, 1);
        if (!commentGroups.length) {
            resetHTML();
        }
    }

    return {
        // TODO
        toMarkdown: function() {
            var msg = [];
            for (var group of commentGroups) {
                msg.push(group.toMarkdown());
            }
            if (msg.length) {
                return (
                    mdTitle(mdLink(section.title, section.url), 2) +
                    "\n\n" +
                    msg.join("\n\n")
                );
            }
        },
        clear: resetHTML,
        addComment: function(quotedText, anchor) {
            try { widget.removeChild(noCommentDiv); } catch(err) {}

            var commentGroup;
            for (group of commentGroups) {
                if (group.anchor == anchor) {
                    commentGroup = group;
                    break;
                }
            }
            if (!commentGroup) {
                commentGroup = CommentGroup(anchor, getAbsolutePos(widget), deleteGroup);
                commentGroups.push(commentGroup);
                widget.appendChild(commentGroup.htmlElement);
            }
            commentGroup.show();
            commentGroup.addComment(quotedText);
        },
    };
};
