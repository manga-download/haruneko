import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const configNormal: Config = {
    plugin: {
        id: 'xcalibrscans',
        title: 'xCaliBR Scans'
    },
    container: {
        url: 'https://xcalibrscans.com/webcomics/manga/the-first-ancestor-in-history/',
        id: '/webcomics/manga/the-first-ancestor-in-history/',
        title: 'The First Ancestor in History'
    },
    child: {
        id: '/the-first-ancestor-in-history-chapter-1/',
        title: 'Chapter 1',
    },
    entry: {
        index: 0,
        size: 771_615,
        type: 'image/jpeg'
    }
};

const fixtureNormal = new TestFixture(configNormal);
describe(fixtureNormal.Name, async () => (await fixtureNormal.Connect()).AssertWebsite());

const configScrambled1: Config = {
    plugin: {
        id: 'xcalibrscans',
        title: 'xCaliBR Scans'
    },
    container: {
        url: 'https://xcalibrscans.com/webcomics/manga/the-first-ancestor-in-history/',
        id: '/webcomics/manga/the-first-ancestor-in-history/',
        title: 'The First Ancestor in History'
    },
    child: {
        id: '/the-first-ancestor-in-history-chapter-86/',
        title: 'Chapter 86',
    },
    entry: {
        index: 0,
        size: 5_250_563,
        type: 'image/png'
    }
};

const fixtureScrambled1 = new TestFixture(configScrambled1);
describe(fixtureScrambled1.Name, async () => (await fixtureScrambled1.Connect()).AssertWebsite());

const configScrambled2: Config = {
    plugin: {
        id: 'xcalibrscans',
        title: 'xCaliBR Scans'
    },
    container: {
        url: 'https://xcalibrscans.com/webcomics/manga/above-ten-thousand-people/',
        id: '/webcomics/manga/above-ten-thousand-people/',
        title: 'Above Ten Thousand'
    },
    child: {
        id: '/above-ten-thousand-people-chapter-175/',
        title: 'Chapter 175',
    },
    entry: {
        index: 0,
        size: 5_771_810,
        type: 'image/png'
    }
};

const fixtureScrambled2 = new TestFixture(configScrambled2);
describe(fixtureScrambled2.Name, async () => (await fixtureScrambled2.Connect()).AssertWebsite());