import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'ikigaimangas',
        title: 'Ikigai Mangas'
    },
    container: {
        url: 'https://lectorikigai.acamu.net/series/el-sacerdote-ji-soon-es-un-santo/',
        id: '/series/el-sacerdote-ji-soon-es-un-santo/',
        title: 'El sacerdote Ji Soon es un Santo'
    },
    child: {
        id: '/capitulo/993135822339538947/',
        title: 'Capítulo 19'
    },
    entry: {
        index: 1,
        size: 3_363_253,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());