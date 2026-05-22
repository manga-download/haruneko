import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ngomik',
        title: 'Ngomik'
    },
    container: {
        url: 'https://id.ngomik.cloud/manga/reborn-as-the-heavenly-demon/',
        id: '/manga/reborn-as-the-heavenly-demon/',
        title: 'Reborn as The Heavenly Demon'
    },
    child: {
        id: '/reborn-as-the-heavenly-demon-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 359_729,
        type: 'image/jpeg'
    }
}).AssertWebsite();