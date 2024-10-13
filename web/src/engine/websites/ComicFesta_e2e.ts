import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'comicfesta',
        title: 'コミックフェスタ | ComicFesta'
    },
    container: {
        url: 'https://comic.iowl.jp/titles/205598/volumes',
        id: '/titles/205598/volumes',
        title: 'ノン･シュガー 分冊版'
    },
    child: {
        id: '/volumes/871005/trial_download',
        title: '1巻'
    },
    entry: {
        index: 4,
        size: 513_165,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());