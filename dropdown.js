
window.onload = () => {
  getData()
  chrome.storage.onChanged.addListener((changes, namespace) => getData());
};

const formatter = (bytes, decimals = 6) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

document.addEventListener('DOMContentLoaded', () => {
  const link = document.getElementById('link');
  link.addEventListener('click', () => chrome.tabs.create({ active: true, url: "http://visir.is" }));
});

const getData = () => {
  chrome.storage.sync.get(['data','days'], ({ data, days}) => {
    let formatData = formatter(data);
    let totalOverYear=(365/days) * data;
    let yearData =formatter(totalOverYear);
    document.getElementById('data').innerHTML ="So far you have used "+ formatData+" of data";
    document.getElementById('yearData').innerHTML="In one year that's "+yearData+" of data.";
  })
};
