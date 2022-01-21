import type { JSHandle, Page } from 'puppeteer-core';
import type { IMediaContainer } from '../src/engine/providers/MediaPlugin';
import type { MangaPlugin, Manga, Chapter } from '../src/engine/providers/MangaPlugin';
import type { HakuNeko } from '../src/engine/HakuNeko';

export class TestFixture<TWebsitePlugin extends IMediaContainer = MangaPlugin, TContainer extends IMediaContainer = Manga, TChild extends IMediaContainer = Chapter> {

    private readonly _page: Page;

    constructor() {
        this._page = global.PAGE as Page;
    }

    async GetRemoteEngine() {
        return this._page.evaluateHandle<JSHandle<HakuNeko>>(() => {
            return window['HakuNeko'];
        });
    }

    async GetRemoteWebsitePlugin(pluginID: string) {
        const remoteEngine = await this.GetRemoteEngine();
        return remoteEngine.evaluateHandle<JSHandle<TWebsitePlugin>>(async (engine: HakuNeko, pluginID: string) => {
            return engine.PluginController.WebsitePlugins.find(website => website.Identifier === pluginID);
        }, pluginID);
    }

    async GetRemoteContainer(pluginID: string, containerURL: string) {
        const remotePlugin = await this.GetRemoteWebsitePlugin(pluginID);
        return remotePlugin.evaluateHandle<JSHandle<TContainer>>(async (plugin: TWebsitePlugin, containerURL: string) => {
            const manga = (await plugin.TryGetEntry(containerURL) as TContainer);
            await manga.Update();
            return manga;
        }, containerURL);
    }

    async GetRemoteChild(pluginID: string, containerURL: string, childID: string) {
        const remoteManga = await this.GetRemoteContainer(pluginID, containerURL);
        return remoteManga.evaluateHandle<JSHandle<TChild>>(async (manga: TContainer, childID: string) => {
            const chapter = (manga.Entries as TChild[]).find(chapter => chapter.Identifier === childID);
            await chapter.Update();
            return chapter;
        }, childID);
    }
}