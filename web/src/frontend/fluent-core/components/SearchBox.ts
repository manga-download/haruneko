import { FASTElement, html, css, observable, attr, when, ref } from '@microsoft/fast-element';
import type { TextInput } from '@fluentui/web-components';
import { LocalizationProviderRegistration, type ILocalizationProvider } from '../services/LocalizationProvider';

import IconSearch from '@vscode/codicons/src/icons/search.svg?raw';
import IconClear from '@vscode/codicons/src/icons/trash.svg?raw';
import IconCase from '@vscode/codicons/src/icons/case-sensitive.svg?raw';
import IconRegex from '@vscode/codicons/src/icons/regex.svg?raw';

const styles = css`
    :host {
        display: block;
    }

    #searchpattern {
        display: block;
        max-width: unset !important;
    }

    #searchpattern [slot="start"] svg {
        height: 1em;
    }

    #searchpattern [slot="start"] {
        display: flex;
        align-items: center;
    }

    #searchpattern [slot="end"] {
        display: flex;
        align-items: center;
    }
`;

const templateCaseSensivity = html<SearchBox>`
    <fluent-button icon-only size="small" appearance="${model => model.CaseEnabled ? 'outline' : 'transparent'}" title="${model => model.Localization.Locale.Frontend_FluentCore_SearchBox_CaseSenstiveToggleButton_Description()}" :innerHTML=${() => IconCase} @click=${model => model.CaseEnabled = !model.CaseEnabled}></fluent-button>
`;

const templateRegularExpression = html<SearchBox>`
    <fluent-button icon-only size="small" appearance="${model => model.RegexEnabled ? 'outline' : 'transparent'}" title="${model => model.Localization.Locale.Frontend_FluentCore_SearchBox_CaseRegularExpressionToggleButton_Description()}" :innerHTML=${() => IconRegex} @click=${model => model.RegexEnabled = !model.RegexEnabled}></fluent-button>
`;

const template = html<SearchBox>`
    <fluent-text-input id="searchpattern" ${ref('searchpattern')} appearance="outline" placeholder="${model => model.placeholder}" :value=${model => model.Needle} @input=${(model, ctx) => model.Needle = ctx.eventTarget<TextInput>().value}>
        <div slot="start" :innerHTML=${() => IconSearch}></div>
        <div slot="end">
            <fluent-button icon-only size="small" appearance="transparent" title="${model => model.Localization.Locale.Frontend_FluentCore_SearchBox_ClearButton_Description()}" :innerHTML=${() => IconClear} @click=${model => model.Needle = ''}></fluent-button>
            ${when(model => model.AllowCase, templateCaseSensivity)}
            ${when(model => model.AllowRegex, templateRegularExpression)}
        </div>
    </fluent-text-input>
`;

export class SearchBox extends FASTElement {

    @LocalizationProviderRegistration Localization: ILocalizationProvider;
    private readonly event = 'predicate';
    readonly searchpattern: FASTElement;

    @attr placeholder = '';

    @observable Needle = '';
    NeedleChanged() {
        this.UpdatePredicate();
    }

    @attr({ mode: 'boolean' }) AllowCase = false;
    AllowCaseChanged() {
        this.UpdatePredicate();
    }
    @observable CaseEnabled = false;
    CaseEnabledChanged() {
        this.UpdatePredicate();
    }

    @attr({ mode: 'boolean' }) AllowRegex = false;
    AllowRegexChanged() {
        this.UpdatePredicate();
    }
    @observable RegexEnabled = false;
    RegexEnabledChanged() {
        this.UpdatePredicate();
    }

    public Focus(): void {
        return this.searchpattern.focus();
    }

    private UpdatePredicate() {
        try {
            if (!this.Needle) {
                this.$emit(this.event, () => true);
            } else {
                if (this.AllowRegex && this.RegexEnabled) {
                    // TODO: Prevent ReDoS by input validation or sanitization
                    const regex = new RegExpSafe(this.Needle, this.AllowCase && this.CaseEnabled ? undefined : 'i');
                    this.$emit(this.event, (text: string) => regex.test(text));
                } else {
                    if (this.AllowCase && this.CaseEnabled) {
                        this.$emit(this.event, (text: string) => text.includes(this.Needle));
                    } else {
                        const lcNeedle = this.Needle.toLocaleLowerCase();
                        this.$emit(this.event, (text: string) => text.toLowerCase().includes(lcNeedle));
                    }
                }
            }
        } catch {
            // ignore errors
        }
    }
}

SearchBox.define({ name: 'fluent-searchbox', template, styles });