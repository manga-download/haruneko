import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'comicfans',
        title: 'ComicFans'
    },
    container: {
        url: 'https://bilibilicomics.net/comic/2179-the-saintess-has-a-showdown',
        id: '2179',
        title: 'The Saintess has a Showdown'
    },
    child: {
        id: '414',
        title: `1 - She's the Saint`
    },
    entry: {
        index: 1,
        size: 290_354,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());