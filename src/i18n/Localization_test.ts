import { Code, type IResource } from './ILocale';
import { I, L, CurrentLocale, Localizations, CreateLocale } from './Localization';

describe('Localization', () => {

    describe('Localizations', () => {

        it('Should contain expected resources', async () => {
            const expected = [
                { key: Code.en_US, name: '🇺🇸 English (US)' },
                { key: Code.fr_FR, name: '🇫🇷 Français (FR)' },
                { key: Code.de_DE, name: '🇩🇪 Deutsch (DE)' },
            ];
            expect([...Localizations]).toStrictEqual(expected);
        });
    });

    describe('CurrentLocale()', () => {

        it('Should default to en_US', async () => {
            expect(CurrentLocale()).toBe(Code.en_US);
        });
    });

    describe('CreateLocale()', () => {

        it('Should not wrap unknown resource keys', async () => {
            const testee = CreateLocale('Sad Neko', { Speak: 'Meow' } as unknown as IResource);
            expect(`${testee}`).toBe('Sad Neko');
            expect(testee['Speak']).toBe(undefined);
        });

        it('Should wrap known resource keys', async () => {
            const testee = CreateLocale('Happy Neko', { Frontend_Product_Title: 'Meow {0}' } as unknown as IResource);
            expect(`${testee}`).toBe('Happy Neko');
            expect(testee.Frontend_Product_Title('😺', '🙈')).toBe('Meow 😺');
        });
    });

    describe('I()', () => {

        it('Should provide current resource', async () => {
            expect(I()).toBeInstanceOf(Object);
            expect(`${I()}`).toBe('🇺🇸 English (US)');
            expect(I().Frontend_Product_Title()).toBe('HakuNeko');
        });
    });

    describe('L()', () => {

        it('Should provide correct resource for en_US', async () => {
            expect(L(Code.en_US)).toBeInstanceOf(Object);
            expect(`${L(Code.en_US)}`).toBe('🇺🇸 English (US)');
            expect(L(Code.en_US).Frontend_Product_Title()).toBe('HakuNeko');
        });

        it('Should provide correct resource for fr_FR', async () => {
            expect(L(Code.fr_FR)).toBeInstanceOf(Object);
            expect(`${L(Code.fr_FR)}`).toBe('🇫🇷 Français (FR)');
            expect(L(Code.fr_FR).Frontend_Product_Title()).toBe('HakuNeko');
        });

        it('Should provide correct resource for de_DE', async () => {
            expect(L(Code.de_DE)).toBeInstanceOf(Object);
            expect(`${L(Code.de_DE)}`).toBe('🇩🇪 Deutsch (DE)');
            expect(L(Code.de_DE).Frontend_Product_Title()).toBe('HakuNeko');
        });

        it('Should not be defined for invalid langauge code', async () => {
            expect(L('-' as Code)).toBeUndefined();
        });
    });
});