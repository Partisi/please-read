// gets executed exactly when extension is refreshed or installed
console.log("in background")
let active_tab_id = 0

// this is the background
chrome.tabs.onActivated.addListener(tab => {
    chrome.tabs.get(tab.tabId, current_tab_info => {
        active_tab_id = tab.tabId
        console.log(current_tab_info.url)
        if (/^https:\/\/www\.google/.test(current_tab_info.url)) {

            //chrome.tabs.insertCSS(null, { file: "./main.css" })

            chrome.tabs.executeScript(null, // null means to pass script into active tab
                { file: './scripts/foreground.js' },
                () => console.log("injected!")
            )


        }
    })
})

// listens for a messge sent by the frontend
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'yo check the storage') {

        // sends response back to that id
        chrome.tabs.sendMessage(active_tab_id, { message: 'yo i got your message' })

        // reads the password in the local storage
        chrome.storage.local.get("password", value => {
            console.log(value)
        })
    }
})

////////////////////////////////////////////////////////////

chrome.runtime.onMessage.addListener(async function (message, sender) {
    if (message.loginBttnTriggered) {
        const token = await chrome.identity.getAuthToken({ interactive: true })
        chrome.runtime.sendMessage({ auth: true, data: { token: token } })
    }
});