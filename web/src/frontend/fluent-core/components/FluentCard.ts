import { FASTElement, html, css } from '@microsoft/fast-element';

const styles = css`
    :host {
        box-shadow: var(--shadow4);
        border-radius: var(--borderRadiusLarge);
    }

    slot {
        display: content;
    }
`;

const template = html<FluentCard>`<slot></slot>`;

export class FluentCard extends FASTElement {}

FluentCard.define({ name: 'fluent-card', template, styles });