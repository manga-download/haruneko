import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'comicvalkyrie',
        title: 'Comic Valkyrie'
    },
    container: {
        url: 'https://www.comic-valkyrie.com/teisou/new.html', //testing the removing of new.html on purpose
        id: '/teisou/',
        title: '貞操逆転世界'
    },
    child: {
        id: '/samplebook/val_teisou01/',
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 1_249_355,
        type: 'image/png',
        timeout: 20000
    }
}).AssertWebsite();