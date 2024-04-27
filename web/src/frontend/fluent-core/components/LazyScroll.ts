import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, repeat } from '@microsoft/fast-element';

const styles: ElementStyles = css`

    :host {
        display: block;
        overflow-x: hidden;
        overflow-y: scroll;
    }
`;

const template: ViewTemplate<LazyScroll> = html`
    ${repeat(model => model.visibles, model => model.template)}
`;

@customElement({ name: 'fluent-lazy-scroll', template, styles })
export class LazyScroll extends FASTElement {

    override connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener('scroll', this.LoadNext);
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.removeEventListener('scroll', this.LoadNext);
    }

    private scrolling = false;
    @observable template: ViewTemplate;
    @observable visibles: unknown[] = [];
    @observable Items: unknown[];
    ItemsChanged() {
        this.visibles = [];
        this.LoadNext();
    }

    LoadNext = function(this: LazyScroll) {
        if(!this.scrolling) {
            this.scrolling = true;
            window.requestAnimationFrame(() => {
                if(this.scrollTop + this.clientHeight === this.scrollHeight) {
                    this.visibles = this.Items?.slice(0, this.visibles.length + 100) ?? [];
                }
                this.scrolling = false;
            });
        }
    }.bind(this);
}