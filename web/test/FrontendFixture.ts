import { PuppeteerFixture } from '../../test/PuppeteerFixture';

/**
 * A fixture providing shared functionality for front-end testing.
 */
export class FrontendFixture extends PuppeteerFixture {

    protected async GetText(selectorInputElement: string) {
        const page = await super.GetPage();
        await page.waitForSelector(selectorInputElement, { timeout: 1000 });
        return page.$eval(selectorInputElement, (input: HTMLInputElement) => input.value);
    }

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