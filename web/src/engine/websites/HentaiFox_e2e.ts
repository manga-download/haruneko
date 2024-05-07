import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'hentaifox',
        title: 'HentaiFox'
    },
    container: {
        url: 'https://hentaifox.com/gallery/3161/',
        id: '/gallery/3161/',
        title: 'RE 10'
    },
    child: {
        id: '/gallery/3161/',
        title: 'RE 10'
    },
    entry: {
        index: 0,
        size: 151_623,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());