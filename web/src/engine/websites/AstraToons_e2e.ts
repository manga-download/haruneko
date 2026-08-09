import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'astratoons',
        title: 'AstraToons'
    },
    container: {
        url: 'https://new.astratoons.com/comics/o-neto-genial-do-rei-dos-agiotas',
        id: '44',
        title: 'O Neto Genial do Rei dos Agiotas'
    },
    child: {
        id: '/comics/o-neto-genial-do-rei-dos-agiotas/capitulo/73',
        title: 'Capítulo 73'
    },
    entry: {
        index: 1,
        size: 1_604_336,
        type: 'image/jpeg'
    }
}).AssertWebsite();