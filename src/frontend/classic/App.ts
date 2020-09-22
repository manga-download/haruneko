import { IMangaHost } from '../../engine/MangaProvider'

export default class App {

    constructor(root: HTMLElement) {
        // artificial delay to make loading screen visible
        //await new Promise(resolve => setTimeout(resolve, 2500));
        let container = this.CreateContainer();
        container.appendChild(this.CreateInfo());
        container.appendChild(this.CreateElement('hr'));
        container.appendChild(this.CreateFrontendButtonList());
        container.appendChild(this.CreateElement('hr'));
        container.appendChild(this.CreateRequestButtonList());
        container.appendChild(this.CreateElement('hr'));
        container.appendChild(this.CreateWebsiteButtonList());
        root.appendChild(container);
    }

    private CreateElement(tag: string, html?: string): HTMLElement {
        let element = document.createElement(tag);
        if(html) {
            element.innerHTML = html;
        }
        return element;
    }

    private CreateContainer(): HTMLElement {
        let container = this.CreateElement('div');
        container.style.padding = '1em';
        return container;
    }

    private CreateInfo(): HTMLElement {
        return this.CreateElement('p', `
            <strong>Platform :</strong> ${process.platform}<br>
            <strong>NW.js :</strong> ${process.versions}
        `); // process.versions['node-webkit']
    }

    private CreateFrontendButtonList() {
        let buttons = window.Frontend.AvailableFrontends
            .filter(info => info.ID !== 'classic')
            .map(info => `<li><a href="#" onclick="Frontend.Load('${info.ID}')" title="${info.Description}">Load Frontend: ${info.Label}</a></li>`).join('');
        return this.CreateElement('ul', buttons);
    }

    private CreateRequestButtonList() {
        let list = this.CreateElement('ul');

        let buttonFetchJSON = this.CreateElement('a', `FetchJSON`) as HTMLAnchorElement;
        buttonFetchJSON.href = '#';
        buttonFetchJSON.onclick = async event => {
            let uri = new URL('https://postman-echo.com/get');
            let request = new Request(uri.href, {
                method: 'GET',
                referrer: 'https://hakuneko.download',
                headers: {
                    'user-agent': 'Mozilla/5.0 (HakuNeko; OS)',
                    'referer': 'https://hakuneko.download',
                    'origin': 'hakuneko.download',
                    'cookie': 'adult=1',
                    'X-Foo': 'bar'
                }
            });
            let data = await window.HakuNeko.RequestProvider.FetchJSON(request);
            console.log('FetchJSON:', data);
        }
        let itemFetchJSON = this.CreateElement('li');
        itemFetchJSON.appendChild(buttonFetchJSON);
        list.appendChild(itemFetchJSON);

        // another button ...

        return list;
    }

    private CreateWebsiteButtonList() {
        let list = this.CreateElement('ul');

        let getMangas = async () => {
            let website = window.HakuNeko.PluginController.WebsitePlugins[0] as IMangaHost;
            if(website) {
                return website.GetMangas();
            } else {
               return []; 
            }
        };

        let buttonGetMangas = this.CreateElement('a', `GetMangas`) as HTMLAnchorElement;
        buttonGetMangas.href = '#';
        buttonGetMangas.onclick = async event => {
            let mangas = await getMangas();
            console.log('GetMangas:', mangas);
        };
        let itemGetMangas = this.CreateElement('li');
        itemGetMangas.appendChild(buttonGetMangas);
        list.appendChild(itemGetMangas);

        let buttonGetChapters = this.CreateElement('a', `GetChapters`) as HTMLAnchorElement;
        buttonGetChapters.href = '#';
        buttonGetChapters.onclick = async event => {
            let mangas = await getMangas();
            let chapters = await mangas[0].GetChapters();
            console.log('GetChapters:', chapters);
        }
        let itemGetChapters = this.CreateElement('li');
        itemGetChapters.appendChild(buttonGetChapters);
        list.appendChild(itemGetChapters);

        let buttonGetPages = this.CreateElement('a', `GetPages`) as HTMLAnchorElement;
        buttonGetPages.href = '#';
        buttonGetPages.onclick = async event => {
            let mangas = await getMangas();
            let chapters = await mangas[0].GetChapters();
            let pages = await chapters[0].GetPages();
            console.log('GetPages:', pages);
        }
        let itemGetPages = this.CreateElement('li');
        itemGetPages.appendChild(buttonGetPages);
        list.appendChild(itemGetPages);

        return list;
    }
}