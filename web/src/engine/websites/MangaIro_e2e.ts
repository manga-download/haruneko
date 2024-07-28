import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangairo',
        title: 'Mangairo'
    },
    container: {
        url: 'https://chap.mangairo.com/story-aq248676',
        id: 'https://chap.mangairo.com/story-aq248676',
        title: 'TSUKI GA MICHIBIKU ISEKAI DOUCHUU'
    },
    child: {
        id: 'https://chap.mangairo.com/story-aq248676/chapter-82',
        title: 'Chapter 82: Ilum Stalker'
    },
    entry: {
        index: 1,
        size: 841_527,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());