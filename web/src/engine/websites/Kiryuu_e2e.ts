import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kiryuu',
        title: 'Kiryuu'
    },
    container: {
        url: 'https://kiryuu03.com/manga/the-modern-eras-strongest-soldier-conquers-another-worlds-dungeon/',
        id: '/manga/the-modern-eras-strongest-soldier-conquers-another-worlds-dungeon/',
        title: `The Modern Era's Strongest Soldier Conquers Another World's Dungeon`
    },
    child: {
        id: '/manga/the-modern-eras-strongest-soldier-conquers-another-worlds-dungeon/chapter-1.433123/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 705_846,
        type: 'image/png'
    }
}).AssertWebsite();