import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'thebullyproject',
        title: 'The Bully Project',
    },
    container: {
        url: 'https://thebullyproject.com/chainsaw-man',
        id: '/chainsaw-man',
        title: 'Chainsaw Man'
    },
    child: {
        id: '/chainsaw-man-ep0232',
        title: 'ตอนที่ 232'
    },
    entry: {
        index: 0,
        size: 478_324,
        type: 'image/jpeg'
    }
}).AssertWebsite();