import { TestFixture } from '../../../test/WebsitesFixture';

const fixture = new TestFixture ({

    plugin: {
        id: 'shueishamangaplus',
        title: 'MANGA Plus by Shueisha'
    },
    container: {
        url: 'https://mangaplus.shueisha.co.jp/titles/100269',
        id: '100269',
        title: 'Boruto: Two Blue Vortex [en]'
    },
    child: {
        id: '1018835',
        title: '1: Boruto'
    },
    entry: {
        index: 0,
        size: 159_401,
        type: 'image/jpeg'
    }
});
describe(fixture.Name, () => fixture.AssertWebsite());