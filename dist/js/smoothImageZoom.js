"use strict";

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        window.smoothImageZoom = factory();
    }
}(function () {
    let imageResizing = false;
    function zoomUnzoomImage(resizeEvent) {
        if (!resizeEvent && this.classList.contains('zoomed')) {
            this.classList.remove('zoomed');
            this.style.transform = "";
            document.querySelector('.image-backdrop').classList.remove('zoomed');
            removeZoomOutListeners();
            removeResizeListener();
        }
        else {
            let imageCordinates
            if (resizeEvent) {
                imageCordinates = this._originalImageCordinates;
            }
            else {
                imageCordinates = getBoundingClientRect(this);
                this._originalImageCordinates = imageCordinates;
            }

            const deviceRatio = window.innerHeight / window.innerWidth;
            const imageRatio = imageCordinates.height / imageCordinates.width;

            const imageScale = deviceRatio > imageRatio ?
                window.innerWidth / imageCordinates.width :
                window.innerHeight / imageCordinates.height;

            const imageX = ((imageCordinates.left + (imageCordinates.width) / 2));
            const imageY = ((imageCordinates.top + (imageCordinates.height) / 2));

            const bodyX = (window.innerWidth) / 2;
            const bodyY = (window.innerHeight) / 2;

            const xOffset = (bodyX - imageX) / (imageScale);
            const yOffset = (bodyY - imageY) / (imageScale);

            this.style.transform = "scale(" + imageScale + ") translate(" + xOffset + "px," + yOffset + "px) ";
            this.classList.add('zoomed');
            document.querySelector('.image-backdrop').classList.add('zoomed');
            registerZoomOutListeners();
            registerResizeListener();
        }
    }

    function registerZoomOutListeners() {
        // zoom out on scroll
        document.addEventListener('scroll', scrollZoomOut);
        // zoom out on escape
        document.addEventListener('keyup', escapeClickZoomOut);
        // zoom out on clicking the backdrop
        document.querySelector('.image-backdrop').addEventListener('click', backDropClickZoomOut);
    }

    function removeZoomOutListeners() {
        document.removeEventListener('scroll', scrollZoomOut);
        document.removeEventListener('keyup', escapeClickZoomOut);
        document.querySelector('.image-backdrop').removeEventListener('click', backDropClickZoomOut);
    }

    function registerResizeListener() {
        window.addEventListener('resize', onWindowResize)
    }

    function removeResizeListener() {
        window.removeEventListener('resize', onWindowResize)
    }

    function scrollZoomOut() {
        if (document.querySelector('.zoomable-image.zoomed') && !imageResizing) {
            zoomUnzoomImage.call(document.querySelector('.zoomable-image.zoomed'));
        }
    }
    function backDropClickZoomOut() {
        if (document.querySelector('.zoomable-image.zoomed')) {
            zoomUnzoomImage.call(document.querySelector('.zoomable-image.zoomed'));
        }
    }
    function escapeClickZoomOut(event) {
        if (event.key === "Escape" && document.querySelector('.zoomable-image.zoomed')) {
            zoomUnzoomImage.call(document.querySelector('.zoomable-image.zoomed'));
        }
    }

    function onWindowResize() {
        imageResizing = true;
        if (document.querySelector('.zoomable-image.zoomed')) {
            debounce(
                function () {
                    zoomUnzoomImage.call(document.querySelector('.zoomable-image.zoomed'), true)
                    imageResizing = false;
                }, 100)()
        }
    }

    function getBoundingClientRect(element) {
        var rect = element.getBoundingClientRect();
        return {
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            x: rect.x,
            y: rect.y
        };
    }
    function debounce(func, delay) {
        let debounceTimer
        return function () {
            const context = this
            const args = arguments
            clearTimeout(debounceTimer)
            debounceTimer
                = setTimeout(() => func.apply(context, args), delay)
        }
    }
    function init() {
        document.addEventListener('click', function (event) {
            if (event && event.target && event.target.className &&
                event.target.className.includes('zoomable-image')) {
                zoomUnzoomImage.call(event.target)
            }
        });
    }

    return {
        init: init
    }

}))