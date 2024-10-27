import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Single-Page Images
new TestFixture({
    plugin: {
        id: 'usagi',
        title: 'Usagi'
    },
    container: {
        url: 'https://web.usagi.one/omniscient_reader_s_viewpoint',
        id: '/omniscient_reader_s_viewpoint',
        title: 'Всеведущий читатель'
    },
    child: {
        id: '/omniscient_reader_s_viewpoint/vol1/100',
        title: '1 - 100 То, что невозможно изменить - часть 2'
    },
    entry: {
        index: 0,
        size: 950_618,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE: Multi-Page Images
new TestFixture({
    plugin: {
        id: 'usagi',
        title: 'Usagi'
    },
    container: {
        url: 'https://web.usagi.one/one_piece',
        id: '/one_piece',
        title: 'Ван Пис'
    },
    child: {
        id: '/one_piece/vol100/1010',
        title: '100 - 1010 Королевская воля'
    },
    entry: {
        index: 1,
        size: 554_563,
        type: 'image/png'
    }
}).AssertWebsite();