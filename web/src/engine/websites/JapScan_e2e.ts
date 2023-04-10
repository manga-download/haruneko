import { TestFixture } from '../../../test/WebsitesFixture';

const fixtureSingleReader = new TestFixture({
    plugin: {
        id: 'japscan',
        title: 'JapScan'
    },
    container: {
        url: 'https://www.japscan.lol/manga/jujutsu-kaisen/',
        id: '/manga/jujutsu-kaisen/',
        title: 'Jujutsu Kaisen'
    },
    child: {
        id: '/lecture-en-ligne/jujutsu-kaisen/1/',
        title: 'Chapitre 1: Esprit à double-face'
    },/* Reader is protected by CloudFlare with ~10 minute challenge reset
    entry: {
        index: 0,
        size: 614_256,
        type: 'image/jpeg'
    }*/
});
describe(fixtureSingleReader.Name, () => fixtureSingleReader.AssertWebsite());

const fixtureFullReader = new TestFixture({
    plugin: {
        id: 'japscan',
        title: 'JapScan'
    },
    container: {
        url: 'https://www.japscan.lol/manga/king-game/',
        id: '/manga/king-game/',
        title: 'King Game'
    },
    child: {
        id: '/lecture-en-ligne/king-game/1/',
        title: 'Chapitre 1'
    },/* Reader is protected by CloudFlare with ~10 minute challenge reset
    entry: {
        index: 0,
        size: 173_855,
        type: 'image/jpeg'
    }*/
});
describe(fixtureFullReader.Name, () => fixtureFullReader.AssertWebsite());