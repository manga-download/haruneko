import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Chapter
new TestFixture({
    plugin: {
        id: 'drecomicplus',
        title: 'DreComicPlus'
    },
    container: {
        url: 'https://drecomi-plus.jp/series/CD00006/episodes/CD00006-001-001',
        id: 'CD00006',
        title: '悪徳貴族の生存戦略'
    },
    child: {
        id: JSON.stringify({ code: 'CD00006-002-013', type: 'episode' }),
        title: '第6話（2）'
    },
    entry: {
        index: 0,
        size: 359_516,
        type: 'image/webp'
    }
}).AssertWebsite();

// CASE: Volume
new TestFixture({
    plugin: {
        id: 'drecomicplus',
        title: 'DreComicPlus'
    },
    container: {
        url: 'https://drecomi-plus.jp/series/CD00006/episodes/CD00006-001-001',
        id: 'CD00006',
        title: '悪徳貴族の生存戦略'
    },
    child: {
        id: JSON.stringify({ code: 'CD00006-001', type: 'volume' }),
        title: '1'
    },
    entry: {
        index: 0,
        size: 435_338,
        type: 'image/webp'
    }
}).AssertWebsite();