export function scrollSmoothly(element, distance) {
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
 */
export function scrollMagic(element: HTMLElement, defaultDistance: number, nextItemCallback: () => void) {
    let images = element.querySelectorAll('.image');
    // Are we at the end of the page
    if (images[images.length - 1].getBoundingClientRect().bottom -window.innerHeight < 1) {
        nextItemCallback();
        return;
    }
    // Lets stay on current page
    // Find current image within view
    let targetScrollImages = [...images].filter((image) => {
        let rect = image.getBoundingClientRect();
        return rect.top <= window.innerHeight && rect.bottom > 1;
    });

    // If multiple images filtered, get the last one. If none use the top image
    let targetScrollImage = targetScrollImages[targetScrollImages.length - 1] || images[0];

    // Is the target image top within view ? then scroll to the top of it
    if (targetScrollImage.getBoundingClientRect().top > 1) {
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
    // We have to try to get to next image
    else {
        // Find next image
        let nextScrollImage = targetScrollImage.nextElementSibling;
        // Scroll to it
        nextScrollImage.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'start'});
    }
}