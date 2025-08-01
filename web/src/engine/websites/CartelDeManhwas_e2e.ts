import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'carteldemanhwas',
        title: 'Cartel De Manhwas'
    },
    container: {
        url: 'https://carteldemanhwas.net/proyectos/alejate-de-mi-hijo/',
        id: '/proyectos/alejate-de-mi-hijo/',
        title: 'Aléjate de mi hijo'
    },
    child: {
        id: '/alejate-de-mi-hijo-capitulo-1/',
        title: 'Chapter 1 - Un reencuentro no deseado'
    },
    entry: {
        index: 1,
        size: 357_404,
        type: 'image/png'
    }
}).AssertWebsite();