import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manhuaread',
        title: 'ManhuaRead'
    },
    container: {
        url: 'https://manhuaread.com/manhua/unlovable-replacement/',
        id: JSON.stringify({ post: '22450', slug: '/manhua/unlovable-replacement/' }),
        title: 'Unlovable Replacement'
    },
    child: {
        id: '/manhua/unlovable-replacement/chapter-113/',
        title: 'Chapter 113'
    },
    entry: {
        index: 0,
        size: 16_703,
        type: 'image/jpeg'
    }
}).AssertWebsite();