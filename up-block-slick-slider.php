<?php
/**
 * Plugin Name: UP Block Slick Slider
 * Description: Un plugin pour ajouter un bloc slider Gutenberg utilisant Slick.
 * Version: 1.0
 * Author: Votre Nom
 */

// Inclure la page d'administration
require_once plugin_dir_path(__FILE__) . 'admin-page.php';

function up_block_slick_slider_register_block() {
    // Enregistrement des scripts et styles Slick
    wp_register_style(
        'slick-style',
        'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css',
        array(),
        '1.8.1'
    );

    wp_register_style(
        'slick-theme-style',
        'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css',
        array('slick-style'),
        '1.8.1'
    );

    wp_register_script(
        'slick-script',
        'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js',
        array('jquery'),
        '1.8.1',
        true
    );

    // Récupérer les options personnalisées
    $options = get_option('up_block_slick_slider_options', array(
        'arrow_prev_html' => '<button type="button" class="slick-prev">Previous</button>',
        'arrow_next_html' => '<button type="button" class="slick-next">Next</button>',
        'arrow_position' => 'side',
        'arrow_offset' => '20px'
    ));
   


    // Script d'initialisation du slider
    wp_register_script(
        'up-block-slick-slider-init',
        plugins_url('js/slider-init.js', __FILE__),
        array('jquery', 'slick-script'),
        '1.0',
        true
    );

    // Passer les options au script lors de l'enregistrement
    wp_localize_script(
        'up-block-slick-slider-init',
        'upSliderOptions',
        $options
    );

    // Enqueue block editor assets
    wp_register_script(
        'up-block-slick-slider-editor-script',
        plugins_url('block.js', __FILE__),
        array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components')
    );

    // Enqueue block styles
    wp_register_style(
        'up-block-slick-slider-editor-style',
        plugins_url('editor.css', __FILE__),
        array('wp-edit-blocks')
    );

    wp_register_style(
        'up-block-slick-slider-frontend-style',
        plugins_url('style.css', __FILE__),
        array('slick-style', 'slick-theme-style')
    );

    register_block_type('up/block-slick-slider', array(
        'editor_script' => 'up-block-slick-slider-editor-script',
        'editor_style' => 'up-block-slick-slider-editor-style',
        'style' => 'up-block-slick-slider-frontend-style',
        'script' => 'up-block-slick-slider-init',
        'render_callback' => 'up_block_slick_slider_render_callback'
    ));
}

function up_block_slick_slider_get_post_images() {
    // Récupérer l'ID du post courant
    $post_id = get_the_ID();
    
    // Récupérer toutes les images attachées au post
    $images = get_attached_media('image', $post_id);
    
    // Formater les données des images
    $formatted_images = array();
    foreach ($images as $image) {
        $image_data = wp_get_attachment_image_src($image->ID, 'full');
        if ($image_data) {
            $formatted_images[] = array(
                'id' => $image->ID,
                'url' => $image_data[0],
                'width' => $image_data[1],
                'height' => $image_data[2],
                'alt' => get_post_meta($image->ID, '_wp_attachment_image_alt', true),
                'caption' => $image->post_excerpt
            );
        }
    }
    
    return $formatted_images;
}

function up_block_slick_slider_render_callback($attributes, $content) {
    // S'assurer que jQuery est chargé
    wp_enqueue_script('jquery');
    
    // Enqueue les scripts nécessaires
    wp_enqueue_style('slick-style');
    wp_enqueue_style('slick-theme-style');
    wp_enqueue_script('slick-script');
    wp_enqueue_script('up-block-slick-slider-init');
    
    // Récupérer les valeurs des attributs
    $slideHeight = isset($attributes['slideHeight']) ? $attributes['slideHeight'] : 400;
    $heightUnit = isset($attributes['heightUnit']) ? $attributes['heightUnit'] : 'px';
    $objectFit = isset($attributes['objectFit']) ? $attributes['objectFit'] : 'cover';
    $usePostImages = !empty($attributes['usePostImages']);
    
    // Début de la structure HTML commune (sans le bloc style)
    $output = '<div class="wp-block-up-block-slick-slider alignfull" ' .
        'data-slide-height="' . esc_attr($slideHeight) . '" ' .
        'data-height-unit="' . esc_attr($heightUnit) . '" ' .
        'data-object-fit="' . esc_attr($objectFit) . '" ' .
        'data-use-post-images="' . esc_attr($usePostImages ? 'true' : 'false') . '">';
    
    $output .= '<div class="slider-container">';
    $output .= '<div class="slides-wrapper">';

    // Contenu différent selon usePostImages
    if (!empty($attributes['usePostImages'])) {
        $images = up_block_slick_slider_get_post_images();
        if (!empty($images)) {
            foreach ($images as $image) {
                $output .= '<div class="slide">';
                $output .= sprintf(
                    '<img src="%s" alt="%s" width="%d" height="%d" />',
                    esc_url($image['url']),
                    esc_attr($image['alt']),
                    esc_attr($image['width']),
                    esc_attr($image['height'])
                );
                if (!empty($image['caption'])) {
                    $output .= sprintf(
                        '<div class="slide-caption">%s</div>',
                        esc_html($image['caption'])
                    );
                }
                $output .= '</div>';
            }
        }
    } else {
        // Pour le contenu normal, utiliser le contenu existant
        $output .= $content;
    }

    // Fermeture de la structure HTML commune
    $output .= '</div></div></div>';
    
    return $output;
}

add_action('init', 'up_block_slick_slider_register_block');

// Ajouter les options au head pour s'assurer qu'elles sont disponibles
function up_block_slick_slider_add_options_to_head() {
    $options = get_option('up_block_slick_slider_options', array(
        'arrow_prev_html' => '<button type="button" class="slick-prev">Previous</button>',
        'arrow_next_html' => '<button type="button" class="slick-next">Next</button>',
        'arrow_position' => 'side',
        'arrow_offset' => '20px'
    ));
    
    echo '<script>window.upSliderOptions = ' . json_encode($options) . ';</script>';
}
add_action('wp_head', 'up_block_slick_slider_add_options_to_head', 5); 