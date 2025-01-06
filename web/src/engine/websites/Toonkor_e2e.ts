import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'toonkor',
        title: 'Toonkor'
    },
    container: {
        url: 'https://toonkor469.com/허니-트러블',
        id: encodeURI('/허니-트러블'),
        title: '허니 트러블'
    },
    child: {
        id: '/허니_트러블_31화.html',
        title: '31화'
    },
    entry: {
        index: 0,
        size: 130_233,
        type: 'image/jpeg'
    }
}).AssertWebsite();