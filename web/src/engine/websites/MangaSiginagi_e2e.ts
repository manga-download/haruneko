import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangasiginagi',
        title: 'Manga Siginagi'
    },
    container: {
        url: 'https://mangasiginagi.com/manga/utangac-kouhai-internet-unlusu-oldu/',
        id: '/manga/utangac-kouhai-internet-unlusu-oldu/',
        title: 'Utangaç Kouhai İnternet Ünlüsü Oldu'
    },
    child: {
        id: '/utangac-kouhai-internet-unlusu-oldu-bolum-7/',
        title: 'Bölüm 7'
    },
    entry: {
        index: 0,
        size: 1_275_307,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());