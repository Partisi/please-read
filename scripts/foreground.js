// this is the frontend
console.log("from foreground")
//document.querySelector("#hplogo").classList.add("spinspinspin")


let first = document.createElement("button")
first.innerText = "SET DATA"
first.id = "first"

let second = document.createElement("button")
second.innerText = "SHOUT TO BACKEND"
second.id = "second"

document.querySelector('body').appendChild(first)
document.querySelector('body').appendChild(second)

first.addEventListener('click', () => {
    chrome.storage.local.set({ 'password': '123' })
    console.log("i set data")
})

// sends the message to the background
second.addEventListener('click', () => {
    chrome.runtime.sendMessage({ message: 'yo check the storage' })
    console.log("i sent the message")
})

// listens for a response from the backend
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request.message)
})