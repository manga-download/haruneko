import type { Dialog } from 'puppeteer-core';
import { PuppeteerFixture } from '../../test/PuppeteerFixture';
import type { IValue } from '../src/engine/SettingsManager';

/**
 * A fixture providing shared functionality for front-end testing.
 */
export class FrontendFixture extends PuppeteerFixture {

    /**
     * Clear all stored data (incl. settings, bookmarks, cache) and reload the app
     */
    public async Reset(frontend: string = 'classic', selector: string, timeout = 10_000): Promise<void> {
        //await super.Screenshot('START - FrontendFixture.Reset()');
        try {
            const page = await super.GetPage();
            await page.evaluate(() => new Promise<void>((resolve, reject) => {
                try {
                    const operation = indexedDB.deleteDatabase('HakuNeko');
                    operation.addEventListener('success', () => resolve());
                    operation.addEventListener('error', reject);
                } catch (error) {
                    reject(error);
                }
            }));
            await this.#RunWithDismissDialog(1000,
                () => this.UpdateSetting('*', 'frontend', frontend),
            );
            await page.reload({ ignoreCache: true, timeout });
            await page.waitForSelector(selector, { visible: true, timeout });
        } finally {
            //await super.Screenshot('END - FrontendFixture.Reset()');
        }
    }

    async #RunWithDismissDialog(maxDialogTimeoutDelay: number, ...actions: (() => Promise<void>)[]) {
        const page = await super.GetPage();
        let dismiss: (dialog: Dialog) => Promise<void>;
        const dismissed = new Promise<void>(resolve => {
            dismiss = async (dialog: Dialog) => {
                await dialog.dismiss();
                super.Log('Dialog Dismissed:', dialog.type(), dialog.message());
                resolve();
            };
        });
        try {
            page.on('dialog', dismiss);
            await Promise.all(actions.map(action => action()));
            await Promise.race([dismissed, super.Delay(maxDialogTimeoutDelay)]);
        } finally {
            page.off('dialog', dismiss);
        }
    }

    public async WaitForSelectors(timeout: number, ... selectors: string[]) {
        const page = await super.GetPage();
        return Promise.all(selectors.map(selector => page.waitForSelector(selector, { visible: true, timeout })));
    }

    /**
     * Directly change a setting in the HakuNeko app via its settings manager.
     */
    public async UpdateSetting(scope: string, key: string, value: IValue): Promise<void> {
        //await super.Screenshot('START - FrontendFixture.UpdateSetting()');
        try {
            const page = await super.GetPage();
            await page.evaluate((scope, key, value) => {
                HakuNeko.SettingsManager.OpenScope(scope).Get(key).Value = value;
            }, scope, key, value);
        } finally {
            //await super.Screenshot('END - FrontendFixture.UpdateSetting()');
        }
    }

    /**
     * Get the current text for the first input element that matches {@link selectorInputElement}.
     */
    protected async GetText(selectorInputElement: string, timeout = 1000) {
        const page = await super.GetPage();
        await page.waitForSelector(selectorInputElement, { visible: true, timeout });
        return page.$eval(selectorInputElement, (input: HTMLInputElement) => input.value);
    }

    /**
     * Use the keyboard to type the given {@link text} into the first input element that matches {@link selectorInputElement}.
     * The current text will be cleared before the {@link text} is typed.
     */
    protected async SetText(selectorInputElement: string, text: string, timeout = 1000) {
        const page = await super.GetPage();
        await page.waitForSelector(selectorInputElement, { visible: true, timeout });
        await page.focus(selectorInputElement);
        while(await this.GetText(selectorInputElement)) {
            await page.keyboard.press('Delete', { delay: 25 });
            await page.keyboard.press('Backspace', { delay: 25 });
        }
        await page.keyboard.type(text, { delay: 25 });
    }

    protected async Click(selector: string, timeout = 1000) {
        const page = await super.GetPage();
        return page.waitForSelector(selector, { visible: true, timeout })
            .then(element => element.click());
    }
}