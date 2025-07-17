import { type ExecutionContext, html } from '@microsoft/fast-element';
import type { MediaContainer, MediaChild } from '../../../engine/providers/MediaPlugin';

// HACK: LazyScroll is a quick and dirty implementation, so the provided `ctx` is not correctly passed through
//       => CSS classes are not working, apply inline styles
//       => manually query correct host and provide callback function
export function CreateMediaItemTemplate<T extends MediaContainer<MediaChild>>(onSelectCallback: (entry: T) => void, canSelectCallback = (_entry: T) => true) {

    const styleEntry = [
        'height: var(--fontSizeBase600)',
        'padding: var(--spacingHorizontalXS)',
        'border - top: var(--strokeWidthThin) solid var(--colorNeutralStrokeSubtle)',
        'gap: var(--spacingHorizontalXS)',
        'display: grid',
        'align-items: center',
        'grid-template-rows: min-content',
        'grid-template-columns: min-content min-content 1fr',
        // HACK: => hovered cursor
        'cursor: pointer',
    ].join(';');

    const styleEntryDisabled = [
        styleEntry,
        'opacity: 0.5',
    ].join(';');

    const styleEntryIcon = [
        'margin-right: var(--spacingHorizontalXS)',
        'height: inherit',
    ].join(';');

    const styleEntryLabel = [
        'overflow: hidden',
        'white-space: nowrap',
        'text-overflow: ellipsis',
    ].join(';');

    const onMouseOver = (_model: T, ctx: ExecutionContext) => {
        const element = ctx.eventTarget<HTMLElement>();
        const color = '--colorNeutralBackground1Hover';
        element.style.backgroundColor = getComputedStyle(ctx.eventTarget()).getPropertyValue(color);
    };

    const onMouseOut = (_model: T, ctx: ExecutionContext) => {
        ctx.eventTarget<HTMLElement>().style.backgroundColor = '';
    };

    return html<T>`
        <div style="${model => canSelectCallback(model) ? styleEntry : styleEntryDisabled}" @mouseover="${onMouseOver}" @mouseout="${onMouseOut}" @click="${onSelectCallback}">
            <img style="${styleEntryIcon}" src="${model => model.Parent.Icon}"></img>
            <div style="${styleEntryLabel}">${model => model.Title}</div>
        </div>
    `;
}