import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture( {
    plugin: {
        id: 'rimuscans',
        title: 'RimuScans'
    },
    container: {
        url: 'https://rimuscans.com/manga/bones/',
        id: '/manga/bones/',
        title: 'Bones'
    },
    child: {
        id: '/bones-chapitre-1/',
        title: 'Chapitre 1'
    },
    entry: {
        index: 1,
        size: 1_963_861,
        type: 'image/jpeg'
    }
}).AssertWebsite();