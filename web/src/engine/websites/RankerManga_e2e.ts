import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'rankermanga',
        title: 'Ranker-Manga'
    },
    container: {
        url: 'https://www.ranker-manga.com/series/reincarnation-of-the-strongest-sword-god/',
        id: '/series/reincarnation-of-the-strongest-sword-god/',
        title: 'Reincarnation Of The Strongest Sword God'
    },
    child: {
        id: '/reincarnation-of-the-strongest-sword-god-13/',
        title: 'ตอนที่ 13',
        timeout: 15_000
    },
    entry: {
        index: 5,
        size: 1_939_335,
        type: 'image/png'
    }
}).AssertWebsite();