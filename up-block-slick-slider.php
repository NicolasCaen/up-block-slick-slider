<?php
/**
 * Plugin Name: UP Block Slick Slider
 * Description: Un plugin pour ajouter un bloc slider Gutenberg utilisant Slick.
 * Version: 1.0
 * Author: Votre Nom
 */

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

    // Script d'initialisation du slider
    wp_register_script(
        'up-block-slick-slider-init',
        plugins_url('js/slider-init.js', __FILE__),
        array('slick-script'),
        '1.0',
        true
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

function up_block_slick_slider_render_callback($attributes, $content) {
    // Enqueue les scripts nécessaires
    wp_enqueue_style('slick-style');
    wp_enqueue_style('slick-theme-style');
    wp_enqueue_script('slick-script');
    wp_enqueue_script('up-block-slick-slider-init');
    
    return $content;
}

add_action('init', 'up_block_slick_slider_register_block'); 