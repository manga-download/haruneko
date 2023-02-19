import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangairo',
        title: 'Mangairo'
    },
    container: {
        url: 'https://w.mangairo.com/story-aq248676',
        id: '/story-aq248676' ,
        title: 'TSUKI GA MICHIBIKU ISEKAI DOUCHUU'
    },
    child: {
        id: '/story-aq248676/chapter-82',
        title: 'Chapter 82: Ilum Stalker'
    },
    entry: {
        index: 1,
        size: 841_527,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());