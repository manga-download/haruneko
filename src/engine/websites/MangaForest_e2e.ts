import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangaforest',
        title: 'MangaForest'
    },
    container: {
        url: 'https://truemanga.com/beware-of-the-villainess-manhwa',
        id: '/beware-of-the-villainess-manhwa',
        title: 'Beware of the Villainess! Manhwa'
    },
    child: {
        id: '/beware-of-the-villainess-manhwa/chapter-1',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 348_202,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());