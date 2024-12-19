import { TestFixture, type Config } from '../../../test/WebsitesFixture';

function config(domain: string): Config {
    return {
        plugin: {
            id: 'truyentranhaudioonline',
            title: 'Truyện Audio',
        },
        container: {
            url: `https://${domain}/truyen-ta-co-90-ty-tien-liem-cau.html`,
            id: '/truyen-ta-co-90-ty-tien-liem-cau.html',
            title: 'Ta Có 90 Tỷ Tiền Liếm Cẩu!',
        },
        child: {
            id: '/doc-ta-co-90-ty-tien-liem-cau-chuong-200.html',
            title: 'Chapter 200',
        },
        entry: {
            index: 0,
            size: 389_471,
            type: 'image/jpeg',
        }
    };
}

new TestFixture(config('truyentutien.site')).AssertWebsite();
new TestFixture(config('truyentutien.fun')).AssertWebsite();
//new TestFixture(config('truyentutien.xyz')).AssertWebsite(); // CloudFlare
new TestFixture(config('tutientruyen4.fun')).AssertWebsite();
new TestFixture(config('tutientruyen6.xyz')).AssertWebsite();
new TestFixture(config('protruyen4.xyz')).AssertWebsite();