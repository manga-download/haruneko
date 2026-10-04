import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'slashlib',
        title: 'SlashLib'
    },
    container: {
        url: 'https://v2.shlib.life/ru/manga/179586--akumade-chikarawaza-no-sister',
        id: '179586--akumade-chikarawaza-no-sister',
        title: 'Сестра, обладающая силой'
    },
    child: {
        id: './manga/179586--akumade-chikarawaza-no-sister/chapter?volume=1&number=72',
        title: '72'
    },
    /* image type and size keep changing, perphaps because of mirrors
    entry: {
        index: 0,
        size: 423_402,
        type: 'image/jpeg'
    }*/
}).AssertWebsite();