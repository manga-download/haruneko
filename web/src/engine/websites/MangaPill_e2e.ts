import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangapill',
        title: 'MangaPill'
    },
    container: {
        url: 'https://mangapill.com/manga/723/chainsaw-man',
        id: '/manga/723/chainsaw-man',
        title: 'Chainsaw Man'
    },
    child: {
        id: '/chapters/723-10122000/chainsaw-man-chapter-122',
        title: 'Chapter 122'
    },
    entry: {
        index: 0,
        size: 917_623,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());