
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        window.smoothImageZoom = factory();
    }
}(function () {
    "use strict";

    var imageResizing = false;

    var zoomUnzoomImage = function (resizeEvent) {
        if (!resizeEvent && this.classList.contains('zoomed')) {
            this.classList.remove('zoomed');
            this.style.transform = "";
            document.querySelector('.full-screen-image-backdrop').classList.remove('zoomed');
            removeZoomOutListeners();
            removeResizeListener();
        }
        else {
            var imageCordinates;
            if (resizeEvent) {
                imageCordinates = this._originalImageCordinates;
            }
            else {
                imageCordinates = getBoundingClientRect(this);
                this._originalImageCordinates = imageCordinates;
            }

            var deviceRatio = window.innerHeight / window.innerWidth;
            var imageRatio = imageCordinates.height / imageCordinates.width;

            var imageScale = deviceRatio > imageRatio ?
                window.innerWidth / imageCordinates.width :
                window.innerHeight / imageCordinates.height;

            var imageX = ((imageCordinates.left + (imageCordinates.width) / 2));
            var imageY = ((imageCordinates.top + (imageCordinates.height) / 2));

            var bodyX = (window.innerWidth) / 2;
            var bodyY = (window.innerHeight) / 2;

            var xOffset = (bodyX - imageX) / (imageScale);
            var yOffset = (bodyY - imageY) / (imageScale);

            this.style.transform = "scale(" + imageScale + ") translate(" + xOffset + "px," + yOffset + "px) ";
            this.classList.add('zoomed');
            document.querySelector('.full-screen-image-backdrop').classList.add('zoomed');
            registerZoomOutListeners();
            registerResizeListener();
        }
    };

    var registerZoomOutListeners = function () {
        // zoom out on scroll
        document.addEventListener('scroll', scrollZoomOut);
        // zoom out on escape
        document.addEventListener('keyup', escapeClickZoomOut);
        // zoom out on clicking the backdrop
        document.querySelector('.full-screen-image-backdrop').addEventListener('click', backDropClickZoomOut);
    };

    var removeZoomOutListeners = function () {
        document.removeEventListener('scroll', scrollZoomOut);
        document.removeEventListener('keyup', escapeClickZoomOut);
        document.querySelector('.full-screen-image-backdrop').removeEventListener('click', backDropClickZoomOut);
    };

    var registerResizeListener = function () {
        window.addEventListener('resize', onWindowResize);
    };

    var removeResizeListener = function () {
        window.removeEventListener('resize', onWindowResize);
    };

    var scrollZoomOut = function () {
        if (document.querySelector('.zoomable-image.zoomed') && !imageResizing) {
            zoomUnzoomImage.call(document.querySelector('.zoomable-image.zoomed'));
        }
    };
    var backDropClickZoomOut = function () {
        if (document.querySelector('.zoomable-image.zoomed')) {
            zoomUnzoomImage.call(document.querySelector('.zoomable-image.zoomed'));
        }
    };
    var escapeClickZoomOut = function (event) {
        if (event.key === "Escape" && document.querySelector('.zoomable-image.zoomed')) {
            zoomUnzoomImage.call(document.querySelector('.zoomable-image.zoomed'));
        }
    };

    var onWindowResize = function () {
        imageResizing = true;
        debouncedResize();
    };

    var debounce = function (func, delay) {
        var debounceTimer;
        return function () {
            var context = this;
            var args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(function () {
                func.apply(context, args);
            }, delay);
        };
    };
    var debouncedResize = debounce(function () {
        if (document.querySelector('.zoomable-image.zoomed')) {
            zoomUnzoomImage.call(document.querySelector('.zoomable-image.zoomed'), true);
            imageResizing = false;
        }
    }, 100);

    var getBoundingClientRect = function (element) {
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
    };

    var injectCssAndBackDrop = function () {
        var myStyle = [
            ".zoomable-image { max-width: 100%; height: auto; transition: transform 0.3s; cursor: zoom-in; }",
            ".zoomable-image.zoomed { z-index: 100; position: relative; cursor: zoom-out;}",
            ".full-screen-image-backdrop.zoomed { position: fixed; top: 0; right: 0; left: 0; bottom: 0; z-index: 50; background-color: rgba(255, 255, 255, 0.95); }"
        ].join(' ');
        var head = document.head || document.getElementsByTagName('head')[0];
        var body = document.body || document.getElementsByTagName('body')[0];

        var style = document.createElement('style');
        var backDrop = document.createElement('div');

        style.type = "text/css";
        style.appendChild(document.createTextNode(myStyle));

        backDrop.className = "full-screen-image-backdrop";
        head.appendChild(style);
        body.appendChild(backDrop);
    };
    var init = function () {
        document.addEventListener('click', function (event) {
            if (event && event.target && event.target.className &&
                event.target.className.includes('zoomable-image')) {
                zoomUnzoomImage.call(event.target);
            }
        });
        injectCssAndBackDrop();
    };

    return {
        init: init
    };

}));