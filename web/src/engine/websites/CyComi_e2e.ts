import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const fixtureChapter = new TestFixture({
    plugin: {
        id: 'cycomi',
        title: 'CyComi'
    },
    container: {
        url: 'https://cycomi.com/title/156',
        id: '156',
        title: 'あなたは私におとされたい'
    },
    child: {
        id: '/chapter/page/list?titleId=156&chapterId=12036',
        title: '第１話 - ジュウネンメノボクタチ'
    },
    entry: {
        index: 0,
        size: 219_613,
        type: 'image/jpeg'
    }
});
describe(fixtureChapter.Name, async () => (await fixtureChapter.Connect()).AssertWebsite());

const fixtureVolume = new TestFixture({
    plugin: {
        id: 'cycomi',
        title: 'CyComi'
    },
    container: {
        url: 'https://cycomi.com/title/147',
        id: '147',
        title: 'JACK FOX　キツネ男と鋼鉄の女'
    },
    child: {
        id: '/singleBook/detail?singleBookId=363',
        title: '第１巻 - (1-10話)'
    },
    entry: {
        index: 0,
        size: 9_928,
        type: 'image/jpeg'
    }
});
describe(fixtureVolume.Name, async () => (await fixtureVolume.Connect()).AssertWebsite());