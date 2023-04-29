// gets executed exactly when extension is refreshed or installed

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js'

// If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-analytics.js'

// Add Firebase products that you want to use
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js'

try {
    // you need to manually have firebase-compat.js file in your dir


    var config = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    };
    initializeApp(config);
    const myFirestore = getFirestore()
    console.log(myFirestore)

    const myAuth = getAuth()
    chrome.runtime.onMessage.addListener(function (request, sender) {
        if (request.command === "post") {
            // in here, you can use both firebase and data from popup view
            console.log(request.data);
            return true;
        }
    });
} catch (e) {
    console.error(e);
}



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