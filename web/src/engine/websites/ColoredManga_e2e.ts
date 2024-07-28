import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const configChapters = {
    plugin: {
        id: 'coloredmanga',
        title: 'Colored Manga'
    },
    container: {
        url: 'https://coloredmanga.net/manga/BvguMqKouwqnxtcAASsYG7mbE3bfLq',
        id: 'BvguMqKouwqnxtcAASsYG7mbE3bfLq',
        title: 'The Beginning After the End (Colour)'
    },
    child: {
        id: 'oVQ96zDSgqnRQxPhXYUr2MX33GnCg5',
        title: 'Chapter 001'
    },
    entry: {
        index: 1,
        size: 288_810,
        type: 'image/jpeg'
    }
};

const fixtureChapters = new TestFixture(configChapters);
describe(fixtureChapters.Name, async () => (await fixtureChapters.Connect()).AssertWebsite());

const configVolumes = {
    plugin: {
        id: 'coloredmanga',
        title: 'Colored Manga'
    },
    container: {
        url: 'https://coloredmanga.net/manga/ajntqpDeIHFFNifCpPhLopB6Fsairc',
        id: 'ajntqpDeIHFFNifCpPhLopB6Fsairc',
        title: 'Blame! [Master Edition] (B&W)'
    },
    child: {
        id: 'XXTfGCrCOOVpFRg41BMZBkMDbb2VHa',
        title: 'Chapter 001'
    },
    entry: {
        index: 0,
        size: 1_481_859,
        type: 'image/jpeg'
    }
};

const fixtureVolumes = new TestFixture(configVolumes);
describe(fixtureVolumes.Name, async () => (await fixtureVolumes.Connect()).AssertWebsite());