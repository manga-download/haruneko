import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'comicsvalley',
        title: 'Comics Valley'
    },
    container: {
        url: 'https://comicsvalley.com/adult-comics/llxbd-snowball/',
        id: JSON.stringify({ post: '11403', slug: '/adult-comics/llxbd-snowball/' }),
        title: 'LLXBD Snowball'
    },
    child: {
        id: '/adult-comics/llxbd-snowball/snowball-1-0/',
        title: 'Snowball 1.0'
    },
    entry: {
        index: 0,
        size: 246_192,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());