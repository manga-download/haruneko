import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'rimuscans',
        title: 'RimuScans'
    },
    container: {
        url: 'https://rimuscans.fr/manga/bones/',
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
};

new TestFixture(config).AssertWebsite();