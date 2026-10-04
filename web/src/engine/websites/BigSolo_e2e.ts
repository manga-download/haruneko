import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'bigsolo',
        title: 'BigSolo'
    },
    container: {
        url: 'https://bigsolo.org/futari-bus',
        id: 'futari-bus',
        title: 'Futari Bus'
    },
    child: {
        id: 'n87w2zj3z7x',
        title: `27 Vacances d'été`
    },
    entry: {
        index: 0,
        size: 640_126,
        type: 'image/jpeg'
    }
}).AssertWebsite();