import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'nettruyen#F941B05A',
        title: 'NetTruyen ZZZ',
    },
    container: {
        url: 'https://nettruyenzzz.fun/truyen/ta-co-90-ty-tien-liem-cau-100366',
        id: '/truyen/ta-co-90-ty-tien-liem-cau-100366',
        title: 'Ta Có 90 Tỷ Tiền Liếm Cẩu!',
    },
    child: {
        id: '/truyen/ta-co-90-ty-tien-liem-cau-100366/chuong/823063',
        title: 'Chapter 200',
    },
    entry: {
        index: 0,
        size: 301_902,
        type: 'image/jpeg',
    },
};

new TestFixture(config).AssertWebsite();