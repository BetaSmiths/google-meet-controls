console.log("background script running...");
var test = null;


chrome.runtime.onConnect.addListener(function(port) {
  test = port
  console.log("port", port);
  console.assert(port.name == "contentToBkg");
  port.onMessage.addListener(function(msg) {
    var views = chrome.extension.getViews({
      type: "popup"
    });

    var outputHtml =
      "<ul>" +
      msg.participants
        .map(
          (p, idx) => `<li><a id="participant_${idx}" href="#">${p}</a></li>`
        )
        .join("") +
      "</ul>";
    console.log("updated list", outputHtml);
    for (var i = 0; i < views.length; i++) {
      views[i].document.getElementById("root").innerHTML = outputHtml;
      msg.participants.forEach((p, idx) =>
        views[i].document.getElementById("participant_" + idx).addEventListener('click', () => window.switchPin(idx))
      );
    }
  });
});

window.switchPin = idx => {
  test.postMessage({switchTo: idx})
};
