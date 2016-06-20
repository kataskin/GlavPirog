"use strict";

var checkout = document.querySelector(".basket__btn");
var popup = document.querySelector(".popup");
var popupCloseBtn = popup.querySelector(".popup__close-btn");
var iconNav = document.querySelector(".page-header__icon-nav");
var navList = document.querySelector(".page-header__nav-list-wraper");

// open/close menu-nav
iconNav.addEventListener("click", function(event) {
  event.preventDefault();
  iconNav.classList.toggle("page-header__icon-nav--close");
  navList.classList.toggle("page-header__nav-list-wraper--open");
});

// open popup and smooth transition on top page
checkout.addEventListener("click", function(event) {
  event.preventDefault();
  popup.classList.add("popup--open");
  upPage();
});

// smooth transition on top page
var timerId;
var upPage = function() {
  var top = Math.max(document.body.scrollTop,document.documentElement.scrollTop);
  if(top > 0) {
    window.scrollBy(0,-100);
    timerId = setTimeout("upPage()",20);
  } else clearTimeout(timerId);
}

// close popup
popupCloseBtn.addEventListener("click", function() {
  popup.classList.remove("popup--open");
});


// animation numbers in first screen
var countYears = document.querySelector(".main-content__achievements-number--good-work");
var maxCountYears = 7;
var countProjects = document.querySelector(".main-content__achievements-number--projects");
var maxCountProjects = 2000;
var countParticipate = document.querySelector(".main-content__achievements-number--participate");
var maxCountParticipate = 2457;
var steps = 300;
var step = 0;
var currentCountYears = 0;
var currentCountProjects = 0;
var currentCountParticipate = 0;

var printCounters = function() {
  countYears.innerHTML = Math.round(currentCountYears);
  countProjects.innerHTML = Math.round(currentCountProjects);
  countParticipate.innerHTML = Math.round(currentCountParticipate);
}

var incrementCounters = function() {
  currentCountYears += maxCountYears / steps;
  currentCountProjects += maxCountProjects / steps;
  currentCountParticipate += maxCountParticipate / steps;
}

var timerOfNumber = setInterval (function() {
  incrementCounters();
  printCounters();
  step++;
  if (step === steps) {
    clearInterval(timerOfNumber);
  }
}, 4);


// smooth transition
document.querySelector("#link-second-screen").addEventListener("click", function (event) {
	event.preventDefault();
	var id  = $(this).attr('href'),
		top = $(id).offset().top;
	$('body,html').animate({scrollTop: top}, 500);
});

var cakesForBuy = [];
var menu = document.querySelector(".menu__cakes");
var template = document.querySelector("template");
var cakesContainers = document.querySelectorAll(".basket__wrapper--for-template");
var checkoutBtn = document.querySelector(".basket__btn");
var elementToClone;

// set to basket
menu.addEventListener("click", function(evt) {
  if (evt.target.classList.contains("menu__link-in-basket")) {
    event.preventDefault();
    var cakeBlock = evt.target.parentElement;
    for (var i = 0; i < cakesForBuy.length; i++) {
      if (cakesForBuy[i].name === cakeBlock.querySelector(".menu__cake-name").innerHTML) {
        cakesForBuy[i].count += 1;
        printBasket();
        return;
      }
    }
    cakesForBuy.push({
      name: cakeBlock.querySelector(".menu__cake-name").innerHTML,
      price: cakeBlock.querySelector(".menu__cake-price").innerHTML,
      weight: 1,
      count: 1
    });
  }
  printBasket();
});

if ("content" in template) {
    elementToClone = template.content.querySelector(".basket__buy-item");
} else {
    elementToClone = template.querySelector(".basket__buy-item");
}

