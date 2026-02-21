import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangacloud',
        title: 'MangaCloud'
    },
    container: {
        url: 'https://mangacloud.org/comic/137652154381895156',
        id: '137652154381895156',
        title: 'Doctor Elise'
    },
    child: {
        id: '/comic/137652154381895156/chapter/137668869950014653',
        title: '156'
    },
    entry: {
        index: 0,
        size: 60_660,
        type: 'image/webp'
    }
}).AssertWebsite();