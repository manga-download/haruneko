import { describe, it, expect } from 'vitest';
import type { JSHandle } from 'puppeteer-core';
import { PuppeteerFixture } from '../../../test/PuppeteerFixture';
import type { ISettings } from './SettingsManager';
import { Key } from './SettingsGlobal';

export class TestFixture extends PuppeteerFixture {

    public async GetRemoteGlobalSettings(): Promise<JSHandle<ISettings>> {
        return super.Page.evaluateHandle(async () => {
            return window.HakuNeko.SettingsManager.OpenScope();
        });
    }
}

describe('SettingsGlobal', () => {

    it('Should be initialized and accessible', async () => {

        const fixture = await new TestFixture().Connect();
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