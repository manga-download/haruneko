import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'rawsenmanga',
        title: 'RawSenManga'
    },
    container: {
        url: 'https://raw.senmanga.com/akuyaku-reijou-no-shitsuji-sama-hametsu-flag-wa-ore-ga-tsubusasete-itadakimasu',
        id: '/akuyaku-reijou-no-shitsuji-sama-hametsu-flag-wa-ore-ga-tsubusasete-itadakimasu',
        title: 'Akuyaku Reijou no Shitsuji-sama: Hametsu Flag wa Ore ga Tsubusasete itadakimasu'
    },
    child: {
        id: '/akuyaku-reijou-no-shitsuji-sama-hametsu-flag-wa-ore-ga-tsubusasete-itadakimasu/29.1',
        title: 'Chapter 29.1'
    },
    entry: {
        index: 0,
        size: 122_414,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());