import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'hentaihall',
        title: 'HentaiHall'
    },
    container: {
        url: 'https://hentaihall.com/content/elf-tsuki-no-mahou--elf-magic-of-the-moon-d-comic-magazine-yuri-ninshin-vol--spanish-gmj-sub-digital_1759042762243',
        id: 'elf-tsuki-no-mahou--elf-magic-of-the-moon-d-comic-magazine-yuri-ninshin-vol--spanish-gmj-sub-digital_1759042762243',
        title: 'elf ~Tsuki no Mahou~ | Elf ~Magic of the Moon~ (2D Comic Magazine Yuri Ninshin Vol. 3) [Spanish] [GMj-Sub] [Digital]'
    },
    child: {
        id: 'elf-tsuki-no-mahou--elf-magic-of-the-moon-d-comic-magazine-yuri-ninshin-vol--spanish-gmj-sub-digital_1759042762243',
        title: 'elf ~Tsuki no Mahou~ | Elf ~Magic of the Moon~ (2D Comic Magazine Yuri Ninshin Vol. 3) [Spanish] [GMj-Sub] [Digital]'
    },
    entry: {
        index: 0,
        size: 358_471,
        type: 'image/jpeg'
    }
}).AssertWebsite();