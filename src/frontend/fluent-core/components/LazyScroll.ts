import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, repeat, ref } from '@microsoft/fast-element';

const styles: ElementStyles = css`

    :host {
        display: block;
        overflow-x: hidden;
        overflow-y: scroll;
    }
`;

const template: ViewTemplate<LazyScroll> = html`
    ${repeat(model => model.visibles, model => html`${model.template}`)}
`;

@customElement({ name: 'fluent-lazy-scroll', template, styles })
export class LazyScroll extends FASTElement {

    constructor() {
        super();
        this.addEventListener('scroll', this.LoadNext);
    }

    private scrolling = false;
    @observable template: ViewTemplate;
    @observable visibles: unknown[] = [];
    @observable items: unknown[];
    itemsChanged() {
        this.visibles = [];
        this.LoadNext();
    }

    LoadNext = function(this: LazyScroll) {
        if(!this.scrolling) {
            this.scrolling = true;
            window.requestAnimationFrame(() => {
                if(this.scrollTop + this.clientHeight === this.scrollHeight) {
                    //console.log('Scroll:', 'next', this.visibles.length, this.items?.length);
                    this.visibles = this.items?.slice(0, this.visibles.length + 100) ?? [];
                }
                this.scrolling = false;
            });
        }
    }.bind(this);
}