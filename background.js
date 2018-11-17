browser.pageAction.onClicked.addListener(() => {
    browser.tabs.executeScript({
        file: "shared.js"
    });
    browser.tabs.executeScript({
        file: "widget.js"
    });
    browser.tabs.executeScript({
        file: "feedback_widget.js"
    });
    browser.tabs.executeScript({
        file: "toolbar.js"
    });
    browser.tabs.executeScript({
        file: "main.js"
    });
});
