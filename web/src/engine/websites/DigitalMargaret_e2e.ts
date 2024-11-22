import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'digitalmargaret',
        title: 'デジタルマーガレット (Digital Margaret)'
    },
    container: {
        url: 'https://digitalmargaret.jp/detail/dansou/',
        id: '/detail/dansou/',
        title: '策士な女装王子は男装令嬢とのいちゃラブをご所望です'
    },
    child: {
        id: '/contents/dansou/241101_1-1bd1f5e685898bb58781b42ad6094eb75/',
        title: '第1-1話'
    },
    entry: {
        index: 0,
        size: 1_570_077,
        type: 'image/png',
        timeout: 20000
    }
};

new TestFixture(config).AssertWebsite();