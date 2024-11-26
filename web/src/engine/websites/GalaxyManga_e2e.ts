import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'galaxymanga',
        title: 'Galaxy Manga'
    },
    container: {
        url: 'https://gxcomic.xyz/series/53488-850-berserk',
        id: '/series/53488-850-berserk',
        title: 'Berserk'
    },
    child: {
        id: '/read/webtoon/53488-30402-chapter-1',
        title: 'فصل 1'
    },
    entry: {
        index: 4,
        size: 588_994,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();