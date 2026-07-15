import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'lycantoons',
        title: 'Lycantoons'
    },
    container: {
        url: 'https://lycantoons.com/series/domei-o-tirano-e-fugi',
        id: 'domei-o-tirano-e-fugi',
        title: 'Domei o Tirano e Fugi'
    },
    child: {
        id: '/series/domei-o-tirano-e-fugi/124',
        title: 'Cap. 124'
    },
    entry: {
        index: 2,
        size: 992_282,
        type: 'image/avif'
    }
}).AssertWebsite();