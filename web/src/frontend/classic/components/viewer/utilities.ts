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
    // Are we at the end of the page
    if (images[images.length - 1].getBoundingClientRect().bottom -window.innerHeight < 1) {
        nextItemCallback();
        return;
    }
    // Find current images within view
    const targetScrollImages = [...images].filter((image) => {
        const rect = image.getBoundingClientRect();
        return rect.top <= window.innerHeight && rect.bottom > 1;
    });

    // If multiple images filtered, get the last one. If none use the top image
    const targetScrollImage = targetScrollImages[targetScrollImages.length - 1] || images[0];

    // Is the target image top within view ? then scroll to the top of it (unless the bottom is also within view)
    if (targetScrollImage.getBoundingClientRect().top > 1 && window.innerHeight > targetScrollImage.getBoundingClientRect().bottom) {
        targetScrollImage.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'start'});
    }
    // Do we stay within target ? (bottom is further than current view)
    else if (window.innerHeight + 1 < targetScrollImage.getBoundingClientRect().bottom) {
        element.scrollBy({
            top: Math.min(
                defaultDistance,
                targetScrollImage.getBoundingClientRect().bottom -
                    window.innerHeight
            ),
            left: 0,
            behavior: 'smooth',
        });
    }
    else {
        // Next image is the first after the viewport
        const nextScrollImage = [...images].filter((image) => {
            const rect = image.getBoundingClientRect();
            return rect.top >= window.innerHeight;
        })[0];
        nextScrollImage.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'start'});
    }
}

export function toggleFullScreen() {
    if (!window.document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
}