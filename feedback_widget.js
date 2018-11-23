var FeedbackWidget = function(section, wrapper) {
    var widget = Widget(section.element, section.id + "-feedback", wrapper);

    if (!widget.innerHTML) {
        var label = document.createElement("div");
        label.innerHTML = section.title;
        label.style.fontWeight = "bold";
        label.style.marginBottom = "20px";
        widget.appendChild(label);
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
        clear: function() { widget.innerHTML = ""; },
        quote: function(selectedText) {
            var comment = document.createElement("div");
            comment.className = "comment";
            comment.style.marginBottom = "20px";

            var quoteWrapper = document.createElement("div");
            quoteWrapper.style.display = "flex";
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
            comment.appendChild(textarea);
            textarea.focus();

            widget.appendChild(comment);
        },
    };
};
