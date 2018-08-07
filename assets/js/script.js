$(document).ready(function(){
  $('.presentation-carousel').slick({
    prevArrow:"<i class='icon-arrow-left' style='font-size:30px; position:absolute; left:-95px; color:#296460; top:40%'></i>",
    nextArrow:"<i class='icon-arrow-right' style='font-size:30px; position:absolute; right:-95px; top:40%; color:#296460'></i>",
  });
  $('.tab').on('click', function () {
    $('.tabs').find('.tab-active').removeClass('tab-active');
    $('.tabs').find('.tab-content.content-active').removeClass('content-active');
    $(this).addClass('tab-active');
		$('.tabs').find('#'+$(this).attr('data-number')).addClass('content-active');

		// Setting up the box shadows
		// the first and last tabs are always the same,
		// so we only need to run from second to the fifth
		for(i = 2; i < 6; i++){
			if (i < parseInt($(this).attr('data-number'))) {
				$('.tabs').find('.tab').filter('[data-number='+ i + ']')[0].style.boxShadow = 'inset -5px 0px 5px #00000014';
				$('.tabs').find('.tab').filter('[data-number='+ i + ']')[0].childNodes[1].style.boxShadow = 'inset -5px 0px 5px #00000014';
			} else {
				$('.tabs').find('.tab').filter('[data-number='+ i + ']')[0].style.boxShadow = 'inset 5px 0px 5px #00000014';
				$('.tabs').find('.tab').filter('[data-number='+ i + ']')[0].childNodes[1].style.boxShadow = 'inset 5px 0px 5px #00000014';
			}
		}
  })
});
