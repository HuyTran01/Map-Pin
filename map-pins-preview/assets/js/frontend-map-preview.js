document.addEventListener("DOMContentLoaded", function () {
    const {
        backgroundImage,
        pins,
        baseImageUrl,
        groupInfoCoordinates
    } = mapPreviewData;

    const container = document.getElementById("konva-frontend-map-container");
    if (!container || !window.mapPreviewData) return;

    let stage, layer;

    function renderStage() {
        let stageWidth = container.offsetWidth;
        let scale = stageWidth / backgroundImage.width;
        let stageHeight = backgroundImage.height * scale;

        const baseWidth = 1371;
        const baseHeight = 719;
        const infoBoxMarginTop = 30;
        const isMobileView = isMobile();
        const scaleX = stageWidth / baseWidth;
        const scaleY = stageHeight / baseHeight;
        const infoBoxWidth = isMobileView ? 350 : 260;
        const infoBoxHeight = 235;

        if (stage) stage.destroy();

        stage = new Konva.Stage({
            container: 'konva-frontend-map-container',
            width: stageWidth,
            height: isMobileView ? stageHeight + 232 + infoBoxMarginTop : stageHeight,
        });

        layer = new Konva.Layer();
        stage.add(layer);

        const imageObj = new Image();
        imageObj.onload = function () {
            const konvaImage = new Konva.Image({
                image: imageObj,
                x: 100,
                y: 100,
                offsetX: 100,
                offsetY: 100,
                width: stageWidth,
                height: stageHeight,
                listening: false,
            });

            layer.add(konvaImage);

            const infoX = groupInfoCoordinates.x
                ? (Number(groupInfoCoordinates.x) / backgroundImage.width) * baseWidth
                : 20;
            const infoY = groupInfoCoordinates.y
                ? (Number(groupInfoCoordinates.y) / backgroundImage.height) * baseHeight
                : 500;

            const groupInfo = new Konva.Group({
                x: isMobileView ? (stageWidth - infoBoxWidth) / 2 : infoX * scaleX - 30,
                y: isMobileView ? stageHeight + 30 : infoY * scaleY,
                draggable: false,
                listening: false
            });

            const pinName = new Konva.Text({
                x: 0,
                y: 50,
                fontSize: 28,
                width: infoBoxWidth,
                height: infoBoxHeight,
                padding: 20,
                align: 'center',
                fill: '#004976'
            });

            const titleBox = new Konva.Text({
                x: 0,
                y: 70,
                fontSize: 20,
                width: infoBoxWidth,
                height: infoBoxHeight,
                padding: 20,
                align: 'center',
                bold: true,
                fill: '#121237',
            });

            const overview = new Konva.Text({
                x: 0,
                y: 100,
                fontSize: 16,
                width: infoBoxWidth,
                height: infoBoxHeight,
                padding: 20,
                align: 'center',
                fill: '#747273'
            });

            const infoBox = new Konva.Rect({
                x: 0,
                y: 0,
                fill: '#FFFFFF',
                width: infoBoxWidth,
                height: infoBoxHeight,
                shadowColor: 'black',
                shadowBlur: 10,
                shadowOffsetX: 10,
                shadowOffsetY: 10,
                shadowOpacity: 0.2,
            });

            groupInfo.add(infoBox, pinName, titleBox, overview);
            layer.add(groupInfo);

            const pinObjects = [];
            const pinOriginalWidth = 50;
            const pinOriginalHeight = 62;
            pins.forEach((pin, index) => {
                const x = (Number(pin.x_axis) / backgroundImage.width) * baseWidth;
                const y = (Number(pin.y_axis) / backgroundImage.height) * baseHeight;
                const svgUrl = getPinImageUrl(pin.pin_type, baseImageUrl);
                Konva.Image.fromURL(svgUrl, function (svgImage) {
                    svgImage.on('mouseover', () => stage.container().style.cursor = 'pointer');
                    svgImage.on('mouseout', () => stage.container().style.cursor = 'default');
                    svgImage.setAttrs({
                        x: x * scaleX,
                        y: y * scaleY,
                        width: pinOriginalWidth * scaleX,
                        height: pinOriginalHeight * scaleY,
                        offsetX: (pinOriginalWidth * scaleX) / 2,
                        offsetY: pinOriginalHeight * scaleY,
                        draggable: false,
                        name: 'pin-icon',
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
                        titleBox.text(pins[0].title ? pins[0].title : '');
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

            layer.draw();
        };

        imageObj.src = backgroundImage?.url;
    }

    renderStage();

    window.addEventListener('resize', () => {
        renderStage();
    });

    function getPinImageUrl(pinType, baseImageUrl, suffix = 'plus') {
        return `${baseImageUrl}${pinType === "diesel" ? `diesel-pin-${suffix}.svg` : `gas-pin-${suffix}.svg`}`;
    }

    function isMobile() {
        return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
});
