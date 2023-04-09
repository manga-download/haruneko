import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, attr, when } from '@microsoft/fast-element';
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
    <fluent-button appearance="${model => model.caseenabled ? 'outline' : 'stealth'}" title="${() => S.Locale.Frontend_FluentCore_SearchBox_CaseSenstiveToggleButton_Description()}" :innerHTML=${IconCase} @click=${model => model.caseenabled = !model.caseenabled}></fluent-button>
`;

const templateRegularExpression: ViewTemplate<SearchBox> = html`
    <fluent-button appearance="${model => model.regexenabled ? 'outline' : 'stealth'}" title="${() => S.Locale.Frontend_FluentCore_SearchBox_CaseRegularExpressionToggleButton_Description()}" :innerHTML=${IconRegex} @click=${model => model.regexenabled = !model.regexenabled}></fluent-button>
`;

const template: ViewTemplate<SearchBox> = html`
    <fluent-text-field id="searchpattern" appearance="outline" placeholder="${model => model.placeholder}" :value=${model => model.needle} @input=${(model, ctx) => model.needle = ctx.event.currentTarget['value']}>
        <div slot="start" :innerHTML=${IconSearch}></div>
        <div slot="end">
            <fluent-button appearance="stealth" title="${() => S.Locale.Frontend_FluentCore_SearchBox_ClearButton_Description()}" :innerHTML=${IconClear} @click=${model => model.needle = ''}></fluent-button>
            ${when(model => model.allowcase, templateCaseSensivity)}
            ${when(model => model.allowregex, templateRegularExpression)}
        </div>
    </fluent-text-field>
`;

@customElement({ name: 'fluent-searchbox', template, styles })
export class SearchBox extends FASTElement {

    private readonly event = 'predicate';

    @attr placeholder = '';

    @observable needle = '';
    needleChanged() {
        this.UpdatePredicate();
    }

    @attr({ mode: 'boolean' }) allowcase = false;
    allowcaseChanged() {
        this.UpdatePredicate();
    }
    @observable caseenabled = false;
    caseenabledChanged() {
        this.UpdatePredicate();
    }

    @attr({ mode: 'boolean' }) allowregex = false;
    allowregexChanged() {
        this.UpdatePredicate();
    }
    @observable regexenabled = false;
    regexenabledChanged() {
        this.UpdatePredicate();
    }

    private UpdatePredicate() {
        try {
            if(!this.needle) {
                this.$emit(this.event, () => true);
            } else {
                if(this.allowregex && this.regexenabled) {
                    const regex = new RegExp(this.needle, this.allowcase && this.caseenabled ? undefined : 'i');
                    this.$emit(this.event, (text: string) => regex.test(text));
                } else {
                    if(this.allowcase && this.caseenabled ) {
                        this.$emit(this.event, (text: string) => text.includes(this.needle));
                    } else {
                        const lcneedle = this.needle.toLocaleLowerCase();
                        this.$emit(this.event, (text: string) => text.toLowerCase().includes(lcneedle));
                    }
                }
            }
        } catch {
            // ignore errors
        }
    }
}