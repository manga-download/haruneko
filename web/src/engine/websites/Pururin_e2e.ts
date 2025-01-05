import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'pururin',
        title: 'Pururin'
    },
    container: {
        url: 'https://pururin.me/gallery/65780/the-rough-tempered-big-breasted-pirate-whos-addicted-to-sex',
        id: '/gallery/65780/the-rough-tempered-big-breasted-pirate-whos-addicted-to-sex',
        title: 'The Rough Tempered Big Breasted Pirate Who\'s Addicted To Sex / 気性が荒い爆乳海賊はえっちにハマる'
    },
    child: {
        id: '/read/65780/01/the-rough-tempered-big-breasted-pirate-whos-addicted-to-sex',
        title: `The Rough Tempered Big Breasted Pirate Who's Addicted To Sex / 気性が荒い爆乳海賊はえっちにハマる`
    },
    entry: {
        index: 0,
        size: 1_775_122,
        type: 'image/jpeg'
    }
}).AssertWebsite();