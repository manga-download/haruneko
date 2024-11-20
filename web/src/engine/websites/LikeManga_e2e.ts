import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
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
        size: 515_036,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();
