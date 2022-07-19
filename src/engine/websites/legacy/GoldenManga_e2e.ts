import { TestFixture } from '../../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'goldenmanga',
        title: 'المانجا الذهبية (Golden Manga)'
    }/*,
    container: {
        url: 'https://golden-manga.com/mangas/467/finding-camellia',
        id: JSON.stringify({ post: '0', slug: '/mangas/467/finding-camellia' }),
        title: 'Finding Camellia'
    },
    child: {
        id: '/mangas/467/finding-camellia/1',
        title: '1'
    },
    entry: {
        index: 0,
        size: 1_764_137,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());