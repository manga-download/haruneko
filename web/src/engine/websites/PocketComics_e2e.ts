import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const configEnglish: Config = {
    plugin: {
        id: 'pocketcomics',
        title: 'Pocket-Comics (コミコ)',
        settings: {
            language: 'en-US'
        }
    },
    container: {
        url: 'https://www.pocketcomics.com/comic/10040',
        id: JSON.stringify({ id: '/comic/10040', lang: 'en-US' }),
        title: 'The Devilishly Trash Duke'
    },
    child: {
        id: '2',
        title: 'Episode 1'
    },
    entry: {
        index: 0,
        size: 114_618,
        type: 'image/jpeg'
    }
};

const fixtureEnglish = new TestFixture(configEnglish);
describe(fixtureEnglish.Name, () => fixtureEnglish.AssertWebsite());

const configFrench: Config = {
    plugin: {
        id: 'pocketcomics',
        title: 'Pocket-Comics (コミコ)',
        settings: {
            language: 'fr-FR'
        }
    },
    container: {
        url: 'https://www.pocketcomics.com/comic/10040',
        id: JSON.stringify({ id: '/comic/10040', lang: 'fr-FR' }),
        title: 'Un duc diaboliquement infâme'
    },
    child: {
        id: '2',
        title: 'Épisode 1'
    },
    entry: {
        index: 0,
        size: 105_584,
        type: 'image/jpeg'
    }
};

const fixtureFrench = new TestFixture(configFrench);
describe(fixtureFrench.Name, () => fixtureFrench.AssertWebsite());