import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'sinensisscan',
        title: 'Sinensis Scans',
        timeout: 35000, //warning : WEBSITE IS SLOW IN BROWSER
    }, /* CloudFlare
    container: {
        url: 'https://sinensistoon.com/a-vida-de-um-passarinho/',
        id: '/a-vida-de-um-passarinho/',
        title: 'A Vida de Um Passarinho',
    },
    child: {
        id: '/a-vida-de-um-passarinho/01/',
        title: 'Capítulo 01',
    },
    entry: {
        index: 0,
        size: 148_236,
        type: 'image/avif'
    } */
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());