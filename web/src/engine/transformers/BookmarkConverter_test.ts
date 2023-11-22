import { mock } from 'jest-mock-extended';
import type { HakuNeko } from '../../engine/HakuNeko';
import type { Choice, ISettings, SettingsManager } from '../SettingsManager';
import * as testee from './BookmarkConverter';
import { LocaleID } from '../../i18n/ILocale';
import { Key } from '../SettingsGlobal';
import { GetLocale } from '../../i18n/Localization';

// Mocking globals
{
    const mockChoice = mock<Choice>({ Value: LocaleID.Locale_enUS });

    const mockSettigns = mock<ISettings>();
    mockSettigns.Get.calledWith(Key.Language).mockReturnValue(mockChoice);

    const mockSettingsManager = mock<SettingsManager>();
    mockSettingsManager.OpenScope.mockReturnValue(mockSettigns);

    window.HakuNeko = mock<HakuNeko>({ SettingsManager: mockSettingsManager });
}

describe('BookmarkConverter', () => {

    describe('ConvertToSerializedBookmark()', () => {

        it.each<unknown>([
            [ 'x', 1 ], { x: 1 }, null, true, 'x', 1
        ])('Should throw for invald data', async (data) => {
            const expected = GetLocale(LocaleID.Locale_enUS).BookmarkPlugin_ConvertToSerializedBookmark_UnsupportedFormatError();
            expect(() => testee.ConvertToSerializedBookmark(data)).toThrowError(expected);
        });

        it('Should keep serialized bookmark', async () => {
            const expected = {
                Created: 123456789,
                Updated: 987654321,
                Title: 'media-title',
                Media: { ProviderID: 'website-key', EntryID: 'media-key' },
                Info: { ProviderID: 'tracker-key', EntryID: 'item-key' }
            };
            const actual = testee.ConvertToSerializedBookmark(expected);
            expect(actual).toBe(expected);
        });

        it('Should convert legacy bookmark', async () => {
            const expected = {
                Created: 0,
                Updated: 0,
                Title: 'manga-title',
                Media: { ProviderID: 'website-key', EntryID: 'manga-key' },
                Info: { ProviderID: null, EntryID: null }
            };
            const actual = testee.ConvertToSerializedBookmark({
                key: { connector: 'website-key', manga: 'manga-key' },
                title: { connector: 'website-title', manga: 'manga-title' },
            });
            expect(actual).toStrictEqual(expected);
        });

        it.each<{ sourceID: string, targetID: string }>([
            { sourceID: '9anime', targetID: 'aniwave' },
            { sourceID: 'bananascan', targetID: 'harmonyscan' },
            { sourceID: 'bacamangaorg', targetID: 'bacamanga' },
            { sourceID: 'crazyscans', targetID: 'mangacultivator' },
            { sourceID: 'dalsei', targetID: 'viyafansub' },
            { sourceID: 'flamescans-org', targetID: 'flamecomics' },
            { sourceID: 'kisscomic', targetID: 'readcomiconline' },
            { sourceID: 'heavenmanga', targetID: 'beetoon' }, // (future zbulu PR)
            { sourceID: 'heavenmanga2', targetID: 'heavenmanga' }, // (future zbulu PR)
            { sourceID: 'lovehug', targetID: 'welovemanga' },
            { sourceID: 'mangaswat', targetID: 'goldragon' },
            { sourceID: 'realmscans', targetID: 'rizzcomics' },
            { sourceID: 'muctau', targetID: 'bibimanga' },
            { sourceID: 'secretscans', targetID: 'lynxscans' },
            { sourceID: 'shonenmagazine-pocket', targetID: 'shonenmagazine' },
            { sourceID: 'yugenmangas', targetID: 'yugenmangas-es' },

            // TODO: Add all test cases from BookmarkConverter::legacyWebsiteIdentifierMap ...
        ])('Should migrate website ID from legacy bookmark', async (data) => {
            const actual = testee.ConvertToSerializedBookmark({
                key: { connector: data.sourceID, manga: 'manga-key' },
                title: { connector: 'website-title', manga: 'manga-title' },
            });
            expect(actual.Media.ProviderID).toStrictEqual(data.targetID);
        });
    });
});