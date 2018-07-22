console.log("background script running...");
var test = null;

var participants = [];

window.getParticipantsHtml = () => {
  return (
    '<ul class="list-group">' +
    participants
      .map((p, idx) => `<li class="list-group-item"><a id="participant_${idx}" href="#">${p}</a></li>`)
      .join("") +
    "</ul>"
  );
};

chrome.runtime.onConnect.addListener(function(port) {
  contentPort = port;
  console.assert(port.name == "contentToBkg");
  port.onMessage.addListener(function(msg) {
    var views = chrome.extension.getViews({
      type: "popup"
    });

    if (participants !== msg.participants) {
      participants = msg.participants;
      const outputHtml = window.getParticipantsHtml();
      for (var i = 0; i < views.length; i++) {
        views[i].document.getElementById("root").innerHTML = outputHtml;
        msg.participants.forEach((p, idx) =>
          views[i].document
            .getElementById("participant_" + idx)
            .addEventListener("click", () => window.switchPin(idx))
        );
      }
    } else {
      console.log('same difference, not updating')
    }
  });
});

window.switchPin = idx => {
  contentPort.postMessage({ switchTo: idx });
};
