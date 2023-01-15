import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'truemanga',
        title: 'TrueManga'
    },
    container: {
        url: 'https://truemanga.com/queen-of-posion-the-legend-of-a-super-agent-doctor-and-princess',
        id: '/queen-of-posion-the-legend-of-a-super-agent-doctor-and-princess',
        title: 'Queen of Posion: The Legend of a Super Agent, Doctor and Princess'
    },
    child: {
        id: '/queen-of-posion-the-legend-of-a-super-agent-doctor-and-princess/chapter-1',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 44_541,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());