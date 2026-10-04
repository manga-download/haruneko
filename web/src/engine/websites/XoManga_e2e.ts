import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'xomanga',
        title: 'XoManga',
    },
    container: {
        url: 'https://xomanga.site/details?id=kuro-no-shoukanshi',
        id: 'kuro-no-shoukanshi',
        title: 'Kuro no Shoukanshi',
    },
    child: {
        id: '185',
        title: 'Chapter 185'
    },
    entry: {
        index: 0,
        size: 735_586,
        type: 'image/jpeg'
    }
}).AssertWebsite();