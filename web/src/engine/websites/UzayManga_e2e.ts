import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'uzaymanga',
        title: 'Uzay Manga'
    },
    container: {
        url: 'https://uzaymanga.com/manga/acimasiz-egitmen/',
        id: '/manga/acimasiz-egitmen/',
        title: 'Acımasız Eğitmen'
    },
    child: {
        id: '/okula-basla-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 1,
        size: 1_105_733,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());