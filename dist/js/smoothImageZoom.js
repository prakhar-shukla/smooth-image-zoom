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

    const zoomUnzoomImage = function (resizeEvent) {
        if (!resizeEvent && this.classList.contains('zoomed')) {
            this.classList.remove('zoomed');
            this.style.transform = "";
            document.querySelector('.full-screen-image-backdrop').classList.remove('zoomed');
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
            document.querySelector('.full-screen-image-backdrop').classList.add('zoomed');
            registerZoomOutListeners();
            registerResizeListener();
        }
    }

    const registerZoomOutListeners = function () {
        // zoom out on scroll
        document.addEventListener('scroll', scrollZoomOut);
        // zoom out on escape
        document.addEventListener('keyup', escapeClickZoomOut);
        // zoom out on clicking the backdrop
        document.querySelector('.full-screen-image-backdrop').addEventListener('click', backDropClickZoomOut);
    }

    const removeZoomOutListeners = function () {
        document.removeEventListener('scroll', scrollZoomOut);
        document.removeEventListener('keyup', escapeClickZoomOut);
        document.querySelector('.full-screen-image-backdrop').removeEventListener('click', backDropClickZoomOut);
    }

    const registerResizeListener = function () {
        window.addEventListener('resize', onWindowResize)
    }

    const removeResizeListener = function () {
        window.removeEventListener('resize', onWindowResize)
    }

    const scrollZoomOut = function () {
        if (document.querySelector('.zoomable-image.zoomed') && !imageResizing) {
            zoomUnzoomImage.call(document.querySelector('.zoomable-image.zoomed'));
        }
    }
    const backDropClickZoomOut = function () {
        if (document.querySelector('.zoomable-image.zoomed')) {
            zoomUnzoomImage.call(document.querySelector('.zoomable-image.zoomed'));
        }
    }
    const escapeClickZoomOut = function (event) {
        if (event.key === "Escape" && document.querySelector('.zoomable-image.zoomed')) {
            zoomUnzoomImage.call(document.querySelector('.zoomable-image.zoomed'));
        }
    }

    const onWindowResize = function () {
        imageResizing = true;
        if (document.querySelector('.zoomable-image.zoomed')) {
            debounce(
                function () {
                    zoomUnzoomImage.call(document.querySelector('.zoomable-image.zoomed'), true)
                    imageResizing = false;
                }, 100)()
        }
    }

    const getBoundingClientRect = function (element) {
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
    const debounce = function (func, delay) {
        let debounceTimer
        return function () {
            const context = this
            const args = arguments
            clearTimeout(debounceTimer)
            debounceTimer
                = setTimeout(() => func.apply(context, args), delay)
        }
    }
    const injectCssAndBackDrop = function () {
        let myStyle = [
            ".zoomable-image { max-width: 100%; height: auto; transition: transform 0.3s; cursor: zoom-in; }",
            ".zoomable-image.zoomed { z-index: 100; position: relative; cursor: zoom-out;}",
            ".full-screen-image-backdrop.zoomed { position: fixed; top: 0; right: 0; left: 0; bottom: 0; z-index: 50; background-color: rgba(255, 255, 255, 0.95); }"
        ].join(' ')
        var head = document.head || document.getElementsByTagName('head')[0];
        var body = document.body || document.getElementsByTagName('body')[0];

        var style = document.createElement('style');
        var backDrop = document.createElement('div')

        style.type = "text/css";
        style.appendChild(document.createTextNode(myStyle));

        backDrop.className = "full-screen-image-backdrop";
        head.appendChild(style);
        body.appendChild(backDrop);
    }
    const init = function () {
        document.addEventListener('click', function (event) {
            if (event && event.target && event.target.className &&
                event.target.className.includes('zoomable-image')) {
                zoomUnzoomImage.call(event.target)
            }
        });
        injectCssAndBackDrop();
    }

    return {
        init: init
    }

}))