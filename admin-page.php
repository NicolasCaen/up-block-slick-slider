<?php
function up_block_slick_slider_add_admin_menu() {
    add_menu_page(
        'UP Block Slick Slider',
        'UP Slider',
        'manage_options',
        'up-block-slick-slider',
        'up_block_slick_slider_options_page',
        'dashicons-slides'
    );
}
add_action('admin_menu', 'up_block_slick_slider_add_admin_menu');

function up_block_slick_slider_options_page() {
    // Sauvegarde des options
    if (isset($_POST['up_slider_submit'])) {
        check_admin_referer('up_slider_options');
        $options = array(
            'arrow_prev_html' => wp_kses_post($_POST['arrow_prev_html']),
            'arrow_next_html' => wp_kses_post($_POST['arrow_next_html']),
            'arrow_position' => sanitize_text_field($_POST['arrow_position']),
            'arrow_offset' => sanitize_text_field($_POST['arrow_offset'])
        );
        update_option('up_block_slick_slider_options', $options);
        echo '<div class="notice notice-success"><p>Options sauvegardées.</p></div>';
    }

    $options = get_option('up_block_slick_slider_options', array(
        'arrow_prev_html' => '<button type="button" class="slick-prev">Previous</button>',
        'arrow_next_html' => '<button type="button" class="slick-next">Next</button>',
        'arrow_position' => 'side',
        'arrow_offset' => '20px'
    ));
    ?>
    <div class="wrap">
        <h1>UP Block Slick Slider Options</h1>
        <form method="post" action="">
            <?php wp_nonce_field('up_slider_options'); ?>
            
            <h2>Personnalisation des flèches</h2>
            <table class="form-table">
                <tr>
                    <th><label for="arrow_prev_html">HTML Flèche précédente</label></th>
                    <td>
                        <textarea name="arrow_prev_html" id="arrow_prev_html" rows="3" class="large-text"><?php echo esc_textarea($options['arrow_prev_html']); ?></textarea>
                    </td>
                </tr>
                <tr>
                    <th><label for="arrow_next_html">HTML Flèche suivante</label></th>
                    <td>
                        <textarea name="arrow_next_html" id="arrow_next_html" rows="3" class="large-text"><?php echo esc_textarea($options['arrow_next_html']); ?></textarea>
                    </td>
                </tr>
                <tr>
                    <th><label for="arrow_position">Position des flèches</label></th>
                    <td>
                        <select name="arrow_position" id="arrow_position">
                            <option value="side" <?php selected($options['arrow_position'], 'side'); ?>>Sur les côtés</option>
                            <option value="bottom" <?php selected($options['arrow_position'], 'bottom'); ?>>En bas</option>
                            <option value="overlay" <?php selected($options['arrow_position'], 'overlay'); ?>>Superposées</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th><label for="arrow_offset">Décalage des flèches</label></th>
                    <td>
                        <input type="text" name="arrow_offset" id="arrow_offset" value="<?php echo esc_attr($options['arrow_offset']); ?>" class="regular-text">
                        <p class="description">Ex: 20px, 2rem, etc.</p>
                    </td>
                </tr>
            </table>
            
            <p class="submit">
                <input type="submit" name="up_slider_submit" class="button-primary" value="Enregistrer les modifications">
            </p>
        </form>
    </div>
    <?php
} 