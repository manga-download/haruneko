import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'cgbum',
        title: 'CGBum',
    },
    container: {
        url: 'https://cgbum.com/komik/all-hail-the-sect-leaderscgbum',
        id: '/komik/all-hail-the-sect-leaderscgbum',
        title: 'All Hail the Sect Leaders'
    },
    child: {
        id: '/baca/all-hail-the-sect-leaderscgbum/chapter/558',
        title: 'Ch. 558'
    },
    entry: {
        index: 2,
        size: 168_347,
        type: 'image/jpeg'
    }
}).AssertWebsite();