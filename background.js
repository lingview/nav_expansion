chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['bgColor'], (result) => {
    if (!result.bgColor) {
      chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
    }
  });
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
});