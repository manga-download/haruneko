import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'traduccionesamistosas',
        title: 'Traducciones Amistosas'
    },
    container: {
        url: 'https://nartag.com/manga/entrenador-de-mascotas/',
        id: JSON.stringify({ post: '90', slug: '/manga/entrenador-de-mascotas/' }),
        title: 'Entrenador de Mascotas'
    },
    child: {
        id: '/manga/entrenador-de-mascotas/capitulos/capitulo-252/',
        title: 'Capitulo 252',
        timeout: 10000
    },
    entry: {
        index: 3,
        size: 1_869_563,
        type: 'image/jpeg'
    }
}).AssertWebsite();