import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hentaidexy',
        title: 'Hentaidexy'
    },
    container: {
        url: 'https://hentaidexy.net/manga/638755355c636ee1bff6222b/second-life-ranker',
        id: '638755355c636ee1bff6222b',
        title: 'Second Life Ranker'
    },
    child: {
        id: '649e79432081fe6c7fa67d92',
        title: 'Chapter 161'
    },
    entry: {
        index: 0,
        size: 933_472,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());