import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'ikiru',
        title: 'Ikiru'
    },
    container: {
        url: 'https://ikiru.one/manga/martial-peak/',
        id: '/manga/martial-peak/',
        title: 'Martial Peak'
    },
    child: {
        id: '/martial-peak-chapter-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 0,
        size: 124_648,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();