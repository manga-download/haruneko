export function scrollSmoothly(element:HTMLElement, distance:number, horizontal = false) {
    const speed = Math.abs(Math.floor(distance / 10)),
        end = Math.abs(distance % speed);
    function doTinyScroll() {
        if (Math.abs(distance) == end) return;
        else if (distance > 0) {
            element.scrollBy(horizontal ? {
                left: speed,
            } : {
                top: speed,
            });
            distance -= speed;
        } else {
            element.scrollBy(horizontal ? {
                left: -speed,
            } : {
                top: -speed,
            });
            distance += speed;
        }
        window.requestAnimationFrame(doTinyScroll);
    }
    window.requestAnimationFrame(doTinyScroll);
}

/**
 * Dynamically change the scrolling to stop at the end of images or skip to the start of the next image
 * @param element - DOM Element to look into
 * @param selector - CSS query to find items to scroll to
 * @param defaultDistance - distance to scroll by when no snap point found
 * @param nextItemCallback - callback function when end of items has been reached
 * @param horizontal - whether to scroll horizontally instead of vertically
 */
export function scrollMagic(element: HTMLElement, selector:string, defaultDistance: number, nextItemCallback: () => void, horizontal = false) {
    const images = element.querySelectorAll(selector);
    const lastImage = images[images.length - 1];

    if (!lastImage) return;

    const viewportSize = horizontal ? window.innerWidth : window.innerHeight;

    // Are we at the end of the page
    const lastRect = lastImage.getBoundingClientRect();
    if ((horizontal ? lastRect.right : lastRect.bottom) - viewportSize < 1) {
        nextItemCallback();
        return;
    }

    const bounds = [...images].map((image) => ({ image, rect: image.getBoundingClientRect() }));
    const visibleImages = bounds.filter(({ rect }) => {
        const start = horizontal ? rect.left : rect.top;
        const end = horizontal ? rect.right : rect.bottom;
        return start <= viewportSize && end > 1;
    });

    // If multiple images filtered, get the last one. If none use the top image
    const { image: targetScrollImage, rect } = visibleImages[visibleImages.length - 1] || bounds[0];

    const start = horizontal ? rect.left : rect.top;
    const end = horizontal ? rect.right : rect.bottom;

    // Is the target image start within view ? then scroll to the start of it (unless the end is also within view)
    if (start > 1 && viewportSize > end) {
        targetScrollImage.scrollIntoView({behavior: 'smooth', block: horizontal ? 'nearest' : 'nearest', inline: horizontal ? 'start' : 'start'});
    }
    // Do we stay within target ? (end is further than current view)
    else if (viewportSize + 1 < end) {
        element.scrollBy(horizontal ? {
            left: Math.min(
                defaultDistance,
                end - viewportSize
            ),
            top: 0,
            behavior: 'smooth',
        } : {
            top: Math.min(
                defaultDistance,
                end - viewportSize
            ),
            left: 0,
            behavior: 'smooth',
        });
    }
    else {
        // Next image is the first after the viewport
        const next = bounds.find(({ rect }) => (horizontal ? rect.left : rect.top) >= viewportSize);
        next?.image.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'start'});
    }
}

export function toggleFullScreen() {
    if (!window.document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
}