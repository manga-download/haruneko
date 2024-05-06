import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'ganganonline',
        title: 'ガンガンONLINE (Gangan Online)'
    },
    container: {
        url: 'https://www.ganganonline.com/title/952',
        id: '952',
        title: '悪徳女王の心得'
    },
    child: {
        id: '35863',
        title: '第1章-1 - 王女と前世'
    },
    entry: {
        index: 0,
        size: 131_874,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());