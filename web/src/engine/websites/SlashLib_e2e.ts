import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'slashlib',
        title: 'SlashLib'
    },
    container: {
        url: 'https://v2.slashlib.me/ru/manga/179586--akumade-chikarawaza-no-sister',
        id: '179586--akumade-chikarawaza-no-sister',
        title: 'Сестра, обладающая силой'
    },
    child: {
        id: './manga/179586--akumade-chikarawaza-no-sister/chapter?volume=1&number=72',
        title: '72'
    },
    entry: {
        index: 0,
        size: 515_140,
        type: 'image/webp'
    }
}).AssertWebsite();