import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'hikariscan',
        title: 'Hikari Scan'
    },
    container: {
        url: 'https://hikariscan.org/manga/kaette-kudasai-akutsu-san/',
        id: JSON.stringify({ post: '20', slug: '/manga/kaette-kudasai-akutsu-san/' }),
        title: 'Kaette Kudasai! Akutsu-san'
    },
    child: {
        id: '/manga/kaette-kudasai-akutsu-san/170/',
        title: '170'
    },
    entry: {
        index: 1,
        size: 501_625,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();