jQuery(document).ready(function($) {
	$(".cars-slider").slick({
		infinite: true,
		slidesToShow: 5,
		slidesToScroll: 1,
		dots: false,
		arrows: false,
		centerMode: false,
		responsive: [
			{
				breakpoint: 1919,
				settings: {
					slidesToShow: 4,
				}
			},
			{
				breakpoint: 1499,
				settings: {
					slidesToShow: 3,
				}
			},
			{
				breakpoint: 1279,
				settings: {
					slidesToShow: 2,
				}
			},
			{
				breakpoint: 767,
				settings: {
					slidesToShow: 1,
				}
			},
		]
	});
	
	/* меню цен в планшете и моб */
	$(".prices .prices-content .prices-items .prices-search .show-prices-menu").click(function(){
		if($(this).hasClass("active"))
		{
			$(this).removeClass("active");
			$(".prices .prices-content .prices-items .prices-sidebar-mobile").slideUp("fast");
		}
		else
		{
			$(this).addClass("active");
			$(".prices .prices-content .prices-items .prices-sidebar-mobile").slideDown("fast");
		}
		
		return false;
	});
	
	/* мобильное меню */
	$(".header-fixed .header-fixed-menu").click(function(){
		if($(this).hasClass("active"))
		{
			$(this).removeClass("active");
			$(".header-fixed .header-fixed-main-menu").slideUp("fast");
		}
		else
		{
			$(this).addClass("active");
			$(".header-fixed .header-fixed-main-menu").slideDown("fast");
		}
		
		return false;
	});
	
	/* фильтр услуг */
	$("#spterm").on("input paste", function(){
		var value = $(this).val().toLowerCase();
		
		$(".prices-table-item").show();
		$(".prices-table.list").show();
		
		if(value != '')
		{
			$(".prices-table-item").each(function(){
				var name = $(this).find(".prices-table-item-name").text().toLowerCase();
				
				if(name.includes(value))
				{
					$(this).show();
				}
				else
				{
					$(this).hide();
				}
			});
			
			$(".prices-table.list").each(function(){
				var count = $(this).find(".prices-table-item:visible").length;
				var block_name = $(this).find("th.prices-table-header").text();

				if(count == 0)
				{
					$(this).hide();

					$('.prices-sidebar-menu.fixed-menu-main-page > li > a[href="#'+block_name+'"]').addClass('disabled-menu-link');
					$('.prices-sidebar-mobile > li > a[href="#'+block_name+'"]').addClass('disabled-menu-link');
				}
				else
				{
					$(this).show();

					$('.prices-sidebar-menu.fixed-menu-main-page > li > a[href="#'+block_name+'"]').removeClass('disabled-menu-link');
					$('.prices-sidebar-mobile > li > a[href="#'+block_name+'"]').removeClass('disabled-menu-link');
				}
			});
		}
		else
		{
			$(".prices-table-item").show();
			$(".prices-table.list").show();
			$('.prices-sidebar-menu.fixed-menu-main-page > li > a').removeClass('disabled-menu-link');
			$('.prices-sidebar-mobile > li > a').removeClass('disabled-menu-link');
		}
	});
	
	$("a").click(function(e){
		if($(this).hasClass("disabled-menu-link"))
		{
			return false;
		}
	});
});