const { registerBlockType } = wp.blocks;
const { createElement, Fragment } = wp.element;
const { InnerBlocks, useBlockProps, InspectorControls } = wp.blockEditor;
const { Button, PanelBody, ToggleControl, RangeControl, SelectControl } = wp.components;

// Ajout d'un style personnalisé pour les slides
const slideStyles = `
    .wp-block-up-block-slick-slider .slide {
        height: var(--slide-height);
    }
`;

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
                })
            )
        );

        return createElement(
            Fragment,
            null,
            createElement('style', null, slideStyles),
            inspectorControls,
            createElement(
                'div',
                { 
                    ...blockProps,
                    className: `${blockProps.className} slider-container`
                },
                createElement(
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
                createElement(
                    Button,
                    {
                        isPrimary: true,
                        onClick: addNewSlide,
                        className: 'add-slide-button'
                    },
                    'Ajouter un slide'
                )
            )
        );
    },
    
    save: function(props) {
        const { attributes } = props;
        const blockProps = useBlockProps.save({
            className: `align${attributes.align || ''}`,
            style: {
                '--slide-height': `${attributes.slideHeight}${attributes.heightUnit}`
            }
        });
        
        const dataAttributes = {
            'data-dots': attributes.dots,
            'data-arrows': attributes.arrows,
            'data-infinite': attributes.infinite,
            'data-autoplay': attributes.autoplay,
            'data-autoplay-speed': attributes.autoplaySpeed,
            'data-speed': attributes.speed,
            'data-adaptive-height': attributes.adaptiveHeight,
            'data-fade': attributes.fade,
            'data-pause-hover': attributes.pauseOnHover
        };
        
        return createElement(
            Fragment,
            null,
            createElement('style', null, slideStyles),
            createElement(
                'div',
                {
                    ...blockProps,
                    ...dataAttributes,
                    className: `${blockProps.className} slider-container`
                },
                createElement(
                    'div',
                    { 
                        className: 'slides-wrapper'
                    },
                    createElement(InnerBlocks.Content)
                )
            )
        );
    }
}); 