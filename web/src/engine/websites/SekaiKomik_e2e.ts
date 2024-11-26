import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'sekaikomik',
        title: 'SekaiKomik'
    },
    container: {
        url: 'https://sekaikomik.mom/manga/circles/',
        id: '/manga/circles/',
        title: 'Circles'
    },
    child: {
        id: '/circles-chapter-1/',
        title: 'Chapter 1',
        timeout: 15000
    },
    entry: {
        index: 2,
        size: 259_614,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();