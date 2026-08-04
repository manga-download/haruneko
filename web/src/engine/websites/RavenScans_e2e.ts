import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ravenscans',
        title: 'Raven Scans'
    },
    container: {
        url: 'https://ravenscans.net/series/seitokai-ni-mo-ana-wa-aru/',
        id: '/series/seitokai-ni-mo-ana-wa-aru/',
        title: 'Seitokai ni mo Ana wa Aru!',
    },
    child: {
        id: '/series/seitokai-ni-mo-ana-wa-aru/chapter-51853/',
        title: 'Chapter 1',
    },
    entry: {
        index: 4,
        size: 410_624,
        type: 'image/jpeg'
    }
}).AssertWebsite();