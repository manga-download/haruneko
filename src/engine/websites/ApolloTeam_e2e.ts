import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'apolloteam',
        title: 'The Apollo Team'
    },
    container: {
        url: 'https://theapollo.team/manga/warring-states/',
        id: '/manga/warring-states/',
        title: 'Warring States'
    },
    child: {
        id: '/warring-states-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 934_687,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());