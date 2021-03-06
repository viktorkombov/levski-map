function openOverlayImg(pathName, name, gallery) {
    console.log(gallery)
    
    function link(pathName, i) {
        return 'https://vlevskimuseum-bg.org/wp-content/uploads/2022/04/' + pathName + i + '.jpg'
    }
    $.extend({
        el: function (el, props) {
            var $el = $(document.createElement(el));
            $el.attr(props);
            return $el;
        }
    });

    $(document).bind('keyup', function(e) {
        
        if(e.which == 39){
            $('.carousel').carousel('next');
            console.log('arrow pressed')
        }
        else if(e.which == 37){
            $('.carousel').carousel('prev');
        }
    });

    var elem = $('.modal-body');
    elem.empty();
    $('#exampleModal').modal('show');
    $('.modal-title').text(name)

    var carouselIndicators = $.el('ol', { 'class': 'carousel-indicators' });
    var carouselSlides = $.el('div', { 'class': 'carousel-inner' });

    for (let i = 0; i < gallery.length; i++) {
        if (i === 0) {
            carouselIndicators.append($.el('li', { 'data-target': '#carouselExampleFade', 'data-wrap': 'false', 'class': 'active' }));
            carouselSlides.append($.el('div', { 'class': 'item active', 'style': "background-color: red"})
                .append(
                    $.el('img', { 'class': 'd-block w-100', 'src': link(pathName, i) })
                )
                .append(
                    $.el('div', { 'class': 'carousel-caption d-none d-md-block' })
                        .append(
                            $.el('p', { 'class': 'map-gallery-caption' }).text(gallery[i])
                        )
                )
            );
        } else {
            carouselIndicators.append($.el('li', { 'data-target': '#carouselExampleFade' }));
            carouselSlides.append($.el('div', { 'class': 'item' })
                .append(
                    $.el('img', { 'class': 'd-block w-100', 'src': link(pathName, i) })
                )
                .append(
                    $.el('div', { 'class': 'carousel-caption d-none d-md-block' })
                        .append(
                            $.el('p', { 'class': 'map-gallery-caption' }).text(gallery[i])
                        )
                )
            );
        }
    }

    elem.append(
        $.el('div', {
            'id': 'carouselExampleFade',
            'class': 'carousel', 'data-ride': 'carousel', 'data-keyboard': true
        }).append(carouselIndicators)
            .append(carouselSlides)
            .append(
                $.el('??', { 'class': 'left carousel-control', 'href': '#carouselExampleFade', 'role': 'button', 'data-slide': 'prev' })
                    .append($.el('span', { 'class': 'glyphicon glyphicon-chevron-left', 'aria-hidden': 'true' }))
                    .append($.el('span', { 'class': 'sr-only' }).text('Previous'))
            )
            .append(
                $.el('??', { 'class': 'right carousel-control', 'href': '#carouselExampleFade', 'role': 'button', 'data-slide': 'next' })
                    .append($.el('span', { 'class': 'glyphicon glyphicon-chevron-right', 'aria-hidden': 'true' }))
                    .append($.el('span', { 'class': 'sr-only' }).text('Next'))
            )

    );

    // <a class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
    // //     <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
    // //     <span class="sr-only">Previous</span>
    // //   </a>
    //   <a class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
    //     <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
    //     <span class="sr-only">Next</span>
    //   </a>
//     <div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
//   <!-- Indicators -->
//   <ol class="carousel-indicators">
//     <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
//     <li data-target="#carousel-example-generic" data-slide-to="1"></li>
//     <li data-target="#carousel-example-generic" data-slide-to="2"></li>
//   </ol>

//   <!-- Wrapper for slides -->
//   <div class="carousel-inner" role="listbox">
//     <div class="item active">
//       <img src="..." alt="...">
//       <div class="carousel-caption">
//         ...
//       </div>
//     </div>
//     <div class="item">
//       <img src="..." alt="...">
//       <div class="carousel-caption">
//         ...
//       </div>
//     </div>
//     ...
//   </div>

//   <!-- Controls -->
// 
// </div>

}

$("#exampleModal").on("hidden.bs.modal", function () {
    $(document).off('keyup');
});

function closeOverlayImg(event) {
    $(document).off('keyup');
    const element = event.target;
    const overlay = document.getElementById("map-overlay");
    if (element.id === 'map-overlay' || element.id === 'map-overlay-wrapper') {
        overlay.style.display = 'none';
        var elem = $("#map-overlay-wrapper");
        elem.empty();
    }
    console.log(event.target);

}