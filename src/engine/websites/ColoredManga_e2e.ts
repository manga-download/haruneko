import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'coloredmanga',
        title: 'Colored Manga'
    },
    container: {
        url: 'https://coloredmanga.com/manga/kaguya-sama-love-is-war-anime/',
        id: JSON.stringify({ post: '2753', slug: '/manga/kaguya-sama-love-is-war-anime/' }),
        title: 'Kaguya-sama: Love is War'
    },
    child: {
        id: '/manga/kaguya-sama-love-is-war-anime/volume-01/chapter-01/',
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