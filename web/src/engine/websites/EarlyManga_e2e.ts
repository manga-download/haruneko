import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const configOndisk: Config = {
    plugin: {
        id: 'earlymanga',
        title: 'EarlyManga'
    },
    container: {
        url: 'https://earlym.org/manga/3104/i-took-over-the-demonic-ancestor',
        id: JSON.stringify({
            id: 3104,
            slug: 'i-took-over-the-demonic-ancestor'
        }),
        title: 'I Took Over the Demonic Ancestor'
    },
    child: {
        id: JSON.stringify({
            id: 303732,
            slug: '44'
        }),
        title: 'Chapter 44'
    },
    entry: {
        index: 0,
        size: 141_396,
        type: 'image/webp'
    }
};

const fixtureOnDisk = new TestFixture(configOndisk);
describe(fixtureOnDisk.Name, async () => (await fixtureOnDisk.Connect()).AssertWebsite());

const configNOTOndisk: Config = {
    plugin: {
        id: 'earlymanga',
        title: 'EarlyManga'
    },
    container: {
        url: 'https://earlym.org/manga/10/the-beginning-after-the-end',
        id: JSON.stringify({
            id: 10,
            slug: 'the-beginning-after-the-end'
        }),
        title: 'The Beginning After the End'
    },
    child: {
        id: JSON.stringify({
            id: 554824,
            slug: '185'
        }),
        title: 'Chapter 185'
    },
    entry: {
        index: 0,
        size: 18_504,
        type: 'image/png'
    }
};

const fixtureNotOnDisk = new TestFixture(configNOTOndisk);
describe(fixtureNotOnDisk.Name, async () => (await fixtureNotOnDisk.Connect()).AssertWebsite());