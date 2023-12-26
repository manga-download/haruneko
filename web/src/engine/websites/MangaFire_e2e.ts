import { TestFixture } from '../../../test/WebsitesFixture';

const configVolume = {
    plugin: {
        id: 'mangafire',
        title: 'MangaFire'
    },
    container: {
        url: 'https://mangafire.to/manga/vagabond.4mx',
        id: '/manga/vagabond.4mx',
        title: 'Vagabond'
    },
    child: {
        id: JSON.stringify({ itemid: '140775', itemtype: 'volume', language: 'en' }),
        title: 'Vol 38:'
    },
    entry: {
        index: 2,
        size: 1_167_731,
        type: 'image/png'
    }
};

const fixtureVolume = new TestFixture(configVolume);
describe(fixtureVolume.Name, () => fixtureVolume.AssertWebsite());

const configChapter = {
    plugin: {
        id: 'mangafire',
        title: 'MangaFire'
    },
    container: {
        url: 'https://mangafire.to/manga/vagabond.4mx',
        id: '/manga/vagabond.4mx',
        title: 'Vagabond'
    },
    child: {
        id: JSON.stringify({ itemid: '1552876', itemtype: 'chapter', language: 'en' }),
        title: 'Chap 326: To Be A Samurai'
    },
    entry: {
        index: 0,
        size: 353_323,
        type: 'image/jpeg'
    }
};

const fixtureChapter = new TestFixture(configChapter);
describe(fixtureChapter.Name, () => fixtureChapter.AssertWebsite());