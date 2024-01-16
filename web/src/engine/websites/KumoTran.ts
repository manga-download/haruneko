import { Tags } from '../Tags';
import icon from './KumoTran.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';

type ImageData = {
    url: string;
    script?: string
}

type PuzzleData = {
    puzzle: Array<Array<string>>,
    x: number,
    y: number
}

const pagejs = `
    new Promise((resolve) => {
      const nodes = [...document.querySelectorAll('div.reading-content img, div.reading-content canvas')];
      const data = nodes.map(element => {
          if (element instanceof HTMLCanvasElement) {
              const script = eval(element.nextElementSibling.text.replace('eval(', '('));
              const result = {
                  url : element.dataset.url,
                  script: script,
              };
              return result;
          } else {
              return { url : element.getAttribute('src') };
          }
      });
      resolve(data);
  });
`;

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.post-title-custom h1')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kumotran', 'KumoTran', 'https://www.kumotran.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Thai, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL(chapter.Identifier, this.URI).href);
        const data = await FetchWindowScript<ImageData[]>(request, pagejs, 500);
        return data.map(element => {
            if (element.script) {
                return new Page(this, chapter, new URL(element.url), { params: JSON.stringify(this.extractDescramblePattern(element.script)) });
            }
            return new Page(this, chapter, new URL(element.url));
        });
    }

    extractDescramblePattern(script : string): PuzzleData {

        const x = parseInt(script.match(/imagePuzzle\[i\]\[3\],(\d+),(\d+)/)[1]);
        const y = parseInt(script.match(/imagePuzzle\[i\]\[3\],(\d+),(\d+)/)[2]);
        const pattern = script.match(/imagePuzzle=(\[\[.*\]\]);/)[1];
        const result = {
            puzzle: JSON.parse(pattern) as Array<Array<string>>,
            x: x,
            y: y
        };
        return result;
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        if (!page.Parameters?.params) return blob;
        const payload = JSON.parse(page.Parameters.params as string) as PuzzleData;

        return DeScramble(blob, async (image, ctx) => {
            ctx.drawImage(image, 0, 0);
            for (let i = 0; i < payload.puzzle.length; i++) {
                ctx.drawImage(image, parseFloat(payload.puzzle[i][2]), parseFloat(payload.puzzle[i][3]), payload.x, payload.y, parseFloat(payload.puzzle[i][0]), parseFloat(payload.puzzle[i][1]), payload.x, payload.y);
            }
        });
    }
}