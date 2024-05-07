import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'magkan',
        title: 'MagKan'
    },
    container: {
        url: 'https://kansai.mag-garden.co.jp/oshihen/',
        id: '/oshihen/',
        title: '推し変しやがれ!!'
    },
    child: {
        id: '/assets/files/oshihen1',
        title: '第零話'
    },
    entry: {
        index: 1,
        size: 317_098,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());