import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ritto',
        title: 'Ritto',
    },
    container: {
        url: 'https://ritto.cc/obra/junket-bank',
        id: '/obra/junket-bank',
        title: 'Junket Bank'
    },
    child: {
        id: '/obra/junket-bank/capitulo/capitulo-1',
        title: 'Cap. 1 Mafutsu Shin'
    },
    entry: {
        index: 1,
        size: 165_772,
        type: 'image/webp'
    }
}).AssertWebsite();