import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangano',
        title: 'マンガノ (MangaNo)'
    },
    container: {
        url: 'https://manga-no.com/works/10431553195bd166922',
        id: '/works/10431553195bd166922',
        title: 'うちらのはなし'
    },
    child: {
        id: '/episodes/10538553195bd166922',
        title: 'うさぎ予報'
    },
    entry: {
        index: 0,
        size: 481_736,
        type: 'image/jpeg',
    }
}).AssertWebsite();