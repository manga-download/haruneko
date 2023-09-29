import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangagreat',
        title: 'MangaGreat'
    },
    container: {
        url: 'https://mangagreat.org/manga/dragon-devouring-mage/',
        id: JSON.stringify({ post: '23257', slug: '/manga/dragon-devouring-mage/' }),
        title: 'Dragon Devouring Mage'
    },
    child: {
        id: '/manga/dragon-devouring-mage/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 581_846,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());