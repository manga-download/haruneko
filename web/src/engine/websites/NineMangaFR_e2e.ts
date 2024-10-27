import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'ninemanga-fr',
        title: 'NineMangaFR'
    },
    container: {
        url: 'https://fr.ninemanga.com/manga/Lycoris+Recoil.html',
        id: '/manga/Lycoris+Recoil.html',
        title: 'Lycoris Recoil',
    },
    child: {
        id: '/chapter/Lycoris%20Recoil/722483.html',
        title: '4',
        timeout: 15000

    },
    entry: {
        index: 1,
        size: 108_568,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();