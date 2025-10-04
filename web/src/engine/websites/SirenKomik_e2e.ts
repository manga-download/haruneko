import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'sirenkomik',
        title: 'SirenKomik'
    },
    container: {
        url: 'https://sirenkomik.xyz/manga/boku-no-kokoro-no-yabai-yatsu',
        id: 'boku-no-kokoro-no-yabai-yatsu',
        title: 'Boku no Kokoro no Yabai yatsu'
    },
    child: {
        id: 'boku-no-kokoro-no-yabai-yatsu-chapter-168',
        title: 'Chapter 168',
    },
    entry: {
        index: 0,
        size: 248_710,
        type: 'image/jpeg'
    }
}).AssertWebsite();