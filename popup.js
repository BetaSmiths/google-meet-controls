console.log('popup js loaded')
// console.log(chrome.extension.getBackgroundPage())
// chrome.extension.getBackgroundPage().testing()

const initHtml = chrome.extension.getBackgroundPage().getParticipantsHtml()
console.log(initHtml)
document.getElementById("root").innerHTML = initHtml;