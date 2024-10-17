import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'oktoon',
        title: 'OkToon'
    },
    container: {
        url: 'https://oktoon.com/webtoon/content/2881',
        id: '2881',
        title: '나노마신'
    },
    child: {
        id: '1028725',
        title: '229. 제79장. 역천마제(逆天魔帝) (2)'
    },
    entry: {
        index: 0,
        size: 123_154,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());