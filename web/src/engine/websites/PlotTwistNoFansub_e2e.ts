import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'plottwistnofansub',
        title: 'Plot Twist No Fansub'
    },
    container: {
        url: 'https://plotnofansub.com/manga/seitokai-ni-mo-ana-wa-aru/',
        id: '/manga/seitokai-ni-mo-ana-wa-aru/',
        title: 'Seitokai ni mo Ana wa Aru!',
        timeout: 10_000
    },
    child: {
        id: '/manga/seitokai-ni-mo-ana-wa-aru/121/',
        title: '121 Dímelo a mí también',
    },
    entry: {
        index: 0,
        size: 137_890,
        type: 'image/webp'
    }
}).AssertWebsite();