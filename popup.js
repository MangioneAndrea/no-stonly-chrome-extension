const urlSpan = document.getElementById("url");
const activeSpan = document.getElementById("isActive");
const button = document.getElementById("activate");

const updateUi = () =>
  chrome.tabs.query(
    { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    function (tabs) {
      const [base] = /^.+?[^\/:](?=[?\/]|$)/.exec(tabs[0].url);
      urlSpan.innerHTML = base;

      chrome.storage.sync.get(
        ["shouldRemoveStonly"],
        function ({ shouldRemoveStonly = {} }) {
          const isCurrentActive = !!shouldRemoveStonly[base];
          if (isCurrentActive) {
            activeSpan.innerHTML = "enabled";
            activeSpan.classList.add("enabled");
            button.innerHTML = "Show stonly again";
          } else {
            activeSpan.innerHTML = "disabled";
            activeSpan.classList.remove("enabled");
            button.innerHTML = "Hide stonly";
          }
          hideOrShow(tabs[0].id);
        }
      );
    }
  );

updateUi();

button.addEventListener("click", async () => {
  chrome.tabs.query(
    { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    function (tabs) {
      const [base] = /^.+?[^\/:](?=[?\/]|$)/.exec(tabs[0].url);
      urlSpan.innerHTML = base;

      chrome.storage.sync.get(
        ["shouldRemoveStonly"],
        function ({ shouldRemoveStonly = {} }) {
          chrome.storage.sync.set(
            {
              shouldRemoveStonly: {
                ...shouldRemoveStonly,
                [base]: !shouldRemoveStonly[base],
              },
            },
            function () {
              updateUi();
            }
          );
        }
      );
    }
  );
});
