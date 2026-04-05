const PRESETS = [
  { color: '#ffffff', label: '白色' },
  { color: '#f5f5f5', label: '浅灰' },
  { color: '#1a1a2e', label: '深蓝黑' },
  { color: '#0f0f0f', label: '纯黑' },
  { color: '#fafafa', label: '米白' },
  { color: '#1e1e1e', label: '深灰' },
  { color: '#2b2b2b', label: 'VS Code灰' },
  { color: '#f0f4f9', label: '谷歌蓝灰' },
];

const urlInput    = document.getElementById('urlInput');
const colorPicker = document.getElementById('colorPicker');
const presetsEl   = document.getElementById('presets');
const saveBtn     = document.getElementById('saveBtn');
const status      = document.getElementById('status');

PRESETS.forEach(({ color, label }) => {
  const el = document.createElement('div');
  el.className = 'preset';
  el.title = label;
  el.style.backgroundColor = color;
  el.addEventListener('click', () => {
    colorPicker.value = color;
    document.querySelectorAll('.preset').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
  });
  presetsEl.appendChild(el);
});

chrome.storage.local.get(['redirectUrl', 'bgColor'], (result) => {
  urlInput.value    = result.redirectUrl || '';
  colorPicker.value = result.bgColor     || '#ffffff';

  document.querySelectorAll('.preset').forEach(p => {
    if (p.style.backgroundColor === hexToRgb(colorPicker.value)) {
      p.classList.add('active');
    }
  });
});

colorPicker.addEventListener('input', () => {
  document.querySelectorAll('.preset').forEach(p => p.classList.remove('active'));
});

saveBtn.addEventListener('click', () => {
  const url = urlInput.value.trim();
  const bg  = colorPicker.value;

  if (!url) return showStatus('请输入有效的 URL', 'red');
  if (!/^https?:\/\//i.test(url)) return showStatus('URL 必须以 http:// 或 https:// 开头', 'red');

  chrome.storage.local.set({ redirectUrl: url, bgColor: bg }, () => {
    chrome.storage.sync.set({ redirectUrl: url, bgColor: bg });
    localStorage.setItem('bgColor', bg);
    showStatus('保存成功！', 'green');
  });
});

function showStatus(msg, color) {
  status.textContent  = msg;
  status.style.color  = color;
  setTimeout(() => status.textContent = '', 2000);
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}