import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'lermanga',
        title: 'LerManga'
    },
    container: {
        url: 'https://lermanga.org/mangas/jujutsu-kaisen/',
        id: '/mangas/jujutsu-kaisen/',
        title: 'Jujutsu Kaisen'
    },
    child: {
        id: '/capitulos/jujutsu-kaisen-capitulo-248/',
        title: 'Capítulo 248'
    },
    entry: {
        index: 2,
        size: 376_482,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());