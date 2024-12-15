import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mechacomic',
        title: 'MechaComic'
    },
    container: {
        url: 'https://mechacomic.jp/books/141740',
        id: '/books/141740',
        title: '青島くんはいじわる【フルカラー版】'
    },
    child: {
        id: '/free_chapters/1706074/download/1c45e1d42cc7ec0b32138389d6302cb3ee8dd456',
        title: '001話 豚足と王子様',
    },
    entry: {
        index: 0,
        size: 49_290,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();