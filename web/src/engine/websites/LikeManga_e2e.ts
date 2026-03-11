import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'likemanga',
        title: 'LikeManga'
    },
    container: {
        url: 'https://likemanga.ink/my-eternal-reign-4250/',
        id: '/my-eternal-reign-4250/',
        title: 'My Eternal Reign'
    },
    child: {
        id: '/my-eternal-reign-4250/chapter-9-314555/',
        title: 'Chapter 9'
    },
    entry: {
        index: 0,
        size: 1_260_603,
        type: 'image/jpeg'
    }
}).AssertWebsite();
