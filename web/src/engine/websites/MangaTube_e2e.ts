import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangatube',
        title: 'MangaTube',
    },
    container: {
        url: 'https://manga-tube.me/series/tales_of_demons_and_gods',
        id: '/series/tales_of_demons_and_gods',
        title: 'Tales of Demons and Gods'
    },
    child: {
        id: '/series/tales_of_demons_and_gods/read/17006/1',
        title: 'Kapitel 154.5 Banketteinladung (2)',
        //timeout: 20_000,

    },
    entry: {
        index: 0,
        size: 841_175,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());