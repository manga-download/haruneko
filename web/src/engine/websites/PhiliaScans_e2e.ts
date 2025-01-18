import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'philiascans',
        title: 'Philia Scans'
    },
    container: {
        url: 'https://philiascans.org/series/beayal5-of-dign7ity-gfilpscyhjn12',
        id: JSON.stringify({ slug: 'beayal5-of-dign7ity-gfilpscyhjn12', id: 29}),
        title: 'Betrayal of Dignity'
    },
    child: {
        id: '/series/beayal5-of-dign7ity-gfilpscyhjn12/chapter-71',
        title: '71'
    },
    entry: {
        index: 0,
        size: 97_338,
        type: 'image/webp'
    }
}).AssertWebsite();