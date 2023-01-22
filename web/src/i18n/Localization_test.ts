import { mock } from 'jest-mock-extended';
import type { HakuNeko } from '../engine/HakuNeko';
import { Key } from '../engine/SettingsGlobal';
import type { Choice, ISettings, SettingsManager } from '../engine/SettingsManager';
import { LocaleID, type IResource } from './ILocale';
import { CreateLocale, GetLocale } from './Localization';

// Mocking globals
{
    const mockChoice = mock<Choice>({ Value: LocaleID.Locale_enUS });

    const mockSettigns = mock<ISettings>();
    mockSettigns.Get.calledWith(Key.Language).mockReturnValue(mockChoice);

    const mockSettingsManager = mock<SettingsManager>();
    mockSettingsManager.OpenScope.mockReturnValue(mockSettigns);

    window.HakuNeko = mock<HakuNeko>({ SettingsManager: mockSettingsManager });
}

describe('Localization', () => {

    describe('Locales', () => {

        const codes = Object.keys(LocaleID) as LocaleID[];
        const locales = codes.map(code => GetLocale(code));

        it('Should contain expected langauge codes', async () => {
            const expected = [
                LocaleID.Locale_arAE,
                LocaleID.Locale_deDE,
                LocaleID.Locale_enUS,
                LocaleID.Locale_esES,
                LocaleID.Locale_filPH,
                LocaleID.Locale_frFR,
                LocaleID.Locale_inID,
                LocaleID.Locale_ptBR,
                LocaleID.Locale_ruRU,
                LocaleID.Locale_thTH,
                LocaleID.Locale_trTR,
                LocaleID.Locale_zhCN,
            ];
            expect(codes).toStrictEqual(expected);
        });

        it.each(locales)('Should not translate language options', async (locale) => {
            expect(locale.Locale_arAE()).toBe('🇦🇪 العربية (AE)');
            expect(locale.Locale_deDE()).toBe('🇩🇪 Deutsch (DE)');
            expect(locale.Locale_enUS()).toBe('🇺🇸 English (US)');
            expect(locale.Locale_esES()).toBe('🇪🇸 Español (ES)');
            expect(locale.Locale_filPH()).toBe('🇵🇭 Pilipino (PH)');
            expect(locale.Locale_frFR()).toBe('🇫🇷 Français (FR)');
            expect(locale.Locale_inID()).toBe('🇮🇩 Indonesia (ID)');
            expect(locale.Locale_ptBR()).toBe('🇧🇷 Português (BR)');
            expect(locale.Locale_ruRU()).toBe('🇷🇺 Pусский (RU)');
            expect(locale.Locale_thTH()).toBe('🇹🇭 ไทย (TH)');
            expect(locale.Locale_trTR()).toBe('🇹🇷 Türkçe (TR)');
            expect(locale.Locale_zhCN()).toBe('🇨🇳 中文 (中国)');
        });
    });

    describe('CreateLocale()', () => {

        it('Should not wrap unknown resource keys', async () => {
            const testee = CreateLocale({ Speak: 'Meow' } as unknown as IResource);
            expect(testee['Speak']).toBe(undefined);
        });

        it('Should wrap known resource keys', async () => {
            const testee = CreateLocale({ Frontend_Product_Title: 'Meow {0}' } as unknown as IResource);
            expect(testee.Frontend_Product_Title('😺', '🙈')).toBe('Meow 😺');
        });
    });

    describe('GetLocale()', () => {

        it('Should mock en_US as current', async () => {
            expect(GetLocale()).toBe(GetLocale(LocaleID.Locale_enUS));
        });

        it('Should provide current resource', async () => {
            expect(GetLocale()).toBeInstanceOf(Object);
            expect(GetLocale().Frontend_Product_Title()).toBe('HakuNeko');
        });

        it('Should provide correct resource for ar_AE', async () => {
            expect(GetLocale(LocaleID.Locale_arAE)).toBeInstanceOf(Object);
            expect(GetLocale(LocaleID.Locale_arAE).Frontend_Product_Title()).toBe('HakuNeko');
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

        it('Should provide correct resource for in_ID', async () => {
            expect(GetLocale(LocaleID.Locale_inID)).toBeInstanceOf(Object);
            expect(GetLocale(LocaleID.Locale_inID).Frontend_Product_Title()).toBe('HakuNeko');
        });

        it('Should provide correct resource for pt_BR', async () => {
            expect(GetLocale(LocaleID.Locale_ptBR)).toBeInstanceOf(Object);
            expect(GetLocale(LocaleID.Locale_ptBR).Frontend_Product_Title()).toBe('HakuNeko');
        });

        it('Should provide correct resource for ru_RU', async () => {
            expect(GetLocale(LocaleID.Locale_ruRU)).toBeInstanceOf(Object);
            expect(GetLocale(LocaleID.Locale_ruRU).Frontend_Product_Title()).toBe('HakuNeko');
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