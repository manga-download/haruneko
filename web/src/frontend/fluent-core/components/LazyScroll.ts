import { FASTElement, type ViewTemplate, html, css, ref, observable, repeat } from '@microsoft/fast-element';

const styles = css`

    :host {
        display: block;
        overflow-x: hidden;
        overflow-y: scroll;
    }
`;

const template = html<LazyScroll>`
    ${repeat(model => model.visibles, model => model.Template)}
    <div ${ref('trigger')}></div>
`;

export class LazyScroll extends FASTElement {

    readonly trigger: HTMLDivElement;
    observer = new IntersectionObserver(([trigger]) => trigger.isIntersecting && this.LoadNext(100));

    override connectedCallback(): void {
        super.connectedCallback();
        this.observer.observe(this.trigger);
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.observer.disconnect();
    }

    @observable Template: ViewTemplate<unknown>;
    @observable visibles: unknown[] = [];
    @observable Items: unknown[];
    ItemsChanged() {
        this.visibles = [];
        this.LoadNext(100);
    }

    LoadNext = function(this: LazyScroll, count: number) {
        if (this.visibles.length < this.Items.length) {
            window.requestAnimationFrame(() => {
                this.visibles = this.Items?.slice(0, this.visibles.length + count) ?? [];
            });
        }
    }.bind(this);
}

LazyScroll.define({ name: 'fluent-lazy-scroll', template, styles });