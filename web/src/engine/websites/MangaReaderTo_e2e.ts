import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangareaderto',
        title: 'MangaReader.to'
    },
    container: {
        url: 'https://mangareader.to/akuma-no-youna-anata-26632',
        id: '/akuma-no-youna-anata-26632',
        title: 'Akuma no Youna Anata'
    },
    child: {
        id: '/read/akuma-no-youna-anata-26632/ja/volume-4',
        title: 'VOL 4 (ja)'
    },
    entry: {
        index: 0,
        size: 1_040_238,
        type: 'image/jpeg'
    }
}).AssertWebsite();

new TestFixture({
    plugin: {
        id: 'mangareaderto',
        title: 'MangaReader.to'
    },
    container: {
        url: 'https://mangareader.to/vagabond-4',
        id: '/vagabond-4',
        title: 'Vagabond'
    },
    child: {
        id: '/read/vagabond-4/en/chapter-327',
        title: 'Chapter 327: The Man Named Tadaoki (en)'
    },
    entry: {
        index: 0,
        size: 972_221,
        type: 'image/png'
    }
}).AssertWebsite();