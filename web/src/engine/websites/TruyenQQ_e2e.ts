import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'truyenqq',
        title: 'TruyenQQ'
    },
    container: {
        url: 'https://truyenqqviet.com/truyen-tranh/long-phi-bat-bai-322',
        id: '/truyen-tranh/long-phi-bat-bai-322',
        title: 'Long Phi Bất Bại'
    },
    child: {
        id: '/truyen-tranh/long-phi-bat-bai-322-chap-156.html',
        title: 'Chương 156'
    },
    entry: {
        index: 1,
        size: 301_848,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());