import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hdporncomics',
        title: 'HDPornComics'
    },
    container: {
        url: 'https://hdporncomics.com/odekoron-knight-tv-movies-sex-comic/',
        id: '/odekoron-knight-tv-movies-sex-comic/',
        title: 'Odekoron Knight'
    },
    child: {
        id: '/odekoron-knight-tv-movies-sex-comic/',
        title: 'Odekoron Knight'
    },
    entry: {
        index: 0,
        size: 238_427,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();