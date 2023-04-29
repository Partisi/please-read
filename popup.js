// Handle Login Bttn Clicked
document.getElementById("auth-bttn").addEventListener("click", function (e) {
    chrome.runtime.sendMessage({ 'loginBttnTriggered': true });
})

// Handle Logout Bttn Clicked
document.getElementById("logout-bttn").addEventListener("click", async function (e) {

    const res = await chrome.identity.getAuthToken({ interactive: false })

    var url = 'https://accounts.google.com/o/oauth2/revoke?token=' + res.token;
    window.fetch(url)

    await chrome.identity.removeCachedAuthToken({ token: res.token })
    updatePopupBasedOnAuth(false)
})

chrome.runtime.onMessage.addListener(function (message, sender) {
    if (message.auth) {
        updatePopupBasedOnAuth(message.data.token.token)
    } else {
        updatePopupBasedOnAuth(false)
    }
});

// Popup Initially Mounted
const popupMounted = async () => {
    await getUserAuth()
}

// Updates the UI/UX for popup based on auth
function updatePopupBasedOnAuth(token) {
    console.log("updating log auth...", token)
    if (!!token) { // logged in
        document.getElementById("status").innerHTML = token
        document.getElementById("logout-bttn").style.display = "block"
        document.getElementById("auth-bttn").style.display = "none"
    } else { // auth not exist
        document.getElementById("status").innerHTML = ""
        document.getElementById("logout-bttn").style.display = "none"
        document.getElementById("auth-bttn").style.display = "block"
    }
}

async function getUserAuth() {
    console.log("getting user...")
    await chrome.identity.getAuthToken({ interactive: false }, function (token) {
        if (!token) {
            if (chrome.runtime.lastError.message.match(/not signed in/)) {
                console.log("not singed in");
            } else {
                console.log("singed in");
            }
        } else {}
            console.log("have user...", token)
            updatePopupBasedOnAuth(token)
    })
}

popupMounted()