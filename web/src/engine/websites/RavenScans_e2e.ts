import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ravenscans',
        title: 'Raven Scans'
    },
    container: {
        url: 'https://ravenscans.com/manga/seitokai-ni-mo-ana-wa-aru/',
        id: '/manga/seitokai-ni-mo-ana-wa-aru/',
        title: 'Seitokai ni mo Ana wa Aru!',
    },
    child: {
        id: '/seitokai-ni-mo-ana-wa-aru-chapter-1/',
        title: 'Chapter 1',
    },
    entry: {
        index: 4,
        size: 410_624,
        type: 'image/jpeg'
    }
}).AssertWebsite();