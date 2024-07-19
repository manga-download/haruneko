import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'rawlazy',
        title: 'RawLazy'
    },
    container: {
        url: 'https://rawlazy.si/manga-lazy/%e3%82%ad%e3%83%b3%e3%82%b0%e3%83%80%e3%83%a0-raw-free/',
        id: '/manga-lazy/%e3%82%ad%e3%83%b3%e3%82%b0%e3%83%80%e3%83%a0-raw-free/',
        title: 'キングダム'
    },
    child: {
        id: '/manga-chapter/%e3%82%ad%e3%83%b3%e3%82%b0%e3%83%80%e3%83%a0-raw-%e3%80%90%e7%ac%ac795%e8%a9%b1%e3%80%91/',
        title: '第795話'
    },
    entry: {
        index: 0,
        size: 225_650,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());