import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'turkcemangaoku',
        title: 'Türkçe Manga Oku'
    },
    container: {
        url: 'https://turkcemangaoku.com/manga/ben-o-kisi-degilim/',
        id: JSON.stringify({ post: '1883', slug: '/manga/ben-o-kisi-degilim/'}),
        title: 'Ben O Kişi Değilim!'
    },
    child: {
        id: '/manga/ben-o-kisi-degilim/bolum-69/',
        title: 'Bölüm 69'
    },
    entry: {
        index: 0,
        size: 138_671,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());