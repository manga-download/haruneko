import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'lezhinx',
        title: 'Lezhin X'
    },
    container: {
        url: 'https://www.lezhinx.com/detail/guardiansofthemonsterhunters',
        id: 'guardiansofthemonsterhunters',
        title: 'Guardians of the Monster Hunters'
    },
    child: {
        id: '1',
        title: 'Episode 1'
    },
    entry: {
        index: 0,
        size: 324_438,
        type: 'image/webp'
    }
}).AssertWebsite();