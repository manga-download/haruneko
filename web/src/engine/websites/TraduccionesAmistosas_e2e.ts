import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'traduccionesamistosas',
        title: 'Traducciones Amistosas'
    },
    container: {
        url: 'https://traduccionesamistosas.eyudud.net/manga/entrenador-de-mascotas/',
        id: JSON.stringify({ post: '90', slug: '/manga/entrenador-de-mascotas/' }),
        title: 'Entrenador de Mascotas'
    },
    child: {
        id: '/manga/entrenador-de-mascotas/capitulo-252/',
        title: 'Capitulo 252'
    },
    entry: {
        index: 3,
        size: 1_869_563,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();