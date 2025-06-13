<?php

add_action('acf/input/admin_enqueue_scripts', 'load_konva_map_preview_assets');
function load_konva_map_preview_assets($hook)
{
    global $post;
    if ($post && $post->post_type === 'map_shortcode') {
        wp_enqueue_script('konva', plugin_dir_url(__FILE__) . '../assets/js/konva.min.js', array(), '9.2.0', true);
        wp_enqueue_script('html2canvas', plugin_dir_url(__FILE__) . '../assets/js/html2canvas.min.js', array(), '9.2.0', true);
        wp_enqueue_script('map-preview', plugin_dir_url(__FILE__) . '../assets/js/map-preview.js', array('konva'), '1.0', true);

        $pins = get_field('pins', $post->ID);

        $plugin_dir = plugin_dir_path(__DIR__);
        $plugin_url = plugins_url('', $plugin_dir . 'map-pins-preview.php');
        $base_image_url = $plugin_url . '/assets/images/';
        $groupInfoCoordinates = [
            'x' => get_field('info_box_x', $post->ID),
            'y' => get_field('info_box_y', $post->ID)
        ];
        $background_image = get_field('background_image', $post->ID);
        wp_localize_script('map-preview', 'mapPreviewData', array(
            'pins' => $pins,
            'backgroundImage' => $background_image,
            'baseImageUrl' => $base_image_url,
            'groupInfoCoordinates' => $groupInfoCoordinates,
        ));
    }
}

function render_map_shortcode($atts)
{
    $atts = shortcode_atts([
        'id' => 0,
    ], $atts);

    $post_id = intval($atts['id']);
    if (!$post_id) return '';

    $pins = get_field('pins', $post_id);
    if (!$pins) return '';

    wp_enqueue_script('konva', plugin_dir_url(__FILE__) . '../assets/js/konva.min.js', array(), '9.2.0', true);
    wp_enqueue_script('frontend-map-preview', plugin_dir_url(__FILE__) . '../assets/js/frontend-map-preview.js', ['konva'], '1.0', true);

    $plugin_dir = plugin_dir_path(__DIR__);
    $plugin_url = plugins_url('', $plugin_dir . 'map-pins-preview.php');
    $base_image_url = $plugin_url . '/assets/images/';
    $groupInfoCoordinates = [
        'x' => get_field('info_box_x', $post_id),
        'y' => get_field('info_box_y', $post_id)
    ];
    $background_image = get_field('background_image', $post_id);
    wp_localize_script('frontend-map-preview', 'mapPreviewData', [
        'pins' => $pins,
        'backgroundImage' => $background_image,
        'baseImageUrl' => $base_image_url,
        'groupInfoCoordinates' => $groupInfoCoordinates
    ]);

    ob_start();
    ?>
    <div id="konva-frontend-map-container" style="width:100%; height:100%;">Loading map...</div>
    <?php
    return ob_get_clean();
}