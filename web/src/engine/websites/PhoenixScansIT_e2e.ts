import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'phoenixscans-it',
        title: 'Phoenix Scans'
    },
    container: {
        url: 'https://www.phoenixscans.com/comics/kakko-no-iinazuke',
        id: 'kakko-no-iinazuke',
        title: 'Kakko no Iinazuke'
    },
    child: {
        id: '/read/kakko-no-iinazuke/it/vol/19/ch/164',
        title: 'Vol.19 Ch.164 - Hai frainteso tutto'
    },
    entry: {
        index: 1,
        size: 515_537,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());