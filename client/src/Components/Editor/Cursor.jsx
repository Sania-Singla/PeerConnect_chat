export default function getCursor(color = '#ff0000', name = 'Unknown User') {
    const wrapper = document.createElement('span');
    wrapper.style.position = 'relative';

    const cursorEl = document.createElement('span');
    cursorEl.style.width = '0.1em';
    cursorEl.style.height = '1.3em';
    cursorEl.style.backgroundColor = color;
    cursorEl.style.position = 'absolute';
    cursorEl.style.top = '0';
    cursorEl.style.left = '0';
    cursorEl.style.zIndex = '10';

    const label = document.createElement('span');
    label.innerText = name;
    label.style.position = 'absolute';
    label.style.top = '-1.1em';
    label.style.left = '0';
    label.style.fontSize = '0.6rem';
    label.style.background = color;
    label.style.color = '#fff';
    label.style.padding = '1px 5px';
    label.style.borderRadius = '3px 3px 3px 0';
    label.style.whiteSpace = 'nowrap';
    label.style.zIndex = '11';

    wrapper.appendChild(cursorEl);
    wrapper.appendChild(label);

    return wrapper;
}
