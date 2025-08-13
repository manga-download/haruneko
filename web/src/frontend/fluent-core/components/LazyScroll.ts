import { FASTElement, type ViewTemplate, html, css, observable, repeat } from '@microsoft/fast-element';

const styles = css`

    :host {
        display: block;
        overflow-x: hidden;
        overflow-y: scroll;
    }
`;

const template = html<LazyScroll>`
    <template>
        ${repeat(model => model.visibles, model => model.template)}
    </template>
`;

export class LazyScroll extends FASTElement {

    override connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener('scroll', this.LoadNext, { passive: true });
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.removeEventListener('scroll', this.LoadNext);
    }

    private scrolling = false;
    @observable template: ViewTemplate<unknown>;
    @observable visibles: JSONArray = [];
    @observable Items: JSONArray;
    @observable Pagination = 100;
    ItemsChanged() {
        this.visibles = [];
        this.LoadNext();
    }

    LoadNext = function(this: LazyScroll) {
        if(!this.scrolling) {
            this.scrolling = true;
            window.requestAnimationFrame(() => {
                if(this.scrollTop + this.clientHeight === this.scrollHeight) {
                    this.visibles = this.Items?.slice(0, this.visibles.length + this.Pagination) ?? [];
                }
                this.scrolling = false;
            });
        }
    }.bind(this);
}

LazyScroll.define({ name: 'fluent-lazy-scroll', template, styles });