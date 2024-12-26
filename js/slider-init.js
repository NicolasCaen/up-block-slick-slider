(function($) {
    'use strict';
    
    $(document).ready(function() {
        $('.slider-container .slides-wrapper').each(function() {
            const container = $(this).closest('.slider-container');
            
            // Récupération des options depuis les attributs data
            const options = {
                dots: container.data('dots') !== undefined ? container.data('dots') : true,
                arrows: container.data('arrows') !== undefined ? container.data('arrows') : true,
                infinite: container.data('infinite') !== undefined ? container.data('infinite') : true,
                autoplay: container.data('autoplay') !== undefined ? container.data('autoplay') : true,
                autoplaySpeed: container.data('autoplay-speed') || 3000,
                speed: container.data('speed') || 500,
                adaptiveHeight: container.data('adaptive-height') !== undefined ? container.data('adaptive-height') : true,
                fade: container.data('fade') !== undefined ? container.data('fade') : false,
                pauseOnHover: container.data('pause-hover') !== undefined ? container.data('pause-hover') : true,
                slidesToShow: 1,
                slidesToScroll: 1,
                accessibility: true,
                focusOnSelect: false,
                focusOnChange: false,
                pauseOnFocus: true,
                responsive: [
                    {
                        breakpoint: 768,
                        settings: {
                            arrows: false
                        }
                    }
                ],
                onInit: function(slick) {
                    const $slides = $(slick.$slides);
                    
                    // Supprime tous les attributs d'accessibilité par défaut de Slick
                    $slides.removeAttr('aria-hidden')
                          .removeAttr('aria-describedby')
                          .removeAttr('tabindex')
                          .removeAttr('role');
                    
                    // Configure les slides
                    $slides.each(function(index) {
                        const $slide = $(this);
                        if (index !== slick.currentSlide) {
                            $slide.prop('inert', true);
                        }
                    });
                    
                    // Active le premier slide
                    $slides.eq(slick.currentSlide).prop('inert', false);
                },
                beforeChange: function(slick, currentSlide, nextSlide) {
                    const $slides = $(slick.$slides);
                    
                    // Désactive le slide actuel
                    $slides.eq(currentSlide).prop('inert', true);
                    
                    // Active le prochain slide
                    $slides.eq(nextSlide).prop('inert', false);
                },
                afterChange: function(slick, currentSlide) {
                    const $slides = $(slick.$slides);
                    
                    // S'assure que seul le slide actif est interactif
                    $slides.each(function(index) {
                        $(this).prop('inert', index !== currentSlide);
                    });
                }
            };

            const $slider = $(this).slick(options);

            // Gestion du focus
            $slider.on('focusin', function(e) {
                if (options.autoplay) {
                    $(this).slick('slickPause');
                }
                
                const $focusedElement = $(e.target);
                const $slide = $focusedElement.closest('.slide');
                
                if ($slide.length) {
                    const slideIndex = $slide.data('slick-index');
                    if (typeof slideIndex !== 'undefined') {
                        // Active le slide focalisé
                        $slide.prop('inert', false);
                        $(this).slick('slickGoTo', slideIndex);
                    }
                }
            });

            $slider.on('focusout', function() {
                if (options.autoplay) {
                    $(this).slick('slickPlay');
                }
            });

            // Supprime les attributs aria-hidden ajoutés dynamiquement par Slick
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && 
                        (mutation.attributeName === 'aria-hidden' || 
                         mutation.attributeName === 'tabindex' || 
                         mutation.attributeName === 'role')) {
                        const $element = $(mutation.target);
                        $element.removeAttr('aria-hidden')
                               .removeAttr('tabindex')
                               .removeAttr('role');
                    }
                });
            });

            // Observer chaque slide
            $slider.find('.slide').each(function() {
                observer.observe(this, {
                    attributes: true,
                    attributeFilter: ['aria-hidden', 'tabindex', 'role']
                });
            });
        });
    });
})(jQuery); 