import { mock } from 'jest-mock-extended';
import type { HakuNeko } from '../engine/HakuNeko';
import { Exception, InternalError, NotImplementedError } from './Error';
import type { Choice, ISettings, SettingsManager } from './SettingsManager';
import { LocaleID, VariantResourceKey } from '../i18n/ILocale';
import { Key } from './SettingsGlobal';

// Mocking globals
{
    const mockChoice = mock<Choice>({ Value: LocaleID.Locale_enUS });

    const mockSettigns = mock<ISettings>();
    mockSettigns.Get.calledWith(Key.Language).mockReturnValue(mockChoice);

    const mockSettingsManager = mock<SettingsManager>();
    mockSettingsManager.OpenScope.mockReturnValue(mockSettigns);

    window.HakuNeko = mock<HakuNeko>({ SettingsManager: mockSettingsManager });
}

describe('Error', () => {

    describe('InternalError', () => {

        test('Should create a new instance with expected properties', () => {
            const testee = new InternalError('😈');
            expect(testee).toBeInstanceOf(Error);
            expect(testee.name).toBe('InternalError');
            expect(testee.message).toBe('😈');
        });

        test('Should create a new derived instance with expected properties', () => {
            class DerivedInternalError extends InternalError {}
            const testee = new DerivedInternalError('😈');
            expect(testee).toBeInstanceOf(Error);
            expect(testee.name).toBe('DerivedInternalError');
            expect(testee.message).toBe('😈');
        });
    });

    describe('NotImplementedError', () => {

        test('Should create a new instance with expected properties', () => {
            const testee = new NotImplementedError('😈');
            expect(testee).toBeInstanceOf(Error);
            expect(testee.name).toBe('NotImplementedError');
            expect(testee.message).toBe('😈');
        });
    });

    describe('Exception', () => {

        test('Should create a new instance with expected properties', () => {
            const testee = new Exception(VariantResourceKey.FetchProvider_FetchWindow_CloudFlareError, '😈');
            expect(testee).toBeInstanceOf(Error);
            expect(testee.name).toBe('Exception<FetchProvider_FetchWindow_CloudFlareError>');
            expect(testee.message).toBe('The request failed due to the following CloudFlare Error: "😈"');
        });

        test('Should create a new derived instance with expected properties', () => {
            class DerivedException extends Exception {}
            const testee = new DerivedException(VariantResourceKey.FetchProvider_FetchWindow_CloudFlareError, '😈');
            expect(testee).toBeInstanceOf(Error);
            expect(testee.name).toBe('DerivedException<FetchProvider_FetchWindow_CloudFlareError>');
            expect(testee.message).toBe('The request failed due to the following CloudFlare Error: "😈"');
        });
    });
});