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
            const plugin = engine.PluginController.WebsitePlugins.find(website => website.Identifier === pluginID);
            await plugin.Update();
            return plugin;
        }, pluginID);
    }

    async GetRemoteContainer(pluginID: string, containerID: string) {
        const remotePlugin = await this.GetRemoteWebsitePlugin(pluginID);
        return remotePlugin.evaluateHandle<JSHandle<TContainer>>(async (plugin: TWebsitePlugin, containerID: string) => {
            const manga = (plugin.Entries as TContainer[]).find(manga => manga.Identifier === containerID);
            await manga.Update();
            return manga;
        }, containerID);
    }

    async GetRemoteChild(pluginID: string, containerID: string, childID: string) {
        const remoteManga = await this.GetRemoteContainer(pluginID, containerID);
        return remoteManga.evaluateHandle<JSHandle<TChild>>(async (manga: TContainer, childID: string) => {
            const chapter = (manga.Entries as TChild[]).find(chapter => chapter.Identifier === childID);
            await chapter.Update();
            return chapter;
        }, childID);
    }
}