import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'traduccionesamistosas',
        title: 'Traducciones Amistosas'
    },
    container: {
        url: 'https://rncalation.online/comics/entrenador-de-mascotas',
        id: '/comics/entrenador-de-mascotas',
        title: 'Entrenador de Mascotas'
    },
    child: {
        id: '/comics/entrenador-de-mascotas/cap/1',
        title: 'Capítulo 1',
    },
    entry: {
        index: 3,
        size: 226_813,
        type: 'image/jpeg'
    }
}).AssertWebsite();