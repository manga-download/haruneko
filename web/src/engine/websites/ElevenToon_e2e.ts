import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: '11toon',
        title: '11toon'
    },
    container: {
        url: 'https://www.11toon.com/bbs/board.php?bo_table=toons&stx=%EC%9E%A5%EB%82%9C%EC%9D%84+%EC%9E%98%EC%B9%98%EB%8A%94+%ED%83%80%EC%B9%B4%EA%B8%B0+%EC%96%91&is=3015',
        id: '/bbs/board.php?bo_table=toons&stx=%EC%9E%A5%EB%82%9C%EC%9D%84+%EC%9E%98%EC%B9%98%EB%8A%94+%ED%83%80%EC%B9%B4%EA%B8%B0+%EC%96%91&is=3015',
        title: '장난을 잘치는 타카기 양'
    },
    child: {
        id: '/bbs/board.php?bo_table=toons&wr_id=1745031&stx=%EC%9E%A5%EB%82%9C%EC%9D%84%20%EC%9E%98%EC%B9%98%EB%8A%94%20%ED%83%80%EC%B9%B4%EA%B8%B0%20%EC%96%91&is=3015',
        title: '179화',
        timeout: 10000
    },
    entry: {
        index: 0,
        size: 237_067,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());