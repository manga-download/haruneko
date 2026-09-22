import { describe, it, expect, beforeEach } from 'vitest';
import type { HakuNeko } from '../HakuNeko';
import type { ISettings, SettingsManager } from '../SettingsManager';
import { Key } from '../SettingsGlobal';
import { Chapter, type Manga, type MangaScraper } from './MangaPlugin';

type FakeEntry = { kind: 'file' | 'directory', name: string };

/**
 * Minimal in-memory stand-ins for the handles of the File System Access API.
 */
function FakeFile(name: string) {
    return { kind: 'file' as const, name };
}

function FakeDirectory(name: string, ...children: FakeEntry[]) {
    const entries = new Map(children.map(entry => [ entry.name, entry ]));
    const find = (entryName: string, kind: FakeEntry['kind']) => {
        const entry = entries.get(entryName);
        if(entry?.kind !== kind) throw new DOMException(entryName, 'NotFoundError');
        return entry;
    };
    return {
        kind: 'directory' as const,
        name,
        entries,
        permission: 'granted' as PermissionState,
        queryPermission: async function(this: { permission: PermissionState }) { return this.permission; },
        getDirectoryHandle: async (entryName: string) => find(entryName, 'directory'),
        getFileHandle: async (entryName: string) => find(entryName, 'file'),
    };
}

let downloads: ReturnType<typeof FakeDirectory>;

// Mocking globals
{
    const settings = {
        Get: (key: Key) => ({ [Key.MediaDirectory]: { Value: downloads }, [Key.UseWebsiteSubDirectory]: { Value: false } })[key],
    } as unknown as ISettings;
    globalThis.HakuNeko = Object.assign(globalThis.HakuNeko ?? {}, {
        SettingsManager: { OpenScope: () => settings } as unknown as SettingsManager,
    }) as unknown as HakuNeko;
}

describe('Chapter', () => {

    const manga = { Title: 'Series' } as Manga;
    const chapter = new Chapter({} as MangaScraper, manga, '/series/volume-8/', 'Volume 8');
    let series: ReturnType<typeof FakeDirectory>;

    beforeEach(() => {
        series = FakeDirectory('Series');
        downloads = FakeDirectory('Downloads', series);
    });

    describe('RefreshStored()', () => {

        it('Should detect a chapter stored as archive in the directory of its manga', async () => {
            series.entries.set('Volume 8.cbz', FakeFile('Volume 8.cbz'));
            expect(await chapter.RefreshStored()).toBe(true);
            expect(chapter.IsStored.Value).toBe(true);
        });

        it('Should no longer detect a chapter that was deleted outside of the application', async () => {
            series.entries.set('Volume 8.cbz', FakeFile('Volume 8.cbz'));
            await chapter.RefreshStored();
            series.entries.delete('Volume 8.cbz');
            expect(await chapter.RefreshStored()).toBe(false);
            expect(chapter.IsStored.Value).toBe(false);
        });

        it('Should not detect a chapter without being granted access to the download directory', async () => {
            series.entries.set('Volume 8.cbz', FakeFile('Volume 8.cbz'));
            downloads.permission = 'prompt';
            expect(await chapter.RefreshStored()).toBe(false);
        });
    });

    describe('GetStoredLocation()', () => {

        it('Should locate a chapter stored as image directory within the download directory', async () => {
            const images = FakeDirectory('Volume 8', FakeFile('001.jpg'));
            series.entries.set('Volume 8', images);
            const actual = await chapter.GetStoredLocation();
            expect(actual?.directory).toBe(downloads);
            expect(actual?.entry).toBe(images);
        });

        it('Should locate nothing for a chapter that is not stored', async () => {
            expect(await chapter.GetStoredLocation()).toBeUndefined();
        });
    });
});
