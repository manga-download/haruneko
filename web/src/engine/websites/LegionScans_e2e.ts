import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'legionscans',
        title: 'Legion Scans'
    },
    container: {
        url: 'https://legionscans.com/wp/manga/el-heroe-desempleado-mas-fuerte/',
        id: '/wp/manga/el-heroe-desempleado-mas-fuerte/',
        title: 'El héroe desempleado mas fuerte.'
    },
    child: {
        id: '/wp/2025/05/16/01-34/',
        title: 'Chapter 01',
    },
    entry: {
        index: 1,
        size: 322_928,
        type: 'image/jpeg'
    }
}).AssertWebsite();