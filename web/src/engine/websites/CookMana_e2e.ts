import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'cookmana',
        title: 'CookMana'
    },
    container: {
        url: 'https://cookmana.com/episode/3015',
        id: '3015',
        title: '장난을 잘치는 타카기 양'
    },
    child: {
        id: '1745031',
        title: '179화'
    },
    entry: {
        index: 0,
        size: 237_067,
        type: 'image/jpeg'
    }
}).AssertWebsite();