import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'readcomiconline',
        title: 'ReadComicOnline'
    },
    container: {
        url: 'https://readcomiconline.li/Comic/Star-Wars-Legacy-War',
        id: '/Comic/Star-Wars-Legacy-War',
        title: 'Star Wars: Legacy War'
    },
    child: {
        id: '/Comic/Star-Wars-Legacy-War/Issue-1?id=77062&readType=1&quality=hq',
        title: 'Issue #1',
    },
    entry: {
        index: 0,
        size: 1_312_286,
        type: 'image/jpeg'
    }
}).AssertWebsite();