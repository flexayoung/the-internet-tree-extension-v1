let helper;
  
const clearData = () => {
    chrome.storage.sync.set({ "lastCleared": Date.now() });
    chrome.storage.sync.get("days",({days})=>{
        days++;
        chrome.storage.sync.set({ "days":days});
    })
}

chrome.storage.sync.get("lastCleared", ({ lastCleared }) => {
    const date = new Date(lastCleared);
    const now = new Date();
    if (date.getDate() !== now.getDate()) {
        clearData();
    }
});

const initialSetup = () =>
    chrome.storage.sync.set({ "data": helper }, () => chrome.storage.sync.get('data', ({ data }) => {
        console.log("data: ", data);
        console.log("helper: ", helper);
    }));

setInterval(initialSetup, 3000);

const resetAlarm = () => {
    const midnight = new Date().setHours(24, 0, 0, 0);
    chrome.alarms.create({ when: midnight});
}
resetAlarm();

chrome.alarms.onAlarm.addListener(() => {
    clearData();
    resetAlarm();
})

chrome.storage.sync.get("data", ({ data }) => {
    helper = data || 0;
});

const headersListener = (headers) => {
    const responseHeadersContentLength = headers.responseHeaders.find(element => element.name.toLowerCase() === "content-length");
    const contentLength = undefined === responseHeadersContentLength ? { value: 0 }
        : responseHeadersContentLength;
    const requestSize = parseInt(contentLength.value, 10);

    if (headers.fromCache || requestSize === 0) return;
    console.log("Headers url: ", headers.url);
    console.log("requestSize: ", requestSize);

    chrome.storage.sync.get("data", ({ data }) => {
        helper += requestSize;
    });
};

chrome.runtime.onInstalled.addListener(() =>
    chrome.storage.sync.set({ "data": 0,"days":1 }, () => console.log("reset"))
);

chrome.webRequest.onCompleted.addListener(
    headersListener,
    { urls: ['<all_urls>'] },
    ['responseHeaders']
);
