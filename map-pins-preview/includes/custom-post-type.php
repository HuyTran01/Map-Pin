<?php

function register_map_shortcode_cpt()
{
    register_post_type('map_shortcode', array(
        'labels' => array(
            'name' => __('Map Shortcodes'),
            'singular_name' => __('Map Shortcode'),
            'add_new_item' => __('Add New Map Shortcode'),
            'edit_item' => __('Edit Map Shortcode'),
            'new_item' => __('New Map Shortcode'),
            'view_item' => __('View Map Shortcode'),
            'search_items' => __('Search Map Shortcodes'),
            'not_found' => __('No Map Shortcodes found')
        ),
        'public' => true,
        'has_archive' => false,
        'show_ui' => true,
        'menu_position' => 20,
        'menu_icon' => 'dashicons-location-alt',
        'supports' => ['title'],
        'show_in_rest' => true
    ));
}

add_filter('manage_map_shortcode_posts_columns', function ($columns) {
    $new_columns = [];
    foreach ($columns as $key => $value) {
        $new_columns[$key] = $value;
        if ($key === 'title') {
            $new_columns['shortcode'] = __('Shortcode');
        }
    }
    return $new_columns;
});

add_filter('post_row_actions', function ($actions, $post) {
    if ($post->post_type === 'map_shortcode') {
        unset($actions['view']);
    }
    return $actions;
}, 10, 2);

add_action('manage_map_shortcode_posts_custom_column', function ($column, $post_id) {
    if ($column === 'shortcode') {
        echo '<code>[map_shortcode id="' . $post_id . '"]</code>';
    }
}, 10, 2);