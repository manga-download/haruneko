import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ritharscans',
        title: 'Rithar Scans'
    },
    container: {
        url: 'https://ritharscans.com/series/430034ea-c3d4-458a-aa3a-363673b57aa8',
        id: '/series/430034ea-c3d4-458a-aa3a-363673b57aa8',
        title: 'Mainichi Moraeru Tsuihou Tokuten de Yuruyuru Henkyou Life!'
    },
    child: {
        id: '/read/ec763413-dd55-4b36-b482-f5086d88d680',
        title: 'Chapter 07'
    },
    entry: {
        index: 0,
        size: 942_958,
        type: 'image/jpeg'
    }
}).AssertWebsite();