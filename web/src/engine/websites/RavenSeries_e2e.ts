import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'ravenseries',
        title: 'RavenSeries'
    },
    container: {
        url: 'https://ravensword.lat/sr2/la-personaje-de-webtoon',
        id: '/sr2/la-personaje-de-webtoon',
        title: 'La personaje de webtoon',
    },
    child: {
        id: '/hz2/la-personaje-de-webtoon/127',
        title: 'Capítulo 127.00',
    },
    entry: {
        index: 1,
        size: 545_398,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());