import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture( {
    plugin: {
        id: 'rawdevart',
        title: 'RawDevart'
    },
    container: {
        url: 'https://rawdevart.art/g/ne23178',
        id: '23178',
        title: 'Kono Gomi o Nanto Yobu'
    },
    child: {
        id: '21',
        title: '21'
    },
    entry: {
        index: 0,
        size: 139_409,
        type: 'image/jpeg'
    }
}).AssertWebsite();