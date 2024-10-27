import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'rumanhua',
        title: 'RuManhua'
    },
    container: {
        url: 'https://rumanhua.com/IVppgVq/',
        id: 'IVppgVq',
        title: '我是怪兽大主宰'
    },
    child: {
        id: '/IVppgVq/OagmJLY.html',
        title: '第79话 吃龙心'
    },
    entry: {
        index: 5,
        size: 57_787,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();