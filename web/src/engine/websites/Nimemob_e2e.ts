import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'nimemob',
        title: 'Nimemob'
    },
    container: {
        url: 'https://www.nimemob.my.id/2024/09/hyouka-no-emi-ga-saku.html',
        id: '/2024/09/hyouka-no-emi-ga-saku.html',
        title: 'Hyouka no Emi ga Saku'
    },
    child: {
        id: '/2024/09/hyouka-no-emi-ga-saku-chapter-00-end.html',
        title: 'Chapter 00 End'
    },
    entry: {
        index: 1,
        size: 182_086,
        type: 'image/jpeg'
    }
}).AssertWebsite();