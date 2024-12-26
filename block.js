const { registerBlockType } = wp.blocks;
const { createElement, Fragment } = wp.element;
const { InnerBlocks, useBlockProps, InspectorControls } = wp.blockEditor;
const { Button, PanelBody, ToggleControl, RangeControl, SelectControl } = wp.components;

registerBlockType('up/block-slick-slider', {
    title: 'UP Block Slick Slider',
    icon: 'images-alt2',
    category: 'common',
    
    supports: {
        align: true,
        alignWide: true,
        spacing: {
            margin: true,
            padding: true
        }
    },
    
    attributes: {
        align: {
            type: 'string',
            default: 'full'
        },
        // Options de hauteur
        slideHeight: {
            type: 'number',
            default: 400
        },
        heightUnit: {
            type: 'string',
            default: 'px'
        },
        // Options Slick
        dots: {
            type: 'boolean',
            default: true
        },
        arrows: {
            type: 'boolean',
            default: true
        },
        infinite: {
            type: 'boolean',
            default: true
        },
        autoplay: {
            type: 'boolean',
            default: true
        },
        autoplaySpeed: {
            type: 'number',
            default: 3000
        },
        speed: {
            type: 'number',
            default: 500
        },
        adaptiveHeight: {
            type: 'boolean',
            default: true
        },
        fade: {
            type: 'boolean',
            default: false
        },
        pauseOnHover: {
            type: 'boolean',
            default: true
        },
        // Ajout de l'option pour le nombre de slides
        slidesToShow: {
            type: 'number',
            default: 1
        },
        slidesToShowMobile: {
            type: 'number',
            default: 1
        },
        slidesToShowTablet: {
            type: 'number',
            default: 2
        },
        centerMode: {
            type: 'boolean',
            default: false
        },
        centerPadding: {
            type: 'string',
            default: '50px'
        },
        // Pour le centerPadding responsive
        centerPaddingTablet: {
            type: 'string',
            default: '40px'
        },
        centerPaddingMobile: {
            type: 'string',
            default: '30px'
        },
        usePostImages: {
            type: 'boolean',
            default: false
        },
        useFixedHeight: {
            type: 'boolean',
            default: false
        },
        objectFit: {
            type: 'string',
            default: 'cover'
        },
        slideRatio: {
            type: 'string',
            default: 'original'
        },
        customRatioWidth: {
            type: 'number',
            default: 16
        },
        customRatioHeight: {
            type: 'number',
            default: 9
        }
    },
    
    edit: function(props) {
        const { attributes, setAttributes } = props;
        const blockProps = useBlockProps({
            className: `align${attributes.align || ''}`,
            style: {
                '--slide-height': `${attributes.slideHeight}${attributes.heightUnit}`
            }
        });

        const ALLOWED_BLOCKS = ['core/group'];
        const TEMPLATE = [
            ['core/group', { 
                className: 'slide'
            }, [
                ['core/image', {}]
            ]]
        ];

        const addNewSlide = () => {
            const block = wp.blocks.createBlock('core/group', {
                className: 'slide'
            }, [
                wp.blocks.createBlock('core/image', {})
            ]);
            wp.data.dispatch('core/block-editor').insertBlock(
                block,
                undefined,
                props.clientId
            );
        };

        // Ajout des contrôles dans le panneau latéral
        const inspectorControls = createElement(
            InspectorControls,
            null,
            createElement(
                PanelBody,
                {
                    title: 'Dimensions du Slider',
                    initialOpen: true
                },
                createElement(ToggleControl, {
                    label: 'Utiliser une hauteur fixe',
                    checked: attributes.useFixedHeight,
                    onChange: (value) => setAttributes({ useFixedHeight: value })
                }),
                attributes.useFixedHeight && createElement(
                    Fragment,
                    null,
                    createElement(RangeControl, {
                        label: 'Hauteur du slide',
                        value: attributes.slideHeight,
                        onChange: (value) => setAttributes({ slideHeight: value }),
                        min: 0,
                        max: 1000,
                        step: 10
                    }),
                    createElement(SelectControl, {
                        label: 'Unité de mesure',
                        value: attributes.heightUnit,
                        options: [
                            { label: 'Pixels (px)', value: 'px' },
                            { label: 'Viewport Height (vh)', value: 'vh' },
                            { label: 'Pourcentage (%)', value: '%' },
                            { label: 'REM', value: 'rem' }
                        ],
                        onChange: (value) => setAttributes({ heightUnit: value })
                    })
                ),
                createElement(SelectControl, {
                    label: 'Ajustement des images',
                    value: attributes.objectFit,
                    options: [
                        { label: 'Cover (remplir)', value: 'cover' },
                        { label: 'Contain (contenir)', value: 'contain' },
                        { label: 'Fill (étirer)', value: 'fill' },
                        { label: 'None (taille réelle)', value: 'none' }
                    ],
                    onChange: (value) => setAttributes({ objectFit: value })
                }),
                createElement(SelectControl, {
                    label: 'Ratio des slides',
                    value: attributes.slideRatio,
                    options: [
                        { label: 'Original (pas de ratio forcé)', value: 'original' },
                        { label: '16:9', value: '16:9' },
                        { label: '4:3', value: '4:3' },
                        { label: '3:2', value: '3:2' },
                        { label: '1:1', value: '1:1' },
                        { label: '2:3', value: '2:3' },
                        { label: '9:16', value: '9:16' },
                        { label: 'Personnalisé', value: 'custom' }
                    ],
                    onChange: (value) => setAttributes({ slideRatio: value })
                }),
                attributes.slideRatio === 'custom' && createElement(
                    'div',
                    { style: { display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' } },
                    [
                        createElement(RangeControl, {
                            label: 'Largeur',
                            value: attributes.customRatioWidth,
                            onChange: (value) => setAttributes({ customRatioWidth: value }),
                            min: 1,
                            max: 32,
                            step: 1
                        }),
                        createElement('span', null, ':'),
                        createElement(RangeControl, {
                            label: 'Hauteur',
                            value: attributes.customRatioHeight,
                            onChange: (value) => setAttributes({ customRatioHeight: value }),
                            min: 1,
                            max: 32,
                            step: 1
                        })
                    ]
                )
            ),
            createElement(
                PanelBody,
                {
                    title: 'Options du Slider',
                    initialOpen: true
                },
                createElement(ToggleControl, {
                    label: 'Afficher les points de navigation',
                    checked: attributes.dots,
                    onChange: (value) => setAttributes({ dots: value })
                }),
                createElement(ToggleControl, {
                    label: 'Afficher les flèches',
                    checked: attributes.arrows,
                    onChange: (value) => setAttributes({ arrows: value })
                }),
                createElement(ToggleControl, {
                    label: 'Défilement infini',
                    checked: attributes.infinite,
                    onChange: (value) => setAttributes({ infinite: value })
                }),
                createElement(ToggleControl, {
                    label: 'Lecture automatique',
                    checked: attributes.autoplay,
                    onChange: (value) => setAttributes({ autoplay: value })
                }),
                createElement(RangeControl, {
                    label: 'Vitesse de défilement (ms)',
                    value: attributes.speed,
                    onChange: (value) => setAttributes({ speed: value }),
                    min: 100,
                    max: 1000,
                    step: 100
                }),
                createElement(RangeControl, {
                    label: 'Délai entre les slides (ms)',
                    value: attributes.autoplaySpeed,
                    onChange: (value) => setAttributes({ autoplaySpeed: value }),
                    min: 1000,
                    max: 10000,
                    step: 500
                }),
                createElement(ToggleControl, {
                    label: 'Hauteur adaptative',
                    checked: attributes.adaptiveHeight,
                    onChange: (value) => setAttributes({ adaptiveHeight: value })
                }),
                createElement(ToggleControl, {
                    label: 'Effet fondu',
                    checked: attributes.fade,
                    onChange: (value) => setAttributes({ fade: value })
                }),
                createElement(ToggleControl, {
                    label: 'Pause au survol',
                    checked: attributes.pauseOnHover,
                    onChange: (value) => setAttributes({ pauseOnHover: value })
                }),
                createElement(ToggleControl, {
                    label: 'Utiliser les images du post',
                    help: attributes.usePostImages
                        ? "Les images du post seront utilisées comme slides"
                        : "Utiliser les slides personnalisés",
                    checked: attributes.usePostImages,
                    onChange: (value) => setAttributes({ usePostImages: value })
                })
            ),
            createElement(
                PanelBody,
                {
                    title: 'Affichage des slides',
                    initialOpen: true
                },
                createElement(RangeControl, {
                    label: 'Nombre de slides visibles (Desktop)',
                    value: attributes.slidesToShow,
                    onChange: (value) => setAttributes({ slidesToShow: value }),
                    min: 1,
                    max: 6,
                    step: 1
                }),
                createElement(RangeControl, {
                    label: 'Nombre de slides visibles (Tablet)',
                    value: attributes.slidesToShowTablet,
                    onChange: (value) => setAttributes({ slidesToShowTablet: value }),
                    min: 1,
                    max: 4,
                    step: 1
                }),
                createElement(RangeControl, {
                    label: 'Nombre de slides visibles (Mobile)',
                    value: attributes.slidesToShowMobile,
                    onChange: (value) => setAttributes({ slidesToShowMobile: value }),
                    min: 1,
                    max: 2,
                    step: 1
                })
            ),
            createElement(
                PanelBody,
                {
                    title: 'Mode Centré',
                    initialOpen: true
                },
                createElement(ToggleControl, {
                    label: 'Activer le mode centré',
                    checked: attributes.centerMode,
                    onChange: (value) => setAttributes({ centerMode: value })
                }),
                attributes.centerMode && createElement(
                    Fragment,
                    null,
                    createElement('p', {}, 'Espacement central (ex: 50px, 10%)'),
                    createElement('div', { style: { marginBottom: '1em' } },
                        createElement('label', {}, 'Desktop'),
                        createElement('input', {
                            type: 'text',
                            value: attributes.centerPadding,
                            onChange: (e) => setAttributes({ centerPadding: e.target.value }),
                            style: { width: '100%' }
                        })
                    ),
                    createElement('div', { style: { marginBottom: '1em' } },
                        createElement('label', {}, 'Tablet'),
                        createElement('input', {
                            type: 'text',
                            value: attributes.centerPaddingTablet,
                            onChange: (e) => setAttributes({ centerPaddingTablet: e.target.value }),
                            style: { width: '100%' }
                        })
                    ),
                    createElement('div', { style: { marginBottom: '1em' } },
                        createElement('label', {}, 'Mobile'),
                        createElement('input', {
                            type: 'text',
                            value: attributes.centerPaddingMobile,
                            onChange: (e) => setAttributes({ centerPaddingMobile: e.target.value }),
                            style: { width: '100%' }
                        })
                    )
                )
            )
        );

        return createElement(
            Fragment,
            null,
            inspectorControls,
            createElement(
                'div',
                { 
                    ...blockProps,
                    className: `${blockProps.className} slider-container`
                },
                !attributes.usePostImages && createElement(
                    'div',
                    { 
                        className: 'slides-wrapper'
                    },
                    createElement(InnerBlocks, {
                        allowedBlocks: ALLOWED_BLOCKS,
                        template: TEMPLATE,
                        templateLock: false,
                        renderAppender: false
                    })
                ),
                !attributes.usePostImages && createElement(
                    Button,
                    {
                        isPrimary: true,
                        onClick: addNewSlide,
                        className: 'add-slide-button'
                    },
                    'Ajouter un slide'
                ),
                attributes.usePostImages && createElement(
                    'div',
                    { className: 'slides-wrapper post-images-placeholder' },
                    createElement(
                        'p',
                        { className: 'post-images-notice' },
                        'Les images du post seront affichées ici sur le front-end'
                    )
                )
            )
        );
    },
    
    save: function(props) {
        const { attributes } = props;
        const blockProps = useBlockProps.save({
            className: `alignfull`
        });
        
        // Tous les data attributes sur le conteneur principal
        const dataAttributes = {
            'data-dots': attributes.dots,
            'data-arrows': attributes.arrows,
            'data-infinite': attributes.infinite,
            'data-autoplay': attributes.autoplay,
            'data-autoplay-speed': attributes.autoplaySpeed,
            'data-speed': attributes.speed,
            'data-adaptive-height': attributes.adaptiveHeight,
            'data-fade': attributes.fade,
            'data-pause-hover': attributes.pauseOnHover,
            'data-slides-to-show': attributes.slidesToShow,
            'data-slides-to-show-tablet': attributes.slidesToShowTablet,
            'data-slides-to-show-mobile': attributes.slidesToShowMobile,
            'data-center-mode': attributes.centerMode,
            'data-center-padding': attributes.centerPadding,
            'data-center-padding-tablet': attributes.centerPaddingTablet,
            'data-center-padding-mobile': attributes.centerPaddingMobile,
            'data-use-post-images': attributes.usePostImages,
            'data-use-fixed-height': attributes.useFixedHeight,
            'data-slide-height': attributes.slideHeight,
            'data-height-unit': attributes.heightUnit,
            'data-object-fit': attributes.objectFit,
            'data-slide-ratio': attributes.slideRatio,
            'data-custom-ratio-width': attributes.customRatioWidth,
            'data-custom-ratio-height': attributes.customRatioHeight
        };
        
        return createElement(
            'div',
            {
                ...blockProps,
                ...dataAttributes
            },
            createElement(
                'div',
                { className: 'slider-container' },
                createElement(
                    'div',
                    { className: 'slides-wrapper' },
                    !attributes.usePostImages && createElement(InnerBlocks.Content)
                )
            )
        );
    }
}); 