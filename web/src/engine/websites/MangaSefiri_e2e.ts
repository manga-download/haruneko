import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'adonisfansub',
        title: 'Adonis Fansub'
    },
    container: {
        url: 'https://mangasefiri.com/manga/evolution-begins-with-a-big-tree',
        id: '/manga/evolution-begins-with-a-big-tree',
        title: 'Evolution Begins with a Big Tree'
    },
    child: {
        id: '/chapter/1278/evolution-begins-with-a-big-tree-bolum-148/',
        title: 'Bölüm 148'
    },
    entry: {
        index: 0,
        size: 2_981_545,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());