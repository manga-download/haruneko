import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'strayfansub',
        title: 'Stray Fansub'
    },
    container: {
        url: 'https://strayfansub.com/manga/dash/',
        id: JSON.stringify({ post: '40', slug: '/manga/dash/'}),
        title: 'DASH'
    },
    child: {
        id: '/manga/dash/05-bolum/',
        title: '05. Bölüm'
    },
    entry: {
        index: 1,
        size: 1_368_758,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();