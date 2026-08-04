import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'jjaptoon',
        title: 'Jjaptoon'
    },
    container: {
        url: 'https://www.jjaptoon004.com/comics/13520',
        id: '/comics/13520',
        title: '키스 미 이프 유 캔(Kiss Me If You Can)'
    },
    child: {
        id: '/chapters/1294298',
        title: '48화'
    },
    entry: {
        index: 2,
        size: 147_019,
        type: 'image/jpeg'
    }
}).AssertWebsite();