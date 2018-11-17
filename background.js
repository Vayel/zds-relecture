browser.pageAction.onClicked.addListener(() => {
    browser.tabs.executeScript({
        file: "edit_ui.js"
    });
});
