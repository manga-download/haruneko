import type { JSHandle, Page } from 'puppeteer-core';
import type { IMediaContainer, IMediaItem } from '../src/engine/providers/MediaPlugin';
import type { HakuNeko } from '../src/engine/HakuNeko';

export type Config = {
    plugin: {
        id: string;
        title: string;
    };
    container?: {
        url: string;
        id: string;
        title: string;
    };
    child?: {
        id: string;
        title: string;
    };
    entry?: {
        index: number;
        size: number;
        type: string;
    };
}

export class TestFixture<TWebsitePlugin extends IMediaContainer, TContainer extends IMediaContainer, TChild extends IMediaContainer, TEntry extends IMediaItem> {

    private readonly page: Page;
    private readonly config: Config;

    constructor(config: Config) {
        this.page = global.PAGE as Page;
        this.config = config;
    }

    private async GetRemoteInstances() {
        const remoteEngine = await this.page.evaluateHandle<JSHandle<HakuNeko>>(() => {
            return window['HakuNeko'];
        });

        const remotePlugin = typeof this.config.plugin?.id === 'string' ? await remoteEngine.evaluateHandle<JSHandle<TWebsitePlugin>>(async (engine: HakuNeko, pluginID: string) => {
            return engine.PluginController.WebsitePlugins.find(website => website.Identifier === pluginID);
        }, this.config.plugin.id) : null;

        const remoteContainer = typeof this.config.container?.url === 'string' ? await remotePlugin.evaluateHandle<JSHandle<TContainer>>(async (plugin: TWebsitePlugin, containerURL: string) => {
            const container = await plugin.TryGetEntry(containerURL) as TContainer;
            await container.Update();
            return container;
        }, this.config.container.url) : null;

        const remoteChild = typeof this.config.child?.id === 'string' ? await remoteContainer.evaluateHandle<JSHandle<TChild>>(async (container: TContainer, childID: string) => {
            const child = (container.Entries as TChild[]).find(child => child.Identifier === childID);
            await child.Update();
            return child;
        }, this.config.child.id) : null;

        const remoteEntry = typeof this.config.entry?.index === 'number' ? await remoteChild.evaluateHandle<JSHandle<TEntry>>(async (child: TChild, index: number) => {
            return child.Entries[index] as TEntry;
        }, this.config.entry.index) : null;

        return {
            plugin: remotePlugin,
            container: remoteContainer,
            child: remoteChild,
            entry: remoteEntry
        };
    }

    public AssertWebsite() {
        const remote = this.GetRemoteInstances();

        (this.config.plugin ? it : it.skip)('Should be registered as website', async () => {
            const { plugin } = await remote;
            expect(await plugin.evaluate(plugin => plugin.Identifier)).toEqual(this.config.plugin.id);
            expect(await plugin.evaluate(plugin => plugin.Title)).toEqual(this.config.plugin.title);
        });

        (this.config.container ? it : it.skip)('Should get specific manga', async () => {
            const { container } = await remote;
            expect(await container.evaluate(container => container.Identifier)).toEqual(this.config.container.id);
            expect(await container.evaluate(container => container.Title)).toEqual(this.config.container.title);
        });

        (this.config.child ? it : it.skip)('Should get specific chapter', async () => {
            const { child } = await remote;
            expect(await child.evaluate(child => child.Identifier)).toEqual(this.config.child.id);
            expect(await child.evaluate(child => child.Title)).toEqual(this.config.child.title);
        });

        // TODO: Fix bug with remote fetch (DeferredTask_1 is not defined)
        /*(this.config.entry ? it : it.skip)*/it.skip('Should get specific page', async () => {
            const { entry } = await remote;
            expect(await entry.evaluate(page => page.Parent.Identifier)).toEqual(this.config.child.id);
            expect(await entry.evaluate(page => page.Parent.Title)).toEqual(this.config.child.title);
            //const blob = await entry.evaluate(page => page.Fetch(Priority.High, null));
            //expect(blob.type).toEqual('image/jpeg');
            //expect(blob.size).toEqual(544663);
        });
    }
}