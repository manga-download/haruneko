import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'akumanga',
        title: 'AkuManga'
    },
    container: {
        url: 'https://akumanga.com/manga/the-idolmster-million-live-theater-days-lively-flowers/',
        id: JSON.stringify({ post: '9876', slug: '/manga/the-idolmster-million-live-theater-days-lively-flowers/' }),
        title: 'THE iDOLM@STER Million Live! Theater Days – LIVELY FLOWERS'
    },
    child: {
        id: '/manga/the-idolmster-million-live-theater-days-lively-flowers/chapter-16/',
        title: 'Chapter 16'
    },
    entry: {
        index: 0,
        size: 1_620_555,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());