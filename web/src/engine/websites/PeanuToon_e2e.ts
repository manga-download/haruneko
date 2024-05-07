import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'peanutoon',
        title: 'Peanutoon (피너툰)'
    },
    container: {
        url: 'https://www.peanutoon.com/ko/comic/detail/5765',
        id: '/ko/comic/detail/5765',
        title: '대표님의 삐뚤어진 사랑'
    },
    child: {
        id: '/ko/comic/view/103427',
        title: '1화',
    },
    entry: {
        index: 0,
        size: 32_126,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());