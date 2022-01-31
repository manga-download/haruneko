import { mock } from 'jest-mock-extended';
import type { HakuNeko } from '../engine/HakuNeko';
import { Key } from '../engine/SettingsGlobal';
import type { Choice, ISettings, SettingsManager } from '../engine/SettingsManager';
import { Code, type IResource } from './ILocale';
import { CreateLocale, GetLocale } from './Localization';

// Mocking globals
{
    const mockChoice = mock<Choice>({ Value: Code.en_US });

    const mockSettigns = mock<ISettings>();
    mockSettigns.Get.calledWith(Key.Language).mockReturnValue(mockChoice);

    const mockSettingsManager = mock<SettingsManager>();
    mockSettingsManager.OpenScope.mockReturnValue(mockSettigns);

    window.HakuNeko = mock<HakuNeko>({ SettingsManager: mockSettingsManager });
}

describe('Localization', () => {

    describe('Locales', () => {

        const codes = Object.keys(Code) as Code[];
        const locales = codes.map(code => GetLocale(code));

        it('Should contain expected langauge codes', async () => {
            const expected = [
                Code.en_US,
                Code.fr_FR,
                Code.de_DE,
            ];
            expect(codes).toStrictEqual(expected);
        });

        it.each(locales)('Should not translate language options', async (locale) => {
            expect(locale.Settings_Global_Language_enUS()).toBe('🇺🇸 English (US)');
            expect(locale.Settings_Global_Language_frFR()).toBe('🇫🇷 Français (FR)');
            expect(locale.Settings_Global_Language_deDE()).toBe('🇩🇪 Deutsch (DE)');
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
            expect(GetLocale()).toBe(GetLocale(Code.en_US));
        });

        it('Should provide current resource', async () => {
            expect(GetLocale()).toBeInstanceOf(Object);
            expect(GetLocale().Frontend_Product_Title()).toBe('HakuNeko');
        });

        it('Should provide correct resource for en_US', async () => {
            expect(GetLocale(Code.en_US)).toBeInstanceOf(Object);
            expect(GetLocale(Code.en_US).Frontend_Product_Title()).toBe('HakuNeko');
        });

        it('Should provide correct resource for fr_FR', async () => {
            expect(GetLocale(Code.fr_FR)).toBeInstanceOf(Object);
            expect(GetLocale(Code.fr_FR).Frontend_Product_Title()).toBe('HakuNeko');
        });

        it('Should provide correct resource for de_DE', async () => {
            expect(GetLocale(Code.de_DE)).toBeInstanceOf(Object);
            expect(GetLocale(Code.de_DE).Frontend_Product_Title()).toBe('HakuNeko');
        });

        it('Should not be defined for invalid langauge code', async () => {
            expect(GetLocale('-' as Code)).toBeUndefined();
        });
    });
});