console.log("Injecting Meetup Script");

var port = chrome.runtime.connect({ name: "contentToBkg" });

port.onMessage.addListener(function(msg) {
  console.log("switch requested", msg);
  if ($("div:contains('(You)')")) {
    var idx = msg.switchTo;
    if (idx === 0) {
      $("div:contains('(You)')")
        .parents()
        .eq(5)
        .children()
        .eq(0)
        .find("div[role='button']")
        .first()
        .trigger("click");
    } else {
      $("div:contains('(You)')")
        .parents()
        .eq(5)
        .children()
        .eq(1)
        .children()
        .eq(idx - 1)
        .find("div[role='button']")
        .first()
        .trigger("click");
    }
  }
});

// Select the node that will be observed for mutations
var targetNode = document.documentElement;

// Options for the observer (which mutations to observe)
var config = { attributes: true, childList: true, subtree: true };

var found = false;

var lastUpdate = new Date();

// Callback function to execute when mutations are observed
var callback = function(mutationsList) {
  if ($("div:contains('People')").length > 0) {
    var elem = $("div:contains('People')")
      .parents()
      .eq(4);

    // TODO: use a listener for only when this changes

    if (
      $("div:contains('(You)')").last().length > 0 &&
      new Date() - lastUpdate > 1000
    ) {
      port.postMessage({
        participants: $(
          "." +
            $("div:contains('(You)')")
              .last()[0]
              .className.split(" ")
              .join(".")
        )
          .toArray()
          .map(x => x.innerText)
      });
      lastUpdate = new Date();
    }

    if (!found && $("div:contains('(You)')")) {
      found = true;
      // elem.css("visibility", "hidden");
    }
  }
};

// Create an observer instance linked to the callback function
var observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);
