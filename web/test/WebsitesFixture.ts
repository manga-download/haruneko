import { it, expect } from 'vitest';
import type { JSHandle } from 'puppeteer-core';
import { PuppeteerFixture } from '../../test/PuppeteerFixture';
import type { IValue } from '../src/engine/SettingsManager';
import type { MediaContainer, MediaChild, MediaItem } from '../src/engine/providers/MediaPlugin';

export type Config = {
    plugin: {
        id: string;
        title: string;
        timeout?: number;
        settings?: Record<string, IValue>;
    };
    container?: {
        url: string;
        id: string;
        title: string;
        timeout?: number;
    };
    child?: {
        id: string;
        title: string;
        timeout?: number;
    };
    entry?: {
        index: number;
        size: number;
        type: string;
        timeout?: number;
    };
}

type MediaPuginInstance = MediaContainer<MediaChild> & { Initialize(): Promise<void> };

export class TestFixture<TWebsitePlugin extends MediaContainer<MediaChild>, TContainer extends MediaContainer<MediaChild>, TChild extends MediaContainer<MediaItem>, TEntry extends MediaItem> extends PuppeteerFixture {

    constructor(private readonly config: Config) {
        super();
    }

    private async GetRemotePlugin(pluginID: string, settings?: Record<string, IValue>): Promise<JSHandle<TWebsitePlugin>> {
        return super.Page.evaluateHandle(async (id: string, setup: Record<string, IValue>) => {
            const plugin = window.HakuNeko.PluginController.WebsitePlugins.find(website => website.Identifier === id);
            for (const key in setup) {
                plugin.Settings.Get(key).Value = setup[key];
            }
            await (plugin as MediaPuginInstance)?.Initialize();
            return plugin as TWebsitePlugin;
        }, pluginID, settings ?? {});
    }

    private async GetRemoteContainer(remotePlugin: JSHandle<TWebsitePlugin>, containerURL: string): Promise<JSHandle<TContainer>> {
        return remotePlugin.evaluateHandle(async (plugin: TWebsitePlugin, url: string) => {
            const container = await plugin.TryGetEntry(url) as TContainer;
            await container?.Update();
            return container;
        }, containerURL);
    }

    private async GetRemoteChild(remoteContainer: JSHandle<TContainer>, childID: string): Promise<JSHandle<TChild>> {
        return remoteContainer.evaluateHandle(async (container: TContainer, id: string) => {
            const child = (container.Entries.Value as TChild[]).find(child => child.Identifier === id);
            await child?.Update();
            return child;
        }, childID);
    }

    private async GetRemoteEntry(remoteChild: JSHandle<TChild>, entryIndex?: number): Promise<JSHandle<TEntry>> {
        return remoteChild.evaluateHandle(async (child: TChild, index: number) => {
            return child?.Entries.Value[index] as TEntry;
        }, entryIndex);
    }

    private async GetRemoteData(remoteEntry: JSHandle<TEntry>): Promise<JSHandle<Blob>> {
        return remoteEntry.evaluateHandle(async (entry: TEntry, priority: number) => {
            return await entry?.Fetch(priority, null);
        }, 0);
    }

    public get Name() {
        return [
            this.config.plugin.title,
            this.config.container?.title,
            this.config.child?.title,
            `[${this.config.entry?.index}]`
        ].join(' › ');
    }

    public AssertWebsite() {

        let remotePlugin: JSHandle<TWebsitePlugin>;

        (this.config.plugin ? it : it.skip)('Should get initialized website plugin', async () => {
            remotePlugin = await this.GetRemotePlugin(this.config.plugin.id, this.config.plugin.settings);
            expect(await remotePlugin.evaluate(plugin => plugin?.Identifier || 'Website plugin not found!')).toEqual(this.config.plugin.id);
            expect(await remotePlugin.evaluate(plugin => plugin.Title)).toEqual(this.config.plugin.title);
        }, this.config.plugin.timeout ?? 25_000);

        let remoteContainer: JSHandle<TContainer>;

        (this.config.container ? it : it.skip)('Should get specific manga', async () => {
            remoteContainer = await this.GetRemoteContainer(remotePlugin, this.config.container.url);
            expect(await remoteContainer.evaluate(container => container?.Identifier || 'Manga not found!')).toEqual(this.config.container.id);
            expect(await remoteContainer.evaluate(container => container.Title)).toEqual(this.config.container.title);
        }, this.config.container?.timeout ?? 7500);

        let remoteChild: JSHandle<TChild>;

        (this.config.child ? it : it.skip)('Should get specific chapter', async () => {
            remoteChild = await this.GetRemoteChild(remoteContainer, this.config.child.id);
            expect(await remoteChild.evaluate(child => child?.Identifier || 'Chapter not found!')).toEqual(this.config.child.id);
            expect(await remoteChild.evaluate(child => child.Title)).toEqual(this.config.child.title);
        }, this.config.child?.timeout ?? 7500);

        let remoteEntry: JSHandle<TEntry>;

        (this.config.entry ? it : it.skip)('Should get specific page', async () => {
            remoteEntry = await this.GetRemoteEntry(remoteChild, this.config.entry.index);
            expect(await remoteEntry.evaluate(page => page?.Parent?.Identifier || 'Page not found!')).toEqual(this.config.child.id);
            expect(await remoteEntry.evaluate(page => page.Parent.Title)).toEqual(this.config.child.title);
        }, this.config.entry?.timeout ?? 7500);

        let remoteData: JSHandle<Blob>;

        (this.config.entry ? it : it.skip)('Should fetch valid blob', async () => {
            remoteData = await this.GetRemoteData(remoteEntry);
            expect(await remoteData.evaluate(data => data.type)).toEqual(this.config.entry.type);
            expect(await remoteData.evaluate(data => data.size)).toEqual(this.config.entry.size);
        }, this.config.entry?.timeout ?? 7500);
    }
}