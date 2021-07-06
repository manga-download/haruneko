export default class App {

    private _count = 0;

    constructor(root: HTMLElement) {
        for(const element of this.CreateApp()) {
            root.appendChild(element);
        }
    }

    private CreateApp(): HTMLElement[] {
        const container = this.CreateContainer();
        const header = this.CreateHeader('Hello PureJS Button');
        const button = this.CreateButton(`Clicked ${this._count} ${this._count === 1 ? 'time' : 'times'}`, this.Increment.bind(this));
        container.appendChild(header);
        container.appendChild(button);
        return [ container ];
    }

    private CreateContainer(): HTMLDivElement {
        const container = document.createElement('div');
        container.style.height = '100%';
        container.style.padding = '2em';
        container.style.textAlign = 'center';
        container.style.backgroundColor = 'lightgrey';
        return container;
    }

    private CreateHeader(text: string): HTMLHeadingElement {
        const header = document.createElement('h3');
        header.textContent = text;
        return header;
    }

    private CreateButton(label: string, callback: (event: MouseEvent) => void): HTMLButtonElement {
        const button = document.createElement('button');
        button.style.padding = '0.5em';
        button.onclick = callback;
        button.textContent = label;
        return button;
    }

    private async Increment(event: MouseEvent): Promise<void> {
        const button = event.target as HTMLButtonElement;
        if(button) {
            this._count++;
            button.textContent = `Clicked ${this._count} ${this._count === 1 ? 'time' : 'times'}`;
        }
    }
}