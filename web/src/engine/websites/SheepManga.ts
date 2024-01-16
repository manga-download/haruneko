import { Tags } from '../Tags';
import icon from './SheepManga.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, DecoratableMangaScraper, Manga, Chapter, Page } from '../providers/MangaPlugin';
import { Numeric, Secret, Text } from '../SettingsManager';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';
import * as Common from './decorators/Common';

/**
 * Sample Website Implementation for Developer Testing
 */
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sheep-scanlations', `Sheep's Awesome Mangas`, 'https://hakuneko.download/sample-websites/sheep-scanlations/', Tags.Media.Comic, Tags.Source.Official, Tags.Rating.Safe, Tags.Language.Multilingual);
        this.Settings.throttle = new Numeric('throttle', R.Plugin_Settings_ThrottlingDownloads, R.Plugin_Settings_ThrottlingDownloadsInfo, 0, 250, 5000);
        this.Settings.username = new Text('username', R.Plugin_SheepScanlations_Settings_Username, R.Plugin_SheepScanlations_Settings_UsernameInfo, '');
        this.Settings.password = new Secret('password', R.Plugin_SheepScanlations_Settings_Password, R.Plugin_SheepScanlations_Settings_PasswordInfo, '');
    }

    public override get Icon() {
        return icon;
    }

    public ValidateMangaURL(url: string): boolean {
        return /\/sheep-scanlations\/\d+\.json/.test(url);
    }

    public async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        // TODO: May search through provider.Entries, in case the manga is already in the list ...
        const mangas = await this.FetchMangas(provider);
        const id = '/' + new URL(url).pathname.split('/').pop();
        return mangas.find(manga => manga.Identifier === id);
    }

    public async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const request = new Request(this.URI + '/index.json');
        const data = await FetchJSON<{ id: string; title: string; }[]>(request);
        return data.map(entry => new Manga(this, provider, entry.id, entry.title));
    }

    public async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(this.URI + manga.Identifier);
        const data = await FetchJSON<{ id: string; title: string; }[]>(request);
        return data.map(entry => new Chapter(this, manga, entry.id, entry.title));
    }

    public async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(this.URI + chapter.Parent.Identifier);
        const data = await FetchJSON<{ id: string, pages: string[]; }[]>(request);
        const pages = data.find(ch => ch.id === chapter.Identifier).pages;
        return pages.map(page => new Page(this, chapter, new URL(page, this.URI)));
    }
}