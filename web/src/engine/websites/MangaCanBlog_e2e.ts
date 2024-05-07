import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangacanblog',
        title: 'MangaCan Blog'
    },
    container: {
        url: 'https://mangacanblog.com/baca-komik-im_an_ex_class_hunter-bahasa-indonesia-online-terbaru.html',
        id: '/baca-komik-im_an_ex_class_hunter-bahasa-indonesia-online-terbaru.html',
        title: 'Im An Ex Class Hunter Indonesia Terbaru',
    },
    child: {
        id: '/baca-komik-im_an_ex_class_hunter-1-2-bahasa-indonesia-im_an_ex_class_hunter-1-terbaru.html',
        title: 'Chapter 1',
        timeout: 25000
    },
    entry: {
        index: 1,
        size: 396_835,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());