import { TestFixture } from '../../../test/WebsitesFixture';

const ComicConfig = {
    plugin: {
        id: 'yugenmangas-es',
        title: 'YugenMangas (ES)'
    },
    container: {
        url: 'https://yugenmangas.lat/series/la-gran-duquesa-del-norte-era-una-villana-en-secreto',
        id: 'la-gran-duquesa-del-norte-era-una-villana-en-secreto',
        title: 'La Gran Duquesa Del Norte Era Una Villana En Secreto'
    },
    child: {
        id: 'capitulo-102',
        title: 'Capitulo 102 FINAL'
    },
    entry: {
        index: 1,
        size: 3_064_669,
        type: 'image/jpeg'
    }
};

const ComicFixture = new TestFixture(ComicConfig);
describe(ComicFixture.Name, () => ComicFixture.AssertWebsite());

const NovelConfig = {
    plugin: {
        id: 'yugenmangas-es',
        title: 'YugenMangas (ES)'
    },
    container: {
        url: 'https://yugenmangas.lat/series/esposo-villano-deberias-estar-obsesionado-con-esa-persona-',
        id: 'esposo-villano-deberias-estar-obsesionado-con-esa-persona-',
        title: 'Esposo villano, deberías estar obsesionado con esa persona.'
    },
    child: {
        id: 'capitulo-1',
        title: 'Capítulo 1'
    },
    entry: {
        index: 0,
        size: 556_399,
        type: 'image/png'
    }
};

const NovelFixture = new TestFixture(NovelConfig);
describe(NovelFixture.Name, () => NovelFixture.AssertWebsite());