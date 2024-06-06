import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, attr, when, ref } from '@microsoft/fast-element';
import type { TextField } from '@fluentui/web-components';
import S from '../services/StateService';

import IconSearch from '@vscode/codicons/src/icons/search.svg?raw';
import IconClear from '@vscode/codicons/src/icons/trash.svg?raw';
import IconCase from '@vscode/codicons/src/icons/case-sensitive.svg?raw';
import IconRegex from '@vscode/codicons/src/icons/regex.svg?raw';

const styles: ElementStyles = css`
    :host {
        display: block;
    }

    #searchpattern {
        display: block;
    }

    #searchpattern svg {
        height: 75%;
    }

    #searchpattern [slot="start"] {
        display: flex;
        align-items: center;
    }

    #searchpattern [slot="end"] {
        display: flex;
        align-items: center;
    }

    #searchpattern [slot="end"] fluent-button {
        height: fit-content;
    }
`;

const templateCaseSensivity: ViewTemplate<SearchBox> = html`
    <fluent-button appearance="${model => model.CaseEnabled ? 'outline' : 'stealth'}" title="${() => S.Locale.Frontend_FluentCore_SearchBox_CaseSenstiveToggleButton_Description()}" :innerHTML=${() => IconCase} @click=${model => model.CaseEnabled = !model.CaseEnabled}></fluent-button>
`;

const templateRegularExpression: ViewTemplate<SearchBox> = html`
    <fluent-button appearance="${model => model.RegexEnabled ? 'outline' : 'stealth'}" title="${() => S.Locale.Frontend_FluentCore_SearchBox_CaseRegularExpressionToggleButton_Description()}" :innerHTML=${() => IconRegex} @click=${model => model.RegexEnabled = !model.RegexEnabled}></fluent-button>
`;

const template: ViewTemplate<SearchBox> = html`
    <fluent-text-field id="searchpattern" ${ref('control')} appearance="outline" placeholder="${model => model.placeholder}" :value=${model => model.Needle} @input=${(model, ctx) => model.Needle = ctx.event.currentTarget['value']}>
        <div slot="start" :innerHTML=${() => IconSearch}></div>
        <div slot="end">
            <fluent-button appearance="stealth" title="${() => S.Locale.Frontend_FluentCore_SearchBox_ClearButton_Description()}" :innerHTML=${() => IconClear} @click=${model => model.Needle = ''}></fluent-button>
            ${when(model => model.AllowCase, templateCaseSensivity)}
            ${when(model => model.AllowRegex, templateRegularExpression)}
        </div>
    </fluent-text-field>
`;

@customElement({ name: 'fluent-searchbox', template, styles })
export class SearchBox extends FASTElement {

    private readonly event = 'predicate';
    readonly control: TextField;

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

    private UpdatePredicate() {
        try {
            if(!this.Needle) {
                this.$emit(this.event, () => true);
            } else {
                if(this.AllowRegex && this.RegexEnabled) {
                    const regex = new RegExp(this.Needle, this.AllowCase && this.CaseEnabled ? undefined : 'i');
                    this.$emit(this.event, (text: string) => regex.test(text));
                } else {
                    if(this.AllowCase && this.CaseEnabled ) {
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