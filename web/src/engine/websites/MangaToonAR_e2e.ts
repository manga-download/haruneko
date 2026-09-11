import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangatoon-ar',
        title: 'MangaToon (Arabic)',
    },
    container: {
        url: 'https://ar.mangatoon.mobi/1035943-الحب-الحقيقي',
        id: '1035943',
        title: 'الحب الحقيقي'
    },
    child: {
        id: '5634',
        title: '1 الفصل'
    },
    entry: {
        index: 0,
        size: 22_260,
        type: 'image/webp'
    }
}).AssertWebsite();