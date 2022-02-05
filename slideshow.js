var slideIndex = 1;
// showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("map-slides");
  var dots = document.getElementsByClassName("map-slides-dot");
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" map-slides-active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " map-slides-active";
}

function createElementFromHTML(htmlString, className) {
  var div = document.createElement('div');
  if (className) {
    div.className = className;
  }
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

function createSlideshowContent(pathName, name, galleryLength) {
  const slidesWrapperClassName = 'map-slides-slideshow-container'
  let slideShowElements = '';
  const slidesImagesWrapper = (images) => '<div class="map-slides map-slides-fade">' + images + '</div>';
  const slidesImage = (pathName, index, name) => '<img src="http://vlevskimuseum-bg.org/wp-content/uploads/2022/02/' + pathName + index + '.jpg" alt="' + name + '" style="width:100%">';

  if (galleryLength > 1) {
    const slidesNumber = (num) => '<div class="map-slides-numbertext">' + num + ' / ' + galleryLength + '</div>';
    const slidesDot = (num) => '<span class="map-slides-dot" onclick="currentSlide(' + num + ')"></span>';
    const slidesDotes = ['<div class="map-slides-dots">', '</div>'];
    const slidesArrows = '<a class="map-slides-prev" onclick="plusSlides(-1)">&#10094;</a>' +
      '<a class="map-slides-next" onclick="plusSlides(1)">&#10095;</a>';

    for (let i = 0; i < galleryLength; i++) {
      slideShowElements += slideImagesWrapper(slidesNumber(i) + slidesImage(pathName, i, name));
      slidesDotes.splice(slidesDotes.length - 2, slidesDot(i + 1)); // debug!!!
    }

    slideShowElements += slidesDotes.join('') + slidesArrows;
  } else {
    slideShowElements = slidesImagesWrapper(slidesImage(pathName, 0, name));
  }

  return createElementFromHTML(slideShowElements, slidesWrapperClassName);
}