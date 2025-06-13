<?php

add_action('acf/init', 'register_map_shortcode_acf_fields');
function register_map_shortcode_acf_fields()
{
    acf_add_local_field_group(array(
        'key' => 'group_map_shortcode',
        'title' => 'Map Shortcode Settings',
        'fields' => array(
            array(
                'key' => 'field_pins',
                'label' => 'Pins',
                'name' => 'pins',
                'type' => 'repeater',
                'layout' => 'table',
                'button_label' => 'Add Pin',
                'sub_fields' => array(
                    array(
                        'key' => 'field_pin_name',
                        'label' => 'Pin Name',
                        'name' => 'pin_name',
                        'type' => 'text',
                    ),
                    array(
                        'key' => 'field_pin_type',
                        'label' => 'Pin Type',
                        'name' => 'pin_type',
                        'type' => 'select',
                        'choices' => array(
                            'diesel' => 'Diesel',
                            'gas' => 'Gas',
                        ),
                        'allow_null' => 0,
                        'multiple' => 0,
                        'ui' => 1,
                    ),
                    array(
                        'key' => 'field_title',
                        'label' => 'Title',
                        'name' => 'title',
                        'type' => 'text',
                    ),
                    array(
                        'key' => 'field_overview',
                        'label' => 'Overview',
                        'name' => 'overview',
                        'type' => 'textarea',
                        'rows' => 5,
                    ),
                    array(
                        'key' => 'field_x_axis',
                        'label' => 'X Axis',
                        'name' => 'x_axis',
                        'type' => 'number',
                        'default_value' => 406,
                    ),
                    array(
                        'key' => 'field_y_axis',
                        'label' => 'Y Axis',
                        'name' => 'y_axis',
                        'type' => 'number',
                        'default_value' => 213,
                    ),
                ),
            ),
            array(
                'key' => 'field_info_box_x',
                'label' => 'Info Box X',
                'name' => 'info_box_x',
                'type' => 'number',
                'default_value' => 406,
                'wrapper' => array(
                    'style' => 'display:none;',
                ),
            ),
            array(
                'key' => 'field_info_box_y',
                'label' => 'Info Box Y',
                'name' => 'info_box_y',
                'type' => 'number',
                'default_value' => 213,
                'wrapper' => array(
                    'style' => 'display:none;',
                ),
            ),
            array(
                'key' => 'field_background_image',
                'label' => 'Background Image',
                'name' => 'background_image',
                'type' => 'image',
                'mime_types' => 'jpg,jpeg,png,gif,svg,webp',
                'return_format' => 'array',
                'instructions' => 'Upload your map background image.',
                'wrapper' => array(
                    'class' => 'acf-hide',
                ),
            ),
            array(
                'key' => 'field_live_preview',
                'label' => 'Live Preview',
                'name' => 'live_preview',
                'type' => 'message',
                'message' => '<div id="konva-preview-container">Loading preview...</div>',
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'map_shortcode',
                ),
            ),
        ),
    ));
}