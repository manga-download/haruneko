import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Provided in Chapters
new TestFixture({
    plugin: {
        id: 'coloredmanga',
        title: 'Colored Manga'
    },
    container: {
        url: 'https://coloredmanga.net/manga/BvguMqKouwqnxtcAASsYG7mbE3bfLq',
        id: 'BvguMqKouwqnxtcAASsYG7mbE3bfLq',
        title: 'The Beginning After the End (Coloured)'
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
}).AssertWebsite();

// CASE: Provided in Volumes
new TestFixture({
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
}).AssertWebsite();