import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'milasub',
        title: 'Mila Subb'
    }, /* CloudFlare
    container: {
        url: 'https://www.milasub.co/manga/i-didnt-lull-you-to-sleep/',
        id: JSON.stringify({ post: '3609', slug: '/manga/i-didnt-lull-you-to-sleep/'}),
        title: 'I Didn’t Lull You To Sleep Only For You To Be Obsessed With Me'
    },
    child: {
        id: '/manga/i-didnt-lull-you-to-sleep/5-bolum/',
        title: '5..Bölüm'
    },
    entry: {
        index: 10,
        size: 2_094_015,
        type: 'image/jpeg'
    }*/
};

new TestFixture(config).AssertWebsite();