import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'nightow',
        title: 'Nightow'
    },
    container: {
        url: 'https://nightow.net/online/?manga=Ano+Natsu+de+Matteru',
        id: '/online/?manga=Ano+Natsu+de+Matteru',
        title: 'Ano Natsu de Matteru'
    },
    child: {
        id: '/online/?manga=Ano+Natsu+de+Matteru&chapter=%5BNightowScans%5D+Ano+Natsu+de+Matteru+11',
        title: '11',
    },
    entry: {
        index: 1,
        size: 331_002,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());