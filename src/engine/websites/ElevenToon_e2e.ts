import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: '11toon',
        title: '11toon'
    },
    container: {
        url: 'https://www.11toon.com/bbs/board.php?bo_table=toons&stx=장난을+잘치는+타카기+양&is=3015',
        id: encodeURI('/bbs/board.php?bo_table=toons&stx=장난을+잘치는+타카기+양&is=3015'),
        title: '장난을 잘치는 타카기 양'
    },
    child: {
        id: encodeURI('/bbs/board.php?bo_table=toons&wr_id=1745031&stx=장난을 잘치는 타카기 양&is=3015'),
        title: '179화',
        timeout: 10000
    },
    entry: {
        index: 0,
        size: 237_067,
        type: 'image/jpeg'
    }
}).AssertWebsite();