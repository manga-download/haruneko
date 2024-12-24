import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'arurascansfree',
        title: 'Asura Scans Free',
    },
    container: {
        url: 'https://asurascansfree.com/serie/academys-genius-swordmaster/',
        id: '/serie/academys-genius-swordmaster/',
        title: 'Academy’s Genius Swordmaster',
    },
    child: {
        id: '/academys-genius-swordmaster-chapter-1/',
        title: 'Chapter 1',
    },
    entry: {
        index: 1,
        size: 822_646,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();