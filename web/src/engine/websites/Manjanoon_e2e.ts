import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manjanoon',
        title: 'Manjanoon'
    },
    container: {
        url: 'https://manjanoon.art/series/76e12b14-016f-498b-b28f-95965c50747c',
        id: '/series/76e12b14-016f-498b-b28f-95965c50747c',
        title: 'Put Me to Sleep'
    },
    child: {
        id: '/read/a64f046f-0244-4008-bc88-eccd6f96f21d',
        title: 'فصل 26'
    },
    entry: {
        index: 0,
        size: 756_503,
        type: 'image/jpeg'
    }
}).AssertWebsite();