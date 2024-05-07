// @vitest-environment jsdom
import { mock } from 'vitest-mock-extended';
import { describe, it, expect } from 'vitest';
import type { HakuNeko } from '../engine/HakuNeko';
import { Key } from '../engine/SettingsGlobal';
import type { Choice, ISettings, SettingsManager } from '../engine/SettingsManager';
import { LocaleID, type IResource } from './ILocale';
import { CreateLocale, GetLocale } from './Localization';
import type { FeatureFlags } from '../engine/FeatureFlags';

// Mocking globals
{
    const mockFeatureFlags = mock<FeatureFlags>();
    //mockFeatureFlags.CrowdinTranslationMode = ...

    const mockChoice = mock<Choice>({ Value: LocaleID.Locale_arSA });

    const mockSettigns = mock<ISettings>();
    mockSettigns.Get.calledWith(Key.Language).mockReturnValue(mockChoice);

    const mockSettingsManager = mock<SettingsManager>();
    mockSettingsManager.OpenScope.mockReturnValue(mockSettigns);

    window.HakuNeko = mock<HakuNeko>({
        SettingsManager: mockSettingsManager,
        FeatureFlags: mockFeatureFlags,
    });
}

describe('Localization', () => {

    describe('Locales', () => {

        const codes = Object.keys(LocaleID) as LocaleID[];
        const locales = codes.map(code => GetLocale(code));

        it('Should contain expected langauge codes', async () => {
            const expected = [
                LocaleID.Locale_arSA,
                LocaleID.Locale_deDE,
                LocaleID.Locale_enUS,
                LocaleID.Locale_esES,
                LocaleID.Locale_filPH,
                LocaleID.Locale_frFR,
                LocaleID.Locale_hiIN,
                LocaleID.Locale_idID,
                LocaleID.Locale_ptPT,
                LocaleID.Locale_thTH,
                LocaleID.Locale_trTR,
                LocaleID.Locale_zhCN,
            ];
            expect(codes).toStrictEqual(expected);
        });

        it.each(locales)('Should not translate language options', async (locale) => {
            expect(locale.Locale_arSA()).toBe('🇸🇦 العربية (SA)');
            expect(locale.Locale_deDE()).toBe('🇩🇪 Deutsch (DE)');
            expect(locale.Locale_enUS()).toBe('🇺🇸 English (US)');
            expect(locale.Locale_esES()).toBe('🇪🇸 Español (ES)');
            expect(locale.Locale_filPH()).toBe('🇵🇭 Filipino (PH)');
            expect(locale.Locale_frFR()).toBe('🇫🇷 Français (FR)');
            expect(locale.Locale_hiIN()).toBe('🇮🇳 हिंदी (IN)');
            expect(locale.Locale_idID()).toBe('🇮🇩 Indonesia (ID)');
            expect(locale.Locale_ptPT()).toBe('🇵🇹 Português (PT)');
            expect(locale.Locale_thTH()).toBe('🇹🇭 ไทย (TH)');
            expect(locale.Locale_trTR()).toBe('🇹🇷 Türkçe (TR)');
            expect(locale.Locale_zhCN()).toBe('🇨🇳 中文 (中国)');
        });
    });

    describe('CreateLocale()', () => {

        it('Should not wrap unknown resource key', async () => {
            const testee = CreateLocale({ Speak: 'Meow' } as unknown as IResource);
            expect(testee['Speak']).toBe(undefined);
        });

        it('Should wrap known resource key', async () => {
            const testee = CreateLocale({ Frontend_Product_Title: 'Meow {0}' } as unknown as IResource);
            expect(testee.Frontend_Product_Title('😺', '🙈')).toBe('Meow 😺');
        });

        it('Should return known resource key for missing translation', async () => {
            const testee = CreateLocale({ Frontend_Product_Title: null } as unknown as IResource);
            expect(testee.Frontend_Product_Title()).toBe('Frontend_Product_Title');
        });
    });

    describe('GetLocale()', () => {

        it('Should mock ar_SA as current', async () => {
            expect(GetLocale()).toBe(GetLocale(LocaleID.Locale_arSA));
        });

        it('Should provide current resource', async () => {
            expect(GetLocale()).toBeInstanceOf(Object);
            expect(GetLocale().Frontend_Product_Title()).toBe('HakuNeko');
        });

        it('Should provide correct resource for ar_SA', async () => {
            expect(GetLocale(LocaleID.Locale_arSA)).toBeInstanceOf(Object);
            expect(GetLocale(LocaleID.Locale_arSA).Frontend_Product_Title()).toBe('HakuNeko');
        });

        it('Should provide correct resource for de_DE', async () => {
            expect(GetLocale(LocaleID.Locale_deDE)).toBeInstanceOf(Object);
            expect(GetLocale(LocaleID.Locale_deDE).Frontend_Product_Title()).toBe('HakuNeko');
        });

        it('Should provide correct resource for en_US', async () => {
            expect(GetLocale(LocaleID.Locale_enUS)).toBeInstanceOf(Object);
            expect(GetLocale(LocaleID.Locale_enUS).Frontend_Product_Title()).toBe('HakuNeko');
        });

        it('Should provide correct resource for es_ES', async () => {
            expect(GetLocale(LocaleID.Locale_esES)).toBeInstanceOf(Object);
            expect(GetLocale(LocaleID.Locale_esES).Frontend_Product_Title()).toBe('HakuNeko');
        });

        it('Should provide correct resource for fil_PH', async () => {
            expect(GetLocale(LocaleID.Locale_filPH)).toBeInstanceOf(Object);
            expect(GetLocale(LocaleID.Locale_filPH).Frontend_Product_Title()).toBe('HakuNeko');
        });

        it('Should provide correct resource for fr_FR', async () => {
            expect(GetLocale(LocaleID.Locale_frFR)).toBeInstanceOf(Object);
            expect(GetLocale(LocaleID.Locale_frFR).Frontend_Product_Title()).toBe('HakuNeko');
        });

        it('Should provide correct resource for hi_IN', async () => {
            expect(GetLocale(LocaleID.Locale_hiIN)).toBeInstanceOf(Object);
            expect(GetLocale(LocaleID.Locale_hiIN).Frontend_Product_Title()).toBe('HakuNeko');
        });

        it('Should provide correct resource for id_ID', async () => {
            expect(GetLocale(LocaleID.Locale_idID)).toBeInstanceOf(Object);
            expect(GetLocale(LocaleID.Locale_idID).Frontend_Product_Title()).toBe('HakuNeko');
        });

        it('Should provide correct resource for pt_PT', async () => {
            expect(GetLocale(LocaleID.Locale_ptPT)).toBeInstanceOf(Object);
            expect(GetLocale(LocaleID.Locale_ptPT).Frontend_Product_Title()).toBe('HakuNeko');
        });

        it('Should provide correct resource for th_TH', async () => {
            expect(GetLocale(LocaleID.Locale_thTH)).toBeInstanceOf(Object);
            expect(GetLocale(LocaleID.Locale_thTH).Frontend_Product_Title()).toBe('HakuNeko');
        });

        it('Should provide correct resource for tr_TR', async () => {
            expect(GetLocale(LocaleID.Locale_trTR)).toBeInstanceOf(Object);
            expect(GetLocale(LocaleID.Locale_trTR).Frontend_Product_Title()).toBe('HakuNeko');
        });

        it('Should provide correct resource for zh_CN', async () => {
            expect(GetLocale(LocaleID.Locale_zhCN)).toBeInstanceOf(Object);
            expect(GetLocale(LocaleID.Locale_zhCN).Frontend_Product_Title()).toBe('HakuNeko');
        });

        it('Should not be defined for invalid langauge code', async () => {
            expect(GetLocale('-' as LocaleID)).toBeUndefined();
        });
    });
});