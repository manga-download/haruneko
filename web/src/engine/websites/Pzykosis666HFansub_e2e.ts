import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'pzykosis666hfansub',
        title: 'Pzykosis666HFansub'
    },
    container: {
        url: 'https://lector.pzykosis666hfansub.com/series/no-es-una-fantasia-que-la-eromangaka-sea-una-pervertida/',
        id: '/series/no-es-una-fantasia-que-la-eromangaka-sea-una-pervertida/',
        title: '¿No es una fantasia que la eromangaka sea una pervertida?'
    },
    child: {
        id: '/read/no-es-una-fantasia-que-la-eromangaka-sea-una-pervertida/es-mx/0/1/',
        title: 'Capítulo 1'
    },
    entry: {
        index: 0,
        size: 2_799_081,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());