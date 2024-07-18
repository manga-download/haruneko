import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'golgebahcesi',
        title: 'Gölge Bahçesi'
    }, /*Region Locked : Turkish
    container: {
        url: 'https://golgebahcesi.com/manga/ozel-memur/',
        id: '/manga/ozel-memur/',
        title: 'Özel Memur'
    },
    child: {
        id: '/ozel-memur-bolum-4/',
        title: 'Bölüm 4'
    },
    entry: {
        index: 0,
        size: 485_139,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());