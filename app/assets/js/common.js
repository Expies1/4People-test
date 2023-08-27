$(function () {
  // custom select
  $(function () {
    $(".select__top").on("click", function () {
      $(this).parents(".select").toggleClass("select--active");
    });
    $(".select__link").on("click", function () {
      let value = $(this).text();
      $(this).parents(".select").removeClass("select--active");
      $(this).parents(".select").find(".select__top-title").text(value);
      $(this).parents(".select").find("input").val(value);
      $(this).parents(".select").find("input").trigger("input");
    });
  });

  // Кнопка загрузки файла
  $(function () {
    $(".file-btn input").on("change", function () {
      let value = $(this).val().split("\\").pop();
      $(this).parents(".file-btn").find("label span").text(value);
      console.log($(this).val().split("\\").pop());
    });
  });

  // range slider
  $(function () {
    $(".js-range-slider").on("change", function () {
      let value = $(this).val();
      $(".ordering__form-range-top span").text(`${value} %`);
    });
  });

  // Скролл шапки
  $(function () {
    $(window).scroll(function () {
      if ($(window).scrollTop() > 50) {
        $(".header").addClass("header--hide");
      } else {
        $(".header").removeClass("header--hide");
      }
    });
  });

  // мобильное меню
  $(function () {
    $(".header__burger").on("click", function () {
      $(".mobile-menu").toggleClass("mobile-menu--active");
      $(this).toggleClass("header__burger--active");
      $("body").toggleClass("overflow");
    });
  });
});

$(document).ready(function () {
  if ($(".js-range-slider").length) {
    $(".js-range-slider").ionRangeSlider({
      min: 0,
      max: 100,
      type: "single",
      step: 5,
    });
  }

  if ($(window).scrollTop() > 50) {
    $(".header").addClass("header--hide");
  } else {
    $(".header").removeClass("header--hide");
  }
});
