function hideStonly() {
  const isHidden = !!document.getElementById("remove-stonly");
  if (!isHidden) {
    var style = document.createElement("style");
    style.id = "remove-stonly";
    style.type = "text/css";
    style.innerHTML = `
                .stn-wdgt{display:none;}
                .stonly-widget-trigger{display:none;}
                `;
    document.getElementsByTagName("head")[0].appendChild(style);
  }
}

function restoreStonly() {
  const el = document.getElementById("remove-stonly");
  if (el) {
    el.remove();
  }
}

const hideOrShow = () => {
  chrome.tabs.query(
    { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    function (tabs) {
      const [base] = /^.+?[^\/:](?=[?\/]|$)/.exec(tabs[0].url);
      chrome.storage.sync.get(
        ["shouldRemoveStonly"],
        function ({ shouldRemoveStonly = {} }) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: shouldRemoveStonly[base] ? hideStonly : restoreStonly,
          });
        }
      );
    }
  );
};

chrome.tabs.onActivated.addListener(hideOrShow);
chrome.storage.onChanged.addListener(hideOrShow);
