jQuery(document).ready(function($) {
	if ($.fn.slick) $(".cars-slider").slick({
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

	/* Иконка гаечного ключа в основном меню */
	$('.ia-nav>a[href*="obsluzhivanie"] svg').html('<path d="M20.7 7.3a4.5 4.5 0 0 1-5.9 5.9L7 21l-4-4 7.8-7.8a4.5 4.5 0 0 1 5.9-5.9l-2.4 2.4 2.8 2.8z"/>');

	/* На страницах услуг, направлений и моделей отзывы не дублируют основной контент. */
	if($('.header-top-banner-models, .prices').length){
		$('.customer-reviews').hide();
	}
	if(location.pathname === '/' || /\/index\.html$/i.test(location.pathname)){
		document.body.classList.add('home-page');
		$('.customer-reviews').show();
	}
	if(/\/price(?:\/|\/index\.html$)/i.test(location.pathname)){
		$('.ia-nav>a').removeClass('is-active');
		$('.ia-nav>a[href*="price"]')
			.addClass('is-active')
			.attr('aria-current', 'page');
	}
	$('.footer-center .footer-menu:first-child').hide();
	$('.footer').each(function(){
		if($(this).find('.footer-legal').length) return;
		$(this).find('.wrap').append('<div class="footer-legal"><p>Имидж Авто не является официальным дилером, дистрибьютором или производителем автомобилей и запасных частей.</p><p>Указанные на сайте цены приведены для ознакомления и не являются публичной офертой. Сайт носит информационный характер и не собирает и не обрабатывает персональные данные посетителей.</p><p>© 2026 Имидж Авто. Все права защищены.<br>ИНН: 0000000000</p></div>');
	});

	/* Общая кнопка раскрытия всех групп прайса. */
	$(document).on('click', '#ia-prices-toggle', function(){
		if(document.body.classList.contains('home-page')) return;
		var $button = $(this), $tables = $button.closest('.prices').find('.prices-table');
		if(!$tables.length) return;
		var open = !$tables.toArray().every(function(table){ return $(table).hasClass('is-open'); });
		$tables.toggleClass('is-open', open);
		$tables.find('thead.prices-table-header').attr('aria-expanded', String(open));
		$button.text(open ? 'Свернуть все' : 'Развернуть все');
	});

	/* Мобильный выбор раздела прайса. */
	$('.prices-content').each(function(){
		var $content = $(this), $menu = $content.find('.prices-sidebar .prices-sidebar-menu, .prices-sidebar .menu-list__items').first();
		if(!$menu.length || $content.find('.ia-mobile-price-menu').length) return;
		var $select = $('<button type="button" class="ia-mobile-price-menu" aria-expanded="false">Выбрать раздел <span>⌄</span></button>');
		var $panel = $('<div class="ia-mobile-price-panel" hidden></div>').append($menu.clone(true));
		$content.prepend($select, $panel);
		$select.on('click', function(){ var open = !$panel.prop('hidden'); $panel.prop('hidden', open); $select.attr('aria-expanded', String(!open)); });
		$panel.on('click', 'a, .menu-list__item', function(){ $panel.prop('hidden', true); $select.attr('aria-expanded','false'); });
	});

	/* Единый блок обращения после прайса. */
	$('.prices').each(function(){
		var $prices = $(this);
		if($prices.find('.ia-price-cta').length) return;
		var depth = location.pathname.split('/').filter(Boolean); if(depth[depth.length - 1] === 'index.html') depth.pop();
		var contactPath = (depth.length ? '../'.repeat(depth.length) : '') + 'contacts/index.html';
		$prices.append('<div class="ia-price-cta ia-cta"><div class="ia-cta__text"><b>Нужна помощь с ремонтом?</b><span>Запишитесь, позвоните или задайте вопрос мастеру — подскажем стоимость и ближайшее время.</span></div><div class="ia-cta__btns"><a class="ia-btn ia-btn--lime" href="tel:+79062376365">Позвонить</a><a class="ia-btn ia-btn--ghost" href="'+contactPath+'">Задать вопрос мастеру</a></div></div>');
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

	/* сворачиваемые группы прайса: счётчик услуг в заголовке.
	   Классы ia-acc/is-open и раскрытие по клику — в нативном блоке в конце файла. */
	$(".prices-content").has(".prices-table").each(function(){
		$(this).find(".prices-table").each(function(){
			var $table = $(this);
			var $title = $table.find("thead.prices-table-header th.prices-table-header").first();
			if(!$title.length) return;

			/* Не дублируем элементы при повторной инициализации. */
			if(!$title.find(".ia-acc__meta").length){
				var count = $table.find("tbody .prices-table-item").length;
				$title.append('<span class="ia-acc__meta"><span>'+count+' '+(count === 1 ? 'услуга' : (count < 5 ? 'услуги' : 'услуг'))+'</span><i aria-hidden="true"></i></span>');
			}
		});
	});

	function togglePriceTable($header){
		var $table = $header.closest(".prices-table");
		var isOpen = $table.hasClass("is-open");
		$table.toggleClass("is-open", !isOpen);
		$header.attr("aria-expanded", String(!isOpen));
	}

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
		$(this).closest(".prices-content").toggleClass("is-searching", value != '');
		
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

/* Резервный нативный обработчик аккордеона прайса. */
(function(){
	/* Асama-inspired motion: deliberate reveals, a restrained hero parallax and tactile CTAs. */
	function initMotion(){
		var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		var body = document.body;
		if(!body) return;
		body.classList.add('ia-motion-ready');
		var progress = document.createElement('div'); progress.className = 'ia-scroll-progress'; progress.setAttribute('aria-hidden','true'); body.appendChild(progress);
		var revealTargets = document.querySelectorAll('.ia-dirs,.services-provided,.ia-adv,.ia-work,.ia-cta,.ia-band-dark,.prices-content,.right-services-list,.header-top-banner-models,.contacts-page__map,.article > *');
		Array.prototype.forEach.call(revealTargets, function(el, index){
			el.classList.add('ia-reveal');
			if(index % 5 === 1) el.classList.add('ia-reveal--left');
			if(index % 5 === 3) el.classList.add('ia-reveal--right');
			el.style.setProperty('--ia-delay', Math.min(index % 4, 3) * 70 + 'ms');
		});
		if(reduced || !('IntersectionObserver' in window)){ Array.prototype.forEach.call(revealTargets, function(el){el.classList.add('is-visible');}); }
		else { var observer = new IntersectionObserver(function(entries){ entries.forEach(function(entry){ if(entry.isIntersecting){ entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }); }, {threshold:.12, rootMargin:'0px 0px -8%'}); Array.prototype.forEach.call(revealTargets, function(el){observer.observe(el);}); }
		if(reduced) return;
		var hero = document.querySelector('.ia-hero'), ticking = false;
		function update(){ ticking=false; var y=Math.min(window.scrollY || 0, 520); if(hero) hero.style.setProperty('--ia-hero-shift', (y * .045) + 'px'); var total=document.documentElement.scrollHeight-window.innerHeight; progress.style.transform='scaleX('+(total>0?Math.min(1,Math.max(0,(window.scrollY||0)/total)):0)+')'; }
		window.addEventListener('scroll', function(){ if(!ticking){ticking=true; requestAnimationFrame(update);} }, {passive:true}); update();
		if(window.matchMedia('(hover: hover) and (pointer: fine)').matches){ document.querySelectorAll('.ia-btn,.ia-phone,.ia-work__more').forEach(function(btn){ btn.addEventListener('pointermove', function(e){var r=btn.getBoundingClientRect(), x=(e.clientX-r.left-r.width/2)/r.width*10, y=(e.clientY-r.top-r.height/2)/r.height*8; btn.style.transform='translate3d('+x+'px,'+y+'px,0)';}); btn.addEventListener('pointerleave', function(){btn.style.transform='';}); }); }
	}
	if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMotion); else initMotion();

	function initPriceAccordion(){
		document.querySelectorAll('.prices-content').forEach(function(content){
			var tables = content.querySelectorAll(':scope > .prices-items .prices-table');
			if(!tables.length) tables = content.querySelectorAll('.prices-table');
			if(!tables.length) return;
			/* Стили аккордеона ищут .ia-acc внутри .prices-content, поэтому класс на .prices-items. */
			content.classList.add('ia-acc');
			var items = content.querySelector(':scope > .prices-items');
			if(items) items.classList.add('ia-acc');
			tables.forEach(function(table, index){
				var header = table.querySelector('thead.prices-table-header');
				if(!header) return;
				header.setAttribute('role','button');
				header.setAttribute('tabindex','0');
				header.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
				table.classList.toggle('is-open', index === 0);
			});
		});
		/* Переход по ссылке вида price/#3 — раскрыть эту группу. */
		openPriceTable(document.getElementById(decodeURIComponent(location.hash.slice(1))));
	}
	/* id группы стоит на table (страница цен) или на её thead (страницы марок). */
	function openPriceTable(el){
		var table = el && el.closest && el.closest('.prices-table');
		if(!table) return;
		table.classList.add('is-open');
		var header = table.querySelector('thead.prices-table-header');
		if(header) header.setAttribute('aria-expanded','true');
	}
	/* Меню групп справа (onclick="location.href = '#3'"): раскрыть группу, к которой прокручиваем.
	   На главной onclick снимает свой скрипт, там это не срабатывает. */
	function openFromMenu(event){
		var item = event.target.closest && event.target.closest('.menu-list__item');
		if(!item) return;
		var m = (item.getAttribute('onclick') || '').match(/#(\d+)/);
		if(m) openPriceTable(document.getElementById(m[1]));
	}
	function togglePrice(event){
		var header = event.target.closest && event.target.closest('.ia-acc thead.prices-table-header');
		if(!header) return;
		if(event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
		if(event.type === 'keydown') event.preventDefault();
		var table = header.closest('.prices-table');
		var open = table.classList.toggle('is-open');
		header.setAttribute('aria-expanded', String(open));
	}
	if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initPriceAccordion);
	else initPriceAccordion();
	document.addEventListener('click', togglePrice);
	document.addEventListener('keydown', togglePrice);
	document.addEventListener('click', openFromMenu);
})();
