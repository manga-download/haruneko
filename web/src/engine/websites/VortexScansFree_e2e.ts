import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'vortexscansfree',
        title: 'Vortex Scans Free'
    },
    container: {
        url: 'https://vortexscansfree.com/manga/apocalyptic-chef-awakening/',
        id: '/manga/apocalyptic-chef-awakening/',
        title: 'Apocalyptic Chef Awakening'
    },
    child: {
        id: '/apocalyptic-chef-awakening-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 4,
        size: 585_984,
        type: 'image/webp'
    }
}).AssertWebsite();