jQuery(document).ready(function($) {
    $('.wp-block-up-block-slick-slider .slides-wrapper').each(function() {
        const $container = $(this).closest('.wp-block-up-block-slick-slider');
        
        // Récupérer toutes les options depuis les data attributes
        const options = {
            dots: $container.data('dots') !== false,
            arrows: $container.data('arrows') !== false,
            infinite: $container.data('infinite') !== false,
            autoplay: $container.data('autoplay') !== false,
            autoplaySpeed: $container.data('autoplay-speed') || 3000,
            speed: $container.data('speed') || 500,
            adaptiveHeight: $container.data('adaptive-height') !== false,
            fade: $container.data('fade') === true,
            pauseOnHover: $container.data('pause-hover') !== false,
            slidesToShow: parseInt($container.data('slides-to-show')) || 1,
            slidesToScroll: 1,
            centerMode: $container.data('center-mode') === true,
            centerPadding: $container.data('center-padding') || '50px',
            prevArrow: upSliderOptions.arrow_prev_html,
            nextArrow: upSliderOptions.arrow_next_html,
            swipe: true,
            swipeToSlide: true,
            touchThreshold: 10,
            touchMove: true,
            draggable: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: parseInt($container.data('slides-to-show-tablet')) || 1,
                        centerPadding: $container.data('center-padding-tablet') || '40px',
                        swipe: true,
                        swipeToSlide: true,
                        touchThreshold: 10
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: parseInt($container.data('slides-to-show-mobile')) || 1,
                        centerPadding: $container.data('center-padding-mobile') || '30px',
                        swipe: true,
                        swipeToSlide: true,
                        touchThreshold: 10
                    }
                }
            ]
        };

        // Initialiser Slick avec les options
        $(this).slick(options);
    });
}); 