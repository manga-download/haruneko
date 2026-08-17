export function scrollSmoothly(element:HTMLElement, distance:number) {
    const speed = Math.abs(Math.floor(distance / 10)),
        end = Math.abs(distance % speed);
    function doTinyScroll() {
        if (Math.abs(distance) == end) return;
        else if (distance > 0) {
            element.scrollBy({
                top: speed,
            });
            distance -= speed;
        } else {
            element.scrollBy({
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
 */
export function scrollMagic(element: HTMLElement, selector:string, defaultDistance: number, nextItemCallback: () => void) {
    const images = element.querySelectorAll(selector);
    const lastImage = images[images.length - 1];

    if (!lastImage) return;

    // Are we at the end of the page
    if (lastImage.getBoundingClientRect().bottom - window.innerHeight < 1) {
        nextItemCallback();
        return;
    }

    const bounds = [...images].map((image) => ({ image, rect: image.getBoundingClientRect() }));
    const visibleImages = bounds.filter(({ rect }) => rect.top <= window.innerHeight && rect.bottom > 1);

    // If multiple images filtered, get the last one. If none use the top image
    const { image: targetScrollImage, rect } = visibleImages[visibleImages.length - 1] || bounds[0];

    // Is the target image top within view ? then scroll to the top of it (unless the bottom is also within view)
    if (rect.top > 1 && window.innerHeight > rect.bottom) {
        targetScrollImage.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'start'});
    }
    // Do we stay within target ? (bottom is further than current view)
    else if (window.innerHeight + 1 < rect.bottom) {
        element.scrollBy({
            top: Math.min(
                defaultDistance,
                rect.bottom - window.innerHeight
            ),
            left: 0,
            behavior: 'smooth',
        });
    }
    else {
        // Next image is the first after the viewport
        const next = bounds.find(({ rect }) => rect.top >= window.innerHeight);
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