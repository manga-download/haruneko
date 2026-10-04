import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'taiyo',
        title: 'Taiyō',
    },
    container: {
        url: 'https://taiyo.moe/media/c28bdb17-d560-44ab-9ddd-b0085aa5bdb1',
        id: 'c28bdb17-d560-44ab-9ddd-b0085aa5bdb1',
        title: 'Vinland Saga'
    },
    child: {
        id: '3b4e8398-6f77-47c8-8ca2-7c542897f56f',
        title: 'Capítulo 201 Viagem de mil anos (10)'
    },
    entry: {
        index: 0,
        size: 825_731,
        type: 'image/jpeg'
    }
}).AssertWebsite();