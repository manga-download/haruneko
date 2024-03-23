//For websites similar to MangaSect, Manga347, ManhuaPlus, ManhuaGold,  MangaReader.to,

export const mangaPath ='/all-manga/{page}/';
export const queryMangaTitleFromURI = 'div.anisc-detail .manga-name';
export const queryMangas = 'div.item div.manga-detail .manga-name a';
export const queryChapters = [
    'ul#chapters-list li a.item-link',
    'ul#myUL li.chapter a',
].join(',');

export const queryPagesScript = `
    new Promise((resolve, reject) => {

        function parseResults(data) {
            const dom = new DOMParser().parseFromString(data, 'text/html');
            let nodes = [...dom.querySelectorAll('div.separator')];
            if (nodes.length == 0) reject();

            //sort if needed
            if (nodes[0].hasAttribute('data-index')) {
                nodes = nodes.sort(function (a, b) {
                    const za = parseInt(a.dataset.index);
                    const zb = parseInt(b.dataset.index);
                    return za - zb;
                });
            }
            resolve(nodes.map(element => {
                const anchorElement = element.querySelector('a.readImg');
                return anchorElement.href ;
            }));
        }

        const ajaxendpoint = new URL('/ajax/image/list/chap/'+ CHAPTER_ID, window.location.href);
        fetch(ajaxendpoint, {
            headers: {
                'X-Requested-With' : 'XMLHttpRequest',
            }})
            .then(response => response.json())
            .then(jsonData => {
                  parseResults(jsonData.html);
            });
    });
`;
