import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'coloredmanga',
        title: 'Colored Manga'
    },
    container: {
        url: 'https://coloredmanga.com/mangas/love-is-war-by-kaguya/',
        id: JSON.stringify({ post: '2753', slug: '/mangas/love-is-war-by-kaguya/' }),
        title: 'Kaguya-sama: Love is War – Full Color — {Official TL} (EN)'
    },
    child: {
        id: '/mangas/love-is-war-by-kaguya/volume-01/chapter-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 0,
        size: 711_421,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());