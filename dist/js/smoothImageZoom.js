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

    function zoomUnzoomImage() {
        if (this.classList.contains('zoomed')) {
            this.classList.remove('zoomed');
            this.style.transform = "";
            document.querySelector('.image-backdrop').classList.remove('zoomed');
            removeZoomOutListeners();
        }
        else {

            var imageCordinates = this.getBoundingClientRect();

            var isMobileDevice = window.innerHeight > window.innerWidth;
            var imageScale = isMobileDevice ? window.innerWidth / imageCordinates.width :
                window.innerHeight / imageCordinates.height;

            var imageX = ((imageCordinates.left + (imageCordinates.width) / 2));
            var imageY = ((imageCordinates.top + (imageCordinates.height) / 2));

            var bodyX = (window.innerWidth) / 2;
            var bodyY = (window.innerHeight) / 2;


            var xOffset = (bodyX - imageX) / (imageScale);
            var yOffset = (bodyY - imageY) / (imageScale);


            this.style.transform = "scale(" + imageScale + ") translate(" + xOffset + "px," + yOffset + "px) ";
            this.classList.add('zoomed');
            document.querySelector('.image-backdrop').classList.add('zoomed');
            registersZoomOutListeners();
        }
    }

    function registersZoomOutListeners() {
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

    function scrollZoomOut() {
        if (document.querySelector('.zoomable-image.zoomed')) {
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

    function init() {
        document.addEventListener('click', function (event) {
            if (event && event.target && event.target.className.includes('zoomable-image')) {
                zoomUnzoomImage.call(event.target)
            }
        });
    }

    return {
        init: init
    }

}))