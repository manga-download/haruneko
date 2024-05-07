import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'toptoon',
        title: 'TOPTOON (탑툰)'
    },
    container: {
        url: 'https://toptoon.com/comic/ep_list/im_mother',
        id: '/comic/ep_list/im_mother',
        title: '나는 엄마다'
    },
    child: {
        id: '/comic/ep_view/im_mother/1',
        title: '시즌1 제1화 - 엄마와 딸'
    },
    entry: {
        index: 0,
        size: 164_346,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());