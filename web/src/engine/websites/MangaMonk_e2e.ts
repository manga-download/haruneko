import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangamonk',
        title: 'MangaMonk'
    },
    container: {
        url: 'https://mangamonk.com/queen-of-posion-the-legend-of-a-super-agent-doctor-and-princess',
        id: '/queen-of-posion-the-legend-of-a-super-agent-doctor-and-princess',
        title: 'Queen Of Posion: The Legend Of A Super Agent, Doctor And Princess'
    },
    child: {
        id: '/queen-of-posion-the-legend-of-a-super-agent-doctor-and-princess/chapter-1-the-eloquent-dying-girl',
        title: 'Chapter 1: The Eloquent Dying Girl'
    },
    entry: {
        index: 0,
        size: 44_541,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());