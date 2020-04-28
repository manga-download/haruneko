function CreateItem(label: string, callback: () => void): HTMLLIElement {
    let anchor = document.createElement('a');
    anchor.href = '#';
    anchor.text = label;
    anchor.onclick = callback;
    let li = document.createElement('li');
    li.appendChild(anchor);
    return li;
}

function CreateList(): HTMLUListElement {
    let list = document.createElement('ul');
    list.appendChild(CreateItem('About', window.Playground.About));
    list.appendChild(CreateItem('FetchHeadersTest', window.Playground.FetchHeadersTest));
    return list;
}

function CreateHeader(): HTMLHeadingElement {
    let header = document.createElement('h3');
    header.style.marginLeft = '0.5em';
    header.textContent = 'HakuNeko NW.js (Prototype)';
    return header;
}

function CreateApp(): HTMLElement[] {
    let header = CreateHeader();
    let list = CreateList();
    return [header, list];
}

export default async function (root: HTMLElement): Promise<void> {
    // artificial delay to make loading screen visible
    await new Promise(resolve => setTimeout(resolve, 1500));
    for(let element of CreateApp()) {
        root.appendChild(element);
    }
}