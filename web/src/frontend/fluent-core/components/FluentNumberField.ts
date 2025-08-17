import { FASTElement, html, css, attr, ref } from '@microsoft/fast-element';

const styles = css`
    :host {
        display: contents;
    }
`;

const template = html<FluentNumberField>`
    <input ${ref('input')} type="number" style="padding: 0.5em;" min=${model => model.min} max=${model => model.max} value=${model => model.value.toString()} @change=${(model, _) => model.DispatchChangeEvent()}></input>
`;

export class FluentNumberField extends FASTElement {
    readonly input: HTMLInputElement;
    @attr min: number;
    @attr max: number;
    @attr value: number = 0;
    public DispatchChangeEvent() {
        const value = Math.max(this.min, Math.min(this.max, parseInt(this.input.value)));
        if(value != this.value) {
            this.value = value;
            const event = new Event('change', {bubbles: true, cancelable: false, composed: false });
            Object.defineProperty(event, 'target', { value: this });
            this.dispatchEvent(event);
        }
    }
}

FluentNumberField.define({ name: 'fluent-number-field', template, styles });