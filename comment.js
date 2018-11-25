var Comment = function(quotedText, deleteCb) {
    var comment = document.createElement("div");
    comment.className = "comment";
    comment.style.marginBottom = "20px";
    comment.style.overflow = "hidden";

    var quoteWrapper = document.createElement("div");
    quoteWrapper.style.display = "flex";
    quoteWrapper.style.width = "100%";
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
        deleteCb(comment);
    });

    var quoteLink = document.createElement("a");
    quoteLink.href = "#";
    quoteLink.style.textDecoration = "none";
    quoteWrapper.appendChild(quoteLink);

    var quote = document.createElement("blockquote");
    quote.className = "quote";
    quote.innerHTML = quotedText.split("\n").join("<br>");
    quote.style.flexGrow = "1";
    quote.style.color = "#777";
    quote.style.padding = "1px 2%";
    quote.style.borderLeft = "5px solid #ccc";
    quote.style.margin = "5px";
    quote.style.width = "100%";
    quoteLink.appendChild(quote);

    var textarea = document.createElement("textarea");
    textarea.className = "feedback";
    textarea.style.height = "100px";
    comment.appendChild(textarea);

    function show() {
        comment.style.maxHeight = "none";
        textarea.focus();
    }

    function hide() {
        comment.style.maxHeight = "35px";
    }

    quote.addEventListener("click", function(e) {
        e.preventDefault();
        show();
    });
    textarea.addEventListener("blur", hide);

    return {
        quotedText: quotedText,
        htmlElement: comment,
        show: show,
        hide: hide,
        toMarkdown: function() {
            return (
                "> " +
                quotedText.split("\n").join("\n> ") +
                "\n\n" +
                textarea.value
            );
        },
    };
};
