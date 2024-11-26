import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'bacamanga',
        title: 'BacaManga'
    },
    container: {
        url: 'https://bacamanga.cc/komik/martial-peak/',
        id: '/komik/martial-peak/',
        title: 'Martial Peak'
    },
    child: {
        id: '/martial-peak-chapter-3772/',
        title: 'Chapter 3772'
    },
    entry: {
        index: 1,
        size: 224_158,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();