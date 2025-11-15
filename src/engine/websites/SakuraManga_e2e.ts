import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'sakuramanga',
        title: 'Sakura Manga'
    },
    container: {
        url: 'https://mangasakura.com/p-5-toubun-no-hanayome/',
        id: '/p-5-toubun-no-hanayome/',
        title: '5-toubun no Hanayome 五等分の花嫁'
    },
    child: {
        id: '/5-toubun-no-hanayome/5-toubun-no-hanayome-chap-121/',
        title: '5-toubun no Hanayome chap 121'
    },
    entry: {
        index: 0,
        size: 202_535,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();