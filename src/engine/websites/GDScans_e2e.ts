import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'gdscans',
        title: 'GD Scans'
    },
    container: {
        url: 'https://gdstmp.site/manga/sex-and-dungeon/',
        id: JSON.stringify({ post: '3279', slug: '/manga/sex-and-dungeon/' }),
        title: 'Sex and Dungeon'
    },
    child: {
        id: '/manga/sex-and-dungeon/volume-7/chapter-25/',
        title: 'Chapter 25'
    },
    entry: {
        index: 0,
        size: 721_987,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());