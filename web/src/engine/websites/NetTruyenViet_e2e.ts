import { TestFixture, type Config } from '../../../test/WebsitesFixture';

function config(url: string): Config {
    return {
        plugin: {
            id: 'nettruyen#BFBB5C98',
            title: 'NetTruyen Viet/WW',
        },
        container: {
            url: url,
            id: '/truyen-tranh/ta-co-90-ty-tien-liem-cau',
            title: 'Ta Có 90 Tỷ Tiền Liếm Cẩu!',
        },
        child: {
            id: '/truyen-tranh/ta-co-90-ty-tien-liem-cau/chuong-529',
            title: 'Chapter 529',
        },
        entry: {
            index: 0,
            size: 501_617,
            type: 'image/jpeg',
        }
    };
}

new TestFixture(config('https://nettruyenviet3.com/truyen-tranh/ta-co-90-ty-tien-liem-cau')).AssertWebsite();
new TestFixture(config('https://nettruyenar.com/truyen-tranh/ta-co-90-ty-tien-liem-cau-16581')).AssertWebsite();