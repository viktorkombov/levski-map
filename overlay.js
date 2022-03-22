function openOverlayImg(length) {
    // console.log(appMap.currPopup);
    // document.getElementById("map-overlay-img").src = 'http://vlevskimuseum-bg.org/wp-content/uploads/2021/12/' + appMap.currPopup.layer.feature.properties.pathName + '.png';
    document.getElementById("map-overlay").style.display = "block";
    // createSlideshowContent('asd', 'АСД', 3);
    // showSlides(1);
    var pathName = 'lovech';
    function link(pathName, i) {
        return 'http://vlevskimuseum-bg.org/wp-content/uploads/2022/03/' + pathName + i + '.jpg'
    }
    $.extend({
        el: function (el, props) {
            var $el = $(document.createElement(el));
            $el.attr(props);
            return $el;
        }
    });

    var elem = $("#map-overlay-wrapper");

    var carouselIndicators = $.el('ol', { 'class': 'carousel-indicators' });
    var carouselSlides = $.el('div', { 'class': 'carousel-inner' });

    for (let i = 0; i < length; i++) {
        if (i === 0) {
            carouselIndicators.append($.el('li', { 'data-target': '#carouselExampleIndicators', 'class': 'active' }));
            carouselSlides.append($.el('div', { 'class': 'carousel-item active' }).append($.el('img', { 'class': 'd-block w-100', 'src': link(pathName, i + 1) })));
        } else {
            carouselIndicators.append($.el('li', { 'data-target': '#carouselExampleIndicators' }));
            carouselSlides.append($.el('div', { 'class': 'carousel-item' }).append($.el('img', { 'class': 'd-block w-100', 'src': link(pathName, i + 1) })));
        }
    }

    elem.append(
        $.el('div', {
            'id': 'carouselExampleIndicators', 'style': 'max-height: 90%; max-width: 90%; overflow: hidden;',
            'class': 'carousel slide', 'data-ride': 'carousel'
        }).append(carouselIndicators)
            .append(carouselSlides)
            .append(
                $.el('а', { 'class': 'carousel-control-prev', 'href': '#carouselExampleIndicators', 'role': 'button', 'data-slide': 'prev' })
                    .append($.el('span', { 'class': 'carousel-control-prev-icon', 'aria-hidden': 'true' }))
                    .append($.el('span', { 'class': 'sr-only' }).text('Previous'))
            )
            .append(
                $.el('а', { 'class': 'carousel-control-next', 'href': '#carouselExampleIndicators', 'role': 'button', 'data-slide': 'next' })
                    .append($.el('span', { 'class': 'carousel-control-next-icon', 'aria-hidden': 'true' }))
                    .append($.el('span', { 'class': 'sr-only' }).text('Next'))
            )

    );
    // <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
    // //         <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    // //         <span class="sr-only">Previous</span>
    // //     </a>
    //     <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
    //         <span class="carousel-control-next-icon" aria-hidden="true"></span>
    //         <span class="sr-only">Next</span>
    //     </a>
    // <div id="carouselExampleIndicators" style="max-height: 90%; max-width: 90%; overflow: hidden;"
    //     class="carousel slide" data-ride="carousel">
    //     <ol class="carousel-indicators">
    //         <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
    //         <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
    //         <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
    //     </ol>
    //     <div class="carousel-inner">
    //         <div class="carousel-item active">
    //             <img class="d-block w-100" src="/images/asd0.jpg" alt="First slide">
    //         </div>
    //         <div class="carousel-item">
    //             <img class="d-block w-100" src="/images/asd1.jpg" alt="Second slide">
    //         </div>
    //         <div class="carousel-item">
    //             <img class="d-block w-100" src="/images/asd2.jpg" alt="Third slide">
    //         </div>
    //         <div class="carousel-item">
    //             <img class="d-block w-100" src="/images/asd2.jpg" alt="Third slide">
    //         </div>
    //         <div class="carousel-item">
    //             <img class="d-block w-100" src="/images/asd2.jpg" alt="Third slide">
    //         </div>
    //         <div class="carousel-item">
    //             <img class="d-block w-100" src="/images/asd2.jpg" alt="Third slide">
    //         </div>
    //     </div>
    //     <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
    //         <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    //         <span class="sr-only">Previous</span>
    //     </a>
    //     <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
    //         <span class="carousel-control-next-icon" aria-hidden="true"></span>
    //         <span class="sr-only">Next</span>
    //     </a>
    // </div>

}

function closeOverlayImg(event) {
    const element = event.target;
    const overlay = document.getElementById("map-overlay");
    if (element.id === 'map-overlay' || element.id === 'map-overlay-wrapper') {
        overlay.style.display = 'none';
        var elem = $("#map-overlay-wrapper");
        elem.empty();
    }
    console.log(event.target);

}