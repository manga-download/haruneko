import { TestFixture } from '../../../test/WebsitesFixture';

const fixtureChapter = new TestFixture({
    plugin: {
        id: 'piccoma-fr',
        title: 'Piccoma (French)'
    }, /* Region Locked
    container: {
        url: 'https://',
        id: '',
        title: ''
    },
    child: {
        id: '',
        title: ''
    },
    entry: {
        index: 0,
        size: 0,
        type: 'image/png'
    } */
});
describe(fixtureChapter.Name, () => fixtureChapter.AssertWebsite());

const fixtureVolume = new TestFixture({
    plugin: {
        id: 'piccoma-fr',
        title: 'Piccoma (French)'
    }, /* Region Locked
    container: {
        url: 'https://',
        id: '',
        title: ''
    },
    child: {
        id: '',
        title: ''
    },
    entry: {
        index: 0,
        size: 0,
        type: 'image/png'
    } */
});
describe(fixtureVolume.Name, () => fixtureVolume.AssertWebsite());