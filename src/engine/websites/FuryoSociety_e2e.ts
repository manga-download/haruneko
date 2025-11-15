import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'furiosociety',
        title: 'Furyo Society'
    },
    container: {
        url: 'https://furyosociety.com/series/about/',
        id: '/series/about/',
        title: 'A-BOUT!',
    },
    child: {
        id: '/read/about/fr/19/165/',
        title: 'Vol.19 Chapitre 165: Viré du lycée'
    },
    entry: {
        index: 1,
        size: 891_587,
        type: 'image/png'
    }
}).AssertWebsite();