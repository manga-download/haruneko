import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangabz',
        title: 'MangaBz'
    },
    container: {
        url: 'https://mangabz.com/207bz/',
        id: '/207bz/',
        title: '關于我轉生后成為史萊姆的那件事'
    },
    child: {
        id: '/m442331/',
        title: '第135話'
    },
    entry: {
        index: 0,
        size: 111_534,
        type: 'image/jpeg'
    }
}).AssertWebsite();