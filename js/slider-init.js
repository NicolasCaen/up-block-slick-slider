(function($) {
    'use strict';
    
    $(document).ready(function() {
        console.log('Slider Options:', window.upSliderOptions);

        $('.slider-container .slides-wrapper').each(function() {
            const container = $(this).closest('.slider-container');
            let $slider = $(this);
            
            // Récupérer le conteneur principal wp-block-up-block-slick-slider
            const $blockContainer = container.closest('.wp-block-up-block-slick-slider');
            
            // Récupérer les attributs depuis les data attributes du conteneur principal
            const slideHeight = $blockContainer.attr('data-slide-height');
            const heightUnit = $blockContainer.attr('data-height-unit');
            const objectFit = $blockContainer.attr('data-object-fit');

            // Debug pour vérifier les valeurs
            console.log('Block Container:', $blockContainer);
            console.log('Data Attributes:', {
                slideHeight,
                heightUnit,
                objectFit
            });

            // Appliquer les variables CSS sans valeur par défaut
            if (slideHeight && heightUnit) {
                $blockContainer.css({
                    '--slide-height': `${slideHeight}${heightUnit}`,
                    '--img-object-fit': objectFit // Suppression de la valeur par défaut
                });
            }

            // Création des flèches personnalisées avec le bon format HTML
            const prevArrow = window.upSliderOptions ? 
                `<button type="button" class="slick-prev">${window.upSliderOptions.arrow_prev_html}</button>` : 
                '<button type="button" class="slick-prev">Previous</button>';
            
            const nextArrow = window.upSliderOptions ? 
                `<button type="button" class="slick-next">${window.upSliderOptions.arrow_next_html}</button>` : 
                '<button type="button" class="slick-next">Next</button>';

            console.log('Prev Arrow HTML:', prevArrow);
            console.log('Next Arrow HTML:', nextArrow);

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
                slidesToShow: container.data('slides-to-show') || 1,
                slidesToScroll: 1,
                accessibility: true,
                focusOnSelect: false,
                focusOnChange: false,
                pauseOnFocus: true,
                centerMode: container.data('center-mode') || false,
                centerPadding: container.data('center-padding') || '50px',

                // Utilisation des flèches formatées
                prevArrow: prevArrow,
                nextArrow: nextArrow,

                responsive: [
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: container.data('slides-to-show-tablet') || 2,
                            slidesToScroll: 1,
                            arrows: true,
                            centerMode: container.data('center-mode') || false,
                            centerPadding: container.data('center-padding-tablet') || '40px'
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: container.data('slides-to-show-mobile') || 1,
                            slidesToScroll: 1,
                            arrows: false,
                            centerMode: container.data('center-mode') || false,
                            centerPadding: container.data('center-padding-mobile') || '30px'
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

            // Appliquer les styles de position des flèches si définis
            if (window.upSliderOptions && window.upSliderOptions.arrow_position) {
                const offset = window.upSliderOptions.arrow_offset || '20px';

                // Appliquer les styles en fonction de la position choisie
                switch(window.upSliderOptions.arrow_position) {
                    case 'bottom':
                        $slider.addClass('arrows-bottom');
                        break;
                    case 'overlay':
                        $slider.addClass('arrows-overlay');
                        break;
                    default: // 'side'
                        $slider.addClass('arrows-side');
                }

                // Ajouter les styles CSS correspondants
                const arrowStyles = `
                    <style>
                        .arrows-bottom .slick-prev,
                        .arrows-bottom .slick-next {
                            top: auto;
                            bottom: -${offset};
                            transform: none;
                        }
                        .arrows-overlay .slick-prev,
                        .arrows-overlay .slick-next {
                            background: transparent;
                        }
                        .arrows-side .slick-prev {
                            left: -${offset};
                        }
                        .arrows-side .slick-next {
                            right: -${offset};
                        }
                    </style>
                `;
                $('head').append(arrowStyles);
            }

            // Avant d'initialiser Slick, nettoyons les flèches existantes
            $slider.find('.slick-prev, .slick-next').remove();

            // Initialisation avec un try-catch pour déboguer
            try {
                $slider = $slider.slick(options);
                console.log('Slider initialized successfully');
            } catch (error) {
                console.error('Error initializing slider:', error);
            }

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