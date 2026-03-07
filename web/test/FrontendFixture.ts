import { PuppeteerFixture } from '../../test/PuppeteerFixture';
import type { IValue } from '../src/engine/SettingsManager';

/**
 * A fixture providing shared functionality for front-end testing.
 */
export class FrontendFixture extends PuppeteerFixture {

    /**
     * Helper function to wait for a given {@link timespan} (in _milliseconds_).
     * Can be useful e.g., when it takes some time for updating dynamic elements in the frontend.
     */
    public async Delay(timespan: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, timespan));
    }

    /**
     * Clear all stored data (incl. settings, bookmarks, cache) and reload the app
     */
    public async Reset(_frontend: string = 'classic'): Promise<void> {
        const page = await this.GetPage();
        await page.evaluate(() => new Promise((resolve, reject) => {
            try {
                const operation = indexedDB.deleteDatabase('HakuNeko');
                operation.addEventListener('success', resolve);
                operation.addEventListener('error', reject);
            } catch (err) {
                reject(err);
            }
        }));
        //await this.UpdateSetting('*', 'frontend', frontend);
        await page.reload();
        await this.Delay(500);
        // TODO: Confirm restart prompt if any ...
    }

    public async WaitForSelectors(timeout: number, ... selectors: string[]) {
        const page = await this.GetPage();
        return Promise.all(selectors.map(selector => page.waitForSelector(selector, { timeout })));
    }

    /**
     * Directly change a setting in the HakuNeko app via its settings manager.
     */
    public async UpdateSetting(scope: string, key: string, value: IValue): Promise<void> {
        const page = await super.GetPage();
        // TODO: Use variables in evaluated script ...
        await page.evaluate((scope, key, value) => HakuNeko.SettingsManager.OpenScope(scope).Get(key).Value = value, scope, key, value);
    }

    /**
     * Get the current text for the first input element that matches {@link selectorInputElement}.
     */
    protected async GetText(selectorInputElement: string) {
        const page = await super.GetPage();
        await page.waitForSelector(selectorInputElement, { timeout: 1000 });
        return page.$eval(selectorInputElement, (input: HTMLInputElement) => input.value);
    }

    /**
     * Use the keyboard to type the given {@link text} into the first input element that matches {@link selectorInputElement}.
     * The current text will be cleared before the {@link text} is typed.
     */
    protected async SetText(selectorInputElement: string, text: string) {
        const page = await super.GetPage();
        await page.waitForSelector(selectorInputElement, { timeout: 1000 });
        await page.focus(selectorInputElement);
        while(await this.GetText(selectorInputElement)) {
            await page.keyboard.press('Delete');
            await page.keyboard.press('Backspace');
        }
        await page.keyboard.type(text);
    }
}