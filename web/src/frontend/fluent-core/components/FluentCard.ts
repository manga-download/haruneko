import { FASTElement, type ViewTemplate, type ElementStyles, html, css } from '@microsoft/fast-element';

const styles: ElementStyles = css`
    :host {
        box-shadow: var(--shadow4);
        border-radius: var(--borderRadiusLarge);
    }

    slot {
        display: content;
    }
`;

const template: ViewTemplate<FluentCard> = html`
    <slot></slot>
`;

export class FluentCard extends FASTElement {}

FluentCard.define({ name: 'fluent-card', template, styles });