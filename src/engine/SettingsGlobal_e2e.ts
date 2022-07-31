import type { JSHandle, Page } from 'puppeteer-core';
import type { ISettings } from './SettingsManager';
import { Key } from './SettingsGlobal';

export class TestFixture {

    private readonly page: Page;

    constructor() {
        this.page = global.PAGE as Page;
    }

    public async GetRemoteGlobalSettings(): Promise<JSHandle<ISettings>> {
        return this.page.evaluateHandle(async () => {
            return window.HakuNeko.SettingsManager.OpenScope();
        });
    }
}

describe('SettingsGlobal', () => {

    it('Should be initialized and accessible', async () => {

        const fixture = new TestFixture();
        const remoteTestee = await fixture.GetRemoteGlobalSettings();

        expect(await remoteTestee.evaluate(testee => testee.Get('language').ID)).toBe(Key.Language);
        expect(await remoteTestee.evaluate(testee => testee.Get('media-directory').ID)).toBe(Key.MediaDirectory);
        expect(await remoteTestee.evaluate(testee => testee.Get('website-subdirectory').ID)).toBe(Key.UseWebsiteSubDirectory);
        expect(await remoteTestee.evaluate(testee => testee.Get('descrambling-format').ID)).toBe(Key.DescramblingFormat);
        expect(await remoteTestee.evaluate(testee => testee.Get('descrambling-quality').ID)).toBe(Key.DescramblingQuality);
        expect(await remoteTestee.evaluate(testee => testee.Get('captcha-token').ID)).toBe(Key.CaptchaToken);
        expect(await remoteTestee.evaluate(testee => testee.Get('post-command').ID)).toBe(Key.PostCommand);
    });
});