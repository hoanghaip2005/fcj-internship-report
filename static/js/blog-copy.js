(() => {
  document.addEventListener('copy', (event) => {
    const article = document.getElementById('body-inner');
    const selection = window.getSelection();
    if (!article || !selection || selection.isCollapsed || !event.clipboardData || !selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    if (!article.contains(range.startContainer) || !article.contains(range.endContainer)) return;
    const fragment = range.cloneContents();
    fragment.querySelectorAll('script, style, button, .copy-to-clipboard, img').forEach((node) => node.remove());
    const blocks = new Set(['P', 'DIV', 'SECTION', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'PRE']);
    function plain(node) {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent;
      if (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return '';
      if (node.nodeName === 'BR') return '\n';
      const content = Array.from(node.childNodes, plain).join('');
      if (node.nodeName === 'LI') {
        const parent = node.parentElement;
        const ordered = parent && parent.nodeName === 'OL';
        const index = ordered ? Array.from(parent.children).indexOf(node) + (Number(parent.getAttribute('start')) || 1) : 0;
        return '\n' + (ordered ? index + '. ' : '• ') + content.trim() + '\n';
      }
      if (node.nodeName === 'UL' || node.nodeName === 'OL' || blocks.has(node.nodeName)) return '\n\n' + content.trim() + '\n\n';
      return content;
    }
    const text = plain(fragment).replace(/\u00a0/g, ' ').replace(/[ \t]+\n/g, '\n').replace(/\n[ \t]+/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    if (!text) return;
    event.clipboardData.clearData();
    event.clipboardData.setData('text/plain', text);
    event.preventDefault();
  });
})();
