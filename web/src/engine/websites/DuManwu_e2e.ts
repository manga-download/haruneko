import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'dumanwu',
        title: 'DuManwu'
    },
    container: {
        url: 'https://dumanwu.com/GZOaGwe/',
        id: 'GZOaGwe',
        title: '武道至尊'
    },
    child: {
        id: '/GZOaGwe/dWdZIVi.html',
        title: '第578话 告别'
    },
    entry: {
        index: 0,
        size: 22_759,
        type: 'image/jpeg'
    }
}).AssertWebsite();