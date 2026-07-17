import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'seitoon',
        title: 'Seitoon'
    },
    container: {
        url: 'https://seitoon.com.tr/comics/rakipsiz-mizrak-iblisi',
        id: 'rakipsiz-mizrak-iblisi',
        title: 'Rakipsiz Mızrak İblisi'
    },
    child: {
        id: '17d233dc-a6e8-49ed-9507-b3077c60db9d',
        title: 'Bölüm 35'
    },
    entry: {
        index: 2,
        size: 590_706,
        type: 'image/webp'
    }
}).AssertWebsite();