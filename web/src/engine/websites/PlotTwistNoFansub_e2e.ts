import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'plottwistnofansub',
        title: 'Plot Twist No Fansub'
    },
    container: {
        url: 'https://plotnf.com/plotwist/manga/koibumi-to-13-sai-no-actress/',
        id: '/plotwist/manga/koibumi-to-13-sai-no-actress/',
        title: 'Koibumi to 13-sai no Actress'
    },
    child: {
        id: '/reader/koibumi-to-13-sai-no-actress/chapter-9.00/',
        title: 'Capítulo 9.00: Capítulo 9'
    },
    entry: {
        index: 0,
        size: 774_159,
        type: 'image/jpeg'
    }
}).AssertWebsite();