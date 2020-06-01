export default class App {

    private _count: number = 0;

    constructor(root: HTMLElement) {
        for(let element of this.CreateApp()) {
            root.appendChild(element);
        }
    }

    private CreateApp(): HTMLElement[] {
        let container = this.CreateContainer();
        let header = this.CreateHeader('Hello PureJS Button');
        let button = this.CreateButton(`Clicked ${this._count} ${this._count === 1 ? 'time' : 'times'}`, this.Increment.bind(this));
        container.appendChild(header);
        container.appendChild(button);
        return [ container ];
    }

    private CreateContainer(): HTMLDivElement {
        let container = document.createElement('div');
        container.style.padding = '2em';
        container.style.textAlign = 'center';
        return container;
    }

    private CreateHeader(text: string): HTMLHeadingElement {
        let header = document.createElement('h3');
        header.textContent = text;
        return header;
    }

    private CreateButton(label: string, callback: (event: MouseEvent) => void): HTMLButtonElement {
        let button = document.createElement('button');
        button.style.padding = '0.5em';
        button.onclick = callback;
        button.textContent = label;
        return button;
    }

    private async Increment(event: MouseEvent): Promise<void> {
        let button = event.target as HTMLButtonElement;
        if(button) {
            this._count++;
            button.textContent = `Clicked ${this._count} ${this._count === 1 ? 'time' : 'times'}`;
        }
    }
}