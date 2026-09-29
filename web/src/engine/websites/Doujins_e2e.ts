import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'doujins',
        title: 'Doujins'
    },
    container: {
        url: 'https://doujins.com/kantai-collection/xration-report-of-the-secretary-kashima-3-58575',
        id: '/kantai-collection/xration-report-of-the-secretary-kashima-3-58575',
        title: 'Kantai Collection - Report of the Secretary Kashima 3 by Xration'
    },
    child: {
        id: '/kantai-collection/xration-report-of-the-secretary-kashima-3-58575',
        title: 'Kantai Collection - Report of the Secretary Kashima 3 by Xration'
    },
    entry: {
        index: 0,
        size: 542_960,
        type: 'image/jpeg'
    }
}).AssertWebsite();