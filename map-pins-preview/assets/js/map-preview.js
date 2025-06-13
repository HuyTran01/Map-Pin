document.addEventListener("DOMContentLoaded", function () {
    const {
        backgroundImage,
        pins,
        baseImageUrl,
        groupInfoCoordinates
    } = mapPreviewData;

    const container = document.getElementById("konva-preview-container");
    if (!container) return;

    let stageWidth = container?.offsetWidth;
    let scale = stageWidth / backgroundImage?.width;
    let stageHeight = backgroundImage?.height * scale;

    const stage = new Konva.Stage({
        container: 'konva-preview-container',
        width: stageWidth,
        height: stageHeight,
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    const imageObj = new Image();
    imageObj.onload = function () {
        const konvaImage = new Konva.Image({
            image: imageObj,
            x: 0,
            y: 0,
            width: stageWidth,
            height: stageHeight,
            listening: false,
        });

        layer.add(konvaImage);

        const groupInfoOriginalX = groupInfoCoordinates.x ? Number(groupInfoCoordinates.x) : 20;
        const groupInfoOriginalY = groupInfoCoordinates.y ? Number(groupInfoCoordinates.y) : (backgroundImage.height + 20);

        const groupInfo = new Konva.Group({
            x: groupInfoOriginalX * scale,
            y: groupInfoOriginalY * scale,
            draggable: true,
        });

        const infoBoxOriginalWidth = 260;
        const infoBoxOriginalHeight = 235;
        const pinName = new Konva.Text({
            x: 0,
            y: 50,
            fontSize: 28,
            width: infoBoxOriginalWidth,
            height: infoBoxOriginalHeight,
            padding: 20,
            align: 'center',
            fill: '#004976',
        });

        const titleBox = new Konva.Text({
            x: 0,
            y: 70,
            fontSize: 20,
            width: infoBoxOriginalWidth,
            height: infoBoxOriginalHeight,
            padding: 20,
            align: 'center',
            bold: true,
            fill: '#121237',
        });

        const overview = new Konva.Text({
            x: 0,
            y: 100,
            fontSize: 16,
            width: infoBoxOriginalWidth,
            height: infoBoxOriginalHeight,
            padding: 20,
            align: 'center',
            fill: '#747273',
        });

        const infoBox = new Konva.Rect({
            x: 0,
            y: 0,
            fill: '#FFFFFF',
            width: infoBoxOriginalWidth,
            height: infoBoxOriginalHeight,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffsetX: 10,
            shadowOffsetY: 10,
            shadowOpacity: 0.2,
        });

        groupInfo.add(infoBox, pinName, titleBox, overview);
        layer.add(groupInfo);

        groupInfo.on('dragmove', () => {
            const groupInforInputX = document.querySelector(`input[name="acf[field_info_box_x]"]`);
            const groupInforInputY = document.querySelector(`input[name="acf[field_info_box_y]"]`);

            if (groupInforInputX) groupInforInputX.value = Math.round(groupInfo.x() / scale);
            if (groupInforInputY) groupInforInputY.value = Math.round(groupInfo.y() / scale);
        });

        const pinObjects = [];
        const pinOriginalWidth = 30;
        const pinOriginalHeight = 37;
        pins.forEach((pin, index) => {
            const x = Number(pin.x_axis);
            const y = Number(pin.y_axis);
            const xInput = document.querySelector(`input[name="acf[field_pins][row-${index}][field_x_axis]"]`);
            const yInput = document.querySelector(`input[name="acf[field_pins][row-${index}][field_y_axis]"]`);
            const imageUrl = getPinImageUrl(pin.pin_type, baseImageUrl, 'plus');
            Konva.Image.fromURL(imageUrl, function (svgImage) {
                svgImage.on('mouseover', () => stage.container().style.cursor = 'pointer');
                svgImage.on('mouseout', () => stage.container().style.cursor = 'default');
                svgImage.setAttrs({
                    x: x * scale,
                    y: y * scale,
                    width: pinOriginalWidth * scale,
                    height: pinOriginalHeight * scale,
                    offsetX: (pinOriginalWidth * scale) / 2,
                    offsetY: pinOriginalHeight * scale,
                    draggable: true,
                    name: 'pin-icon'
                });

                if (pin.title) {
                    pinName.y(30);
                    titleBox.visible(true);
                } else {
                    pinName.y(50);
                    titleBox.visible(false);
                }
                svgImage.on('click touchstart', () => {
                    pinName.text(pin.pin_name);
                    titleBox.text(pin.title ? pin.title : '');
                    overview.text(pin.overview);

                    if (pin.title) {
                        pinName.y(30);
                        titleBox.visible(true);
                    } else {
                        pinName.y(50);
                        titleBox.visible(false);
                    }

                    updatePinIcons(svgImage);
                    layer.draw();
                });

                svgImage.on("dragmove", () => {
                    if (xInput) xInput.value = Math.round(svgImage.x() / scale);
                    if (yInput) yInput.value = Math.round(svgImage.y() / scale);
                });

                layer.add(svgImage);
                pinObjects.push({
                    konvaObj: svgImage,
                    originalX: x,
                    originalY: y,
                    pinWidth: pinOriginalWidth,
                    pinHeight: pinOriginalHeight,
                    pinType: pin.pin_type,
                    pin: pin
                });

                if (index === 0) {
                    pinName.text(pin.pin_name);
                    overview.text(pin.overview);
                    updatePinIcons(svgImage);
                    layer.draw();
                }
            });
        });

        if (pins.length > 0) {
            pinName.text(pins[0].pin_name);
            titleBox.text(pins[0].title ? pins[0].title : '');
            overview.text(pins[0].overview);
        }

        function updatePinIcons(activePin) {
            pinObjects.forEach((pinObj) => {
                const isActive = (pinObj.konvaObj === activePin);
                const suffix = isActive ? 'minus' : 'plus';
                const imageUrl = getPinImageUrl(pinObj.pinType, baseImageUrl, suffix);

                const newImageObj = new window.Image();
                newImageObj.onload = function () {
                    pinObj.konvaObj.image(newImageObj);
                    layer.draw();
                };
                newImageObj.src = imageUrl;
            });
        }

        window.addEventListener('resize', () => {
            stageWidth = container.offsetWidth;
            scale = stageWidth / backgroundImage?.width;
            stageHeight = backgroundImage?.height * scale;
            stage.width(stageWidth);
            stage.height(stageHeight);
            konvaImage.width(stageWidth);
            konvaImage.height(stageHeight);

            groupInfo.position({
                x: groupInfoOriginalX * scale,
                y: groupInfoOriginalY * scale
            });

            pinObjects.forEach((pinObj) => {
                pinObj.konvaObj.setAttrs({
                    x: pinObj.originalX * scale,
                    y: pinObj.originalY * scale,
                    width: pinObj.pinWidth * scale,
                    height: pinObj.pinHeight * scale,
                    offsetX: (pinObj.pinWidth * scale) / 2,
                    offsetY: pinObj.pinHeight * scale,
                });
            });
            layer.draw();
        });
    };

    imageObj.src = backgroundImage?.url;

    function getPinImageUrl(pinType, baseImageUrl, suffix = 'plus') {
        return `${baseImageUrl}${pinType === "diesel" ? `diesel-pin-${suffix}.svg` : `gas-pin-${suffix}.svg`}`;
    }
});