// print 1 cake in basket
var printBasketElement = function(cake, container) {
  var element = elementToClone.cloneNode(true);
  if (cake.weight === 1) {
    element.querySelector(".basket__full-weight-sign").classList.add("basket__full-weight-sign--active");
    element.querySelector(".basket__cakes-price").textContent = cake.price * cake.count;
  } else {
    element.querySelector(".basket__half-weight-sign").classList.add("basket__half-weight-sign--active");
    element.querySelector(".basket__cakes-price").textContent = cake.price * cake.count * 0.65;
  }
  element.querySelector(".basket__cake-name").textContent = cake.name;
  element.querySelector(".basket__quantity-cakes").textContent = cake.count;
  container.appendChild(element);
};

// print basket
var printBasket = function() {
  cakesContainers.forEach(function(cont) {
    cont.innerHTML = "";
  });
  var fullPrice = 0;
  var fullWeight = 0;
  var fullCount = 0;
  for (var i = 0; i < cakesForBuy.length; i++) {
    cakesContainers.forEach(function(cont) {
      printBasketElement(cakesForBuy[i], cont);
    });
    if (cakesForBuy[i].weight === 1) {
      fullPrice += cakesForBuy[i].price * cakesForBuy[i].count;
    } else {
      fullPrice += cakesForBuy[i].price * cakesForBuy[i].count * 0.65;
    }
    fullCount += cakesForBuy[i].count;
    fullWeight += cakesForBuy[i].weight * cakesForBuy[i].count;
  }
  if (cakesContainers[0].offsetHeight >= 170 && !cakesContainers[0].classList.contains("basket__wrapper--on-page")) {
    cakesContainers[0].classList.add("basket__wrapper--on-page");
  } else if (cakesContainers[0].offsetHeight < 170) {
    cakesContainers[0].classList.remove("basket__wrapper--on-page");
  }
  if (cakesContainers[1].offsetHeight >= 525 && !cakesContainers[1].classList.contains("basket__wrapper--popup")) {
    cakesContainers[1].classList.add("basket__wrapper--popup");
  } else if (cakesContainers[1].offsetHeight < 525) {
    cakesContainers[1].classList.remove("basket__wrapper--popup");
  }
  document.querySelectorAll(".basket__full-price").forEach(function(label) {
    label.innerHTML = fullPrice;
  });
  document.querySelectorAll(".basket__full-weight").forEach(function(label) {
    label.innerHTML = fullWeight;
  });
  document.querySelectorAll(".basket__full-count").forEach(function(label) {
    label.innerHTML = fullCount;
  });
  if (fullCount !== 0 && !checkoutBtn.classList.contains("basket__btn--active")) {
    checkoutBtn.classList.add("basket__btn--active");
  } else if (fullCount === 0) {
    checkoutBtn.classList.remove("basket__btn--active");
    popup.classList.remove("popup--open");
  }
};

// action inside basket
var basketClickHandler = function(evt) {
  var elemOnClick = evt.target;
  var elemClasses = elemOnClick.classList;
  if (!elemClasses.contains("basket__buy-item")) {
    var cakeInBasket = elemOnClick.parentElement;
    var cakesInBasket = cakeInBasket.parentElement;
    cakesInBasket.childNodes.indexOf = [].indexOf;
    var indexElem = cakesInBasket.childNodes.indexOf(cakeInBasket);
    var selectedCake = cakesForBuy[indexElem];
    if (elemClasses.contains("basket__full-weight-sign")) {
      selectedCake.weight = 1;
    } else if (elemClasses.contains("basket__half-weight-sign")) {
      selectedCake.weight = 0.5;
    } else if (elemClasses.contains("basket__count-cakes--more")) {
      event.preventDefault();
      selectedCake.count += 1;
    } else if (elemClasses.contains("basket__count-cakes--less")) {
      event.preventDefault();
      if (selectedCake.count === 1) {
        cakesForBuy.splice(indexElem, 1);
      } else {
        selectedCake.count -= 1;
      }
    }
    printBasket();
  }
}

var basketLists = document.querySelectorAll(".basket__wrapper--for-template");
basketLists.forEach(function(list) {
  list.addEventListener("click", basketClickHandler);
});

printBasket();
