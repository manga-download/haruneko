import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'dokuha',
        title: 'マンガ読破！EX (Dokuha)'
    },
    container: {
        url: 'https://dokuha.jp/comicweb/contents/comic/sakura-tsushin-chogapponban',
        id: '/comicweb/contents/comic/sakura-tsushin-chogapponban',
        title: '桜通信 超合本版'
    },
    child: {
        id: encodeURI('/comicweb/viewer/comic/桜通信+超合本版/1'),
        title: 'Vol.１'
    },
    entry: {
        index: 0,
        size: 255_931,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());