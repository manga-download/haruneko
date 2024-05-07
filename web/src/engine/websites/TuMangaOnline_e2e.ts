import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const configs: Config[] = [
    // CASE: Redirection
    {
        plugin: {
            id: 'tumangaonline',
            title: 'TuMangaOnline'
        },
        container: {
            url: 'https://visortmo.com/library/manhwa/63944/enlanube',
            id: '/library/manhwa/63944/enlanube',
            title: 'En la nube'
        },
        child: {
            id: '/view_uploads/1408620',
            title: 'Capítulo 97.00 [RE HOMOS SCAN] (es)'
        },
        entry: {
            index: 5,
            size: 53_022,
            type: 'image/webp'
        }
    },
    // CASE: Extraction
    {
        plugin: {
            id: 'tumangaonline',
            title: 'TuMangaOnline'
        },
        container: {
            url: 'https://visortmo.com/library/manhwa/34395/pheromone-holic',
            id: '/library/manhwa/34395/pheromone-holic',
            title: 'Pheromone Holic'
        },
        child: {
            id: '/view_uploads/558145',
            title: 'Capítulo 53.00  Adicta a la Feromona [FINAL] [Plot Twist No Fansub] (es)'
        },
        entry: {
            index: 1,
            size: 149_946,
            type: 'image/webp'
        }
    }
];

for(const config of configs) {
    const fixture = new TestFixture(config);
    describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
}