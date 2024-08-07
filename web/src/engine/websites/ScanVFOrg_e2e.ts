import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'scanvforg',
        title: 'ScanVF.org'
    },
    container: {
        url: 'https://scanvf.org/manga/arrete-de-me-chauffer-nagatoro',
        id: '/manga/arrete-de-me-chauffer-nagatoro',
        title: 'Arrête De Me Chauffer, Nagatoro'
    },
    child: {
        id: '/scan/16827',
        title: 'Volume 7',
        timeout: 15000
    },
    entry: {
        index: 2,
        size: 157_886,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());