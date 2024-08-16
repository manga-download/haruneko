import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'truyentranhaudioonline',
        title: 'Truyện tranh online'
    },
    container: {
        url: 'https://protruyen4.xyz/truyen-nguyen-ton.html',
        id: '/truyen-nguyen-ton.html',
        title: 'Nguyên Tôn'
    },
    child: {
        id: '/doc-nguyen-ton-chuong-899.html',
        title: 'Chapter 899'
    },
    entry: {
        index: 0,
        size: 457_292,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());