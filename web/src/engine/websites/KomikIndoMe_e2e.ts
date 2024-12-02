import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'komikindome',
        title: 'KomikIndoMe'
    },
    container: {
        url: 'https://komikindo.asia/manga/secret-class/',
        id: '/manga/secret-class/',
        title: 'Secret Class'
    },
    child: {
        id: '/secret-class-chapter-217/',
        title: 'Chapter 217'
    },
    entry: {
        index: 0,
        size: 12_130,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();