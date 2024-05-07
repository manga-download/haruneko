import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'sssscanlator',
        title: 'SSS Scanlator'
    },
    container: {
        url: 'https://sssscanlator.com.br/manga/a-lenda-do-general-estelar/',
        id: '/manga/a-lenda-do-general-estelar/',
        title: 'A Lenda do General Estelar'
    },
    child: {
        id: '/a-lenda-do-general-estelar-capitulo-154/',
        title: 'Capítulo 154',
        timeout: 15000
    },
    entry: {
        index: 1,
        size: 3_571_660,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());