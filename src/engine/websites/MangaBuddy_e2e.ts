import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangabuddy',
        title: 'MangaBudy'
    },
    container: {
        url: 'https://mangabuddy.com/this-world-is-money-and-power',
        id: '/this-world-is-money-and-power',
        title: 'This World is Money and Power'
    },
    child: {
        id: '/this-world-is-money-and-power/chapter-1',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 3_054_093,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());