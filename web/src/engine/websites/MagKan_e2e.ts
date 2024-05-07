import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'magkan',
        title: 'MagKan'
    },
    container: {
        url: 'https://kansai.mag-garden.co.jp/series/76efde6cc8881/',
        id: '/series/76efde6cc8881/',
        title: '推し変しやがれ!!'
    },
    child: {
        id: '/episodes/90451498292e5',
        title: '第七話【前】'
    },
    entry: {
        index: 1,
        size: 1_235_068,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());