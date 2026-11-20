import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaball',
        title: 'MangaBall'
    },
    container: {
        url: 'https://mangaball.com/title-detail/68515398702284f83417819d-sss-class-revival-hunter',
        id: '68515398702284f83417819d',
        title: 'SSS-Class Revival Hunter',
        timeout: 10_000
    },
    child: {
        id: '6ae70b26077bfd62f23f3c17',
        title: 'Chapter 157 [Pitagora] [it]'
    },
    entry: {
        index: 0,
        size: 200_784,
        type: 'image/jpeg'
    }
}).AssertWebsite();