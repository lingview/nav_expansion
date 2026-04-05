const frame = document.getElementById('contentFrame');

chrome.storage.local.get(['redirectUrl', 'bgColor'], (result) => {
  const url = result.redirectUrl?.trim() || 'https://nav.lingview.xyz';
  const bg  = result.bgColor || '#ffffff';

  localStorage.setItem('bgColor', bg);

  frame.addEventListener('load', () => {
    frame.classList.add('loaded');
  }, { once: true });

  frame.src = url;
});