import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, ref } from '@microsoft/fast-element';

const styles: ElementStyles = css`
    :host {
        display: contents;
    }
`;

const template: ViewTemplate<FluentNumberField> = html`
    <input ${ref('input')} type="number" style="padding: 0.5em;" min=${model => model.min} max=${model => model.max} value=${model => model.valueAsNumber.toString()} @change=${(model, _) => model.DispatchChangeEvent()}></input>
`;

@customElement({ name: 'fluent-number-field', template, styles })
export class FluentNumberField extends FASTElement {
    readonly input: HTMLInputElement;
    @observable min: number;
    @observable max: number;
    @observable valueAsNumber: number = 0;
    public DispatchChangeEvent() {
        const value = Math.max(this.min, Math.min(this.max, parseInt(this.input.value)));
        if(value != this.valueAsNumber) {
            this.valueAsNumber = value;
            const event = new Event('change', {bubbles: true, cancelable: false, composed: false });
            Object.defineProperty(event, 'target', { value: this });
            this.dispatchEvent(event);
        }
    }
}