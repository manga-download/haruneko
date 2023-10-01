import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'komiktap',
        title: 'KomikTap'
    },
    container: {
        url: 'https://komiktap.me/manga/a-sober-and-quiet-mother/',
        id: '/manga/a-sober-and-quiet-mother/',
        title: 'A Sober And Quiet Mother'
    },
    child: {
        id: '/a-sober-and-quiet-mother-chapter-1/',
        title: 'Chapter 1 End',
    },
    entry: {
        index: 0,
        size: 323_135,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());