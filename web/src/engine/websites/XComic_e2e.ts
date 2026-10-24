import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'xcomic',
        title: 'XComic'
    },
    container: {
        url: 'https://xcomic.me/title/8mzgq',
        id: '8mzgq',
        title: 'My Husband Is an Antisocial Count!'
    },
    child: {
        id: 'e2mzray',
        title: 'Chapter 52 [END] [🇬🇧]',
    },
    entry: {
        index: 0,
        size: 110_582,
        type: 'image/webp'
    }
}).AssertWebsite();