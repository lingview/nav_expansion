const bg = localStorage.getItem('bgColor') || '#858585';
document.getElementById('theme').textContent = `
  html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; background: ${bg}; }
  iframe { width: 100%; height: 100%; border: none; display: block; opacity: 0; transition: opacity 0.15s ease; }
  iframe.loaded { opacity: 1; }
`;