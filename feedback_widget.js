var FeedbackWidget = function(section, wrapper) {
    var widget = Widget(section, section.id + "-feedback", wrapper);

    var noCommentDiv = widget.querySelector(".no-comment");
    if (!noCommentDiv) {
        noCommentDiv = document.createElement("div");
        noCommentDiv.className = "no-comment";
        noCommentDiv.innerHTML = (
            "Aucun commentaire pour le moment. <br>" +
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

    return {
        toMarkdown: function() {
            var comments = widget.querySelectorAll(".comment"),
                quote,
                msg = "";
            for (var comment of comments) {
                quote = comment.querySelector(".quote").innerText.split("\n");
                msg += (
                    "\n\n" +
                    "> " +
                    quote.join("\n> ") +
                    "\n\n" +
                    comment.querySelector(".feedback").value
                );
            }
            if (msg) {
                return (
                    mdTitle(mdLink(section.title, section.url), 2) +
                    msg
                );
            }
        },
        clear: resetHTML,
        quote: function(selectedText) {
            try {
                widget.removeChild(noCommentDiv);
            } catch(err) {}

            var comment = document.createElement("div");
            comment.className = "comment";
            comment.style.marginBottom = "20px";

            var quoteWrapper = document.createElement("div");
            quoteWrapper.style.display = "flex";
            quoteWrapper.style.overflow = "hidden";
            comment.appendChild(quoteWrapper);

            var deleteQuoteWrapper = document.createElement("div");
            quoteWrapper.appendChild(deleteQuoteWrapper);

            var deleteQuote = document.createElement("a");
            deleteQuote.href = "#";
            deleteQuote.title = "Supprimer le commentaire";
            deleteQuote.innerHTML = (
                '<img ' +
                'src="' + browser.extension.getURL("icons/delete.png") + '" ' +
                'alt="Supprimer le commentaire" />'
            );
            deleteQuoteWrapper.appendChild(deleteQuote);

            deleteQuote.addEventListener("click", function(e) {
                e.preventDefault();
                widget.removeChild(comment);
                if (!widget.querySelectorAll(".comment").length) {
                    widget.appendChild(noCommentDiv);
                }
            });

            var quote = document.createElement("blockquote");
            quote.className = "quote";
            quote.innerHTML = selectedText.split("\n").join("<br>");
            quote.style.flexGrow = "1";
            quote.style.color = "#777";
            quote.style.padding = "1px 2%";
            quote.style.borderLeft = "5px solid #ccc";
            quote.style.margin = "5px";
            quoteWrapper.appendChild(quote);

            var textarea = document.createElement("textarea");
            textarea.className = "feedback";
            textarea.style.height = "500px";
            comment.appendChild(textarea);

            widget.appendChild(comment);

            textarea.addEventListener("focus", function() {
                textarea.style.maxHeight = "150px";
                quoteWrapper.style.maxHeight = "none";
            });
            textarea.addEventListener("blur", function() {
                textarea.style.maxHeight = "20px";
                quoteWrapper.style.maxHeight = "35px";
            });
            textarea.focus();
        },
    };
};
