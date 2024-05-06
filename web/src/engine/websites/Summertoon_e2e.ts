import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'summertoon',
        title: 'Summertoon'
    },
    container: {
        url: 'https://summertoon.me/manga/yirtici-evlilik/',
        id: '/manga/yirtici-evlilik/',
        title: 'Yırtıcı Evlilik'
    },
    child: {
        id: '/yirtici-evlilik-bolum-0/',
        title: 'Bölüm 0 - Prolog'
    },
    entry: {
        index: 1,
        size: 1_373_225,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());