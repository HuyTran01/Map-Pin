<?php
/**
 * Plugin Name: Map Pins Preview
 * Description: A simple plugin to preview map pins on a WordPress site.
 * Version: 0.1
 * Author: Tigren
 **/

if (!defined('ABSPATH')) exit;

define('TMPP_PLUGIN_DIR', plugin_dir_path(__FILE__));

require_once TMPP_PLUGIN_DIR . 'includes/custom-post-type.php';
require_once TMPP_PLUGIN_DIR . 'includes/acf-fields.php';
require_once TMPP_PLUGIN_DIR . 'includes/scripts.php';

add_action('init', 'register_map_shortcode_cpt');
add_shortcode('map_shortcode', 'render_map_shortcode');

add_filter('get_sample_permalink_html', 'tmpp_remove_permalink_html', 10, 5);
function tmpp_remove_permalink_html($return, $post_id, $new_title, $new_slug, $post)
{
    if ($post->post_type === 'map_shortcode') {
        return '';
    }
    return $return;
}

add_action('admin_enqueue_scripts', function () {
    wp_enqueue_style('map-admin-style', plugin_dir_url(__FILE__) . 'assets/css/admin-styles.css');
});

add_filter('upload_mimes', function ($mimes) {
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
});

add_filter('acf/load_field/name=pins', function($field) {
    global $post;

    if (!$post) return $field;

    $background_image = get_field('background_image', $post->ID);
    if (!$background_image || !isset($background_image['width']) || !isset($background_image['height'])) {
        return $field;
    }
    $center_x = intval($background_image['width'] / 2);
    $center_y = intval($background_image['height'] / 2);
    foreach ($field['sub_fields'] as &$sub_field) {
        if ($sub_field['name'] === 'x_axis') {
            $sub_field['default_value'] = $center_x;
        }
        if ($sub_field['name'] === 'y_axis') {
            $sub_field['default_value'] = $center_y;
        }
    }
    return $field;
});
