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
	
	/* сворачиваемые группы прайса: счётчик услуг в заголовке.
	   Классы ia-acc/is-open и раскрытие по клику — в нативном блоке в конце файла. */
	$(".prices-content").has(".prices-table").each(function(){
		$(this).find(".prices-table").each(function(){
			var $table = $(this);
			var $title = $table.find("thead.prices-table-header th.prices-table-header").first();
			if(!$title.length) return;

			if(!$title.find(".ia-acc__meta").length){
				var count = $table.find("tbody .prices-table-item").length;
				$title.append('<span class="ia-acc__meta"><span>'+count+' '+(count === 1 ? 'услуга' : (count < 5 ? 'услуги' : 'услуг'))+'</span><i aria-hidden="true"></i></span>');
			}
		});
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

/* Анимации и аккордеон прайса. */
(function(){
	function initMotion(){
		var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		var body = document.body;
		if(!body) return;
		body.classList.add('ia-motion-ready');
		var progress = document.createElement('div'); progress.className = 'ia-scroll-progress'; progress.setAttribute('aria-hidden','true'); body.appendChild(progress);
		// Родитель и вложенные карточки не должны анимироваться одновременно.
		var selector = '.ia-head,.ia-dir,.services-provided__item,.ia-adv__item,.ia-reviews > *,.ia-work__item,.ia-cta,.ia-brands__group,.prices-table,.right-services-list,.header-top-banner-models,.contacts-page__map,.article > *';
		var revealTargets = Array.prototype.filter.call(document.querySelectorAll(selector), function(el){
			return !el.querySelector(selector);
		});
		Array.prototype.forEach.call(revealTargets, function(el, index){
			el.classList.add('ia-reveal');
			var siblings = Array.prototype.filter.call(el.parentNode.children, function(child){return child.matches(selector);});
			el.style.setProperty('--ia-delay', (siblings.indexOf(el) % 4) * 70 + 'ms');
			// Уже видимый контент не скрываем при запуске отложенного скрипта.
			if(el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-visible');
		});
		if(reduced || !('IntersectionObserver' in window)){ Array.prototype.forEach.call(revealTargets, function(el){el.classList.add('is-visible');}); }
		else {
			var observer = new IntersectionObserver(function(entries){ entries.forEach(function(entry){ if(entry.isIntersecting){ entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }); }, {threshold:0, rootMargin:'0px 0px -40px'});
			revealTargets.forEach(function(el){if(!el.classList.contains('is-visible')) observer.observe(el);});
			// Переход с клавиатуры сразу показывает элемент.
			document.addEventListener('focusin', function(event){var el = event.target.closest('.ia-reveal'); if(el){el.classList.add('is-visible'); observer.unobserve(el);}});
		}
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

// Шапка прилипает так, чтобы над экраном оставалось только меню, независимо от высоты верхней строки
(function () {
	var h = document.querySelector('.ia-header'), n = h && h.querySelector('.ia-nav');
	if (!h || !n) return;
	function fit() {
		var mobile = window.matchMedia('(max-width: 700px)').matches;
		var headerStyle = getComputedStyle(h);
		var overlap = mobile ? h.getBoundingClientRect().height : n.getBoundingClientRect().height + (parseFloat(getComputedStyle(n).top) || 0) + (parseFloat(headerStyle.paddingBottom) || 0);
		document.documentElement.style.setProperty('--ia-anchor-offset', Math.ceil(overlap + 16) + 'px');
		if (window.matchMedia('(max-width: 700px)').matches) { h.style.top = '0px'; return; }
		if (!n.offsetParent) { h.style.top = ''; return; }
		var gap = parseFloat(getComputedStyle(n).top) || 0;
		h.style.top = -(n.getBoundingClientRect().top - h.getBoundingClientRect().top - gap) + 'px';
	}
	fit();
	window.addEventListener('resize', fit);
	window.addEventListener('load', fit);
	if (window.ResizeObserver) new ResizeObserver(fit).observe(h);
})();

/* Мобильная навигация. */
(function(){
 function init(){
  document.querySelectorAll('.ia-header .ia-nav').forEach(function(nav, index){
   var header=nav.closest('.ia-header');
   var mobile=window.matchMedia('(max-width: 700px)');
   var button=document.createElement('button');
   nav.id=nav.id || 'ia-navigation-'+index;
   button.type='button'; button.className='ia-menu-toggle';
   button.setAttribute('aria-controls',nav.id); button.setAttribute('aria-expanded','false');
   button.innerHTML='<span>Меню</span><span class="ia-menu-toggle__icon" aria-hidden="true">☰</span>';
   nav.before(button); header.classList.add('ia-menu-ready');
   var row=header.querySelector('.ia-header__row');
   function placeButton(){if(mobile.matches && row)row.appendChild(button);else nav.before(button);}
   placeButton(); mobile.addEventListener('change',placeButton);
   function close(){
    header.classList.remove('ia-menu-open'); button.setAttribute('aria-expanded','false');
    button.querySelector('.ia-menu-toggle__icon').textContent='☰';
    nav.querySelectorAll('.ia-nav__drop').forEach(function(drop){drop.classList.remove('is-open');drop.querySelector('span').setAttribute('aria-expanded','false');});
   }
   button.addEventListener('click',function(){
    if(header.classList.contains('ia-menu-open')){close();return;}
    header.classList.add('ia-menu-open');button.setAttribute('aria-expanded','true');
    button.querySelector('.ia-menu-toggle__icon').textContent='×';
   });
   nav.querySelectorAll('.ia-nav__drop').forEach(function(drop, i){
    var trigger=drop.querySelector('span'), panel=drop.querySelector('ul');
    if(!trigger || !panel)return;
    panel.id=panel.id || nav.id+'-services-'+i;
    trigger.setAttribute('role','button');trigger.tabIndex=0;
    trigger.setAttribute('aria-controls',panel.id);trigger.setAttribute('aria-expanded','false');
    function toggle(){if(!mobile.matches)return;var open=drop.classList.toggle('is-open');trigger.setAttribute('aria-expanded',String(open));}
    trigger.addEventListener('click',toggle);
    trigger.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
   });
   nav.addEventListener('click',function(e){if(mobile.matches && e.target.closest('a'))close();});
   document.addEventListener('click',function(e){if(!header.contains(e.target))close();});
   document.addEventListener('keydown',function(e){if(e.key==='Escape' && header.classList.contains('ia-menu-open')){close();button.focus();}});
   mobile.addEventListener('change',close);
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

/* Закрытие меню связи снаружи и клавишей Escape. */
(function(){
 document.addEventListener('click',function(event){document.querySelectorAll('.ia-contact-widget[open]').forEach(function(widget){if(!widget.contains(event.target))widget.removeAttribute('open');});});
 document.addEventListener('keydown',function(event){if(event.key!=='Escape')return;document.querySelectorAll('.ia-contact-widget[open]').forEach(function(widget){widget.removeAttribute('open');widget.querySelector('summary').focus();});});
})();

/* Возврат к началу страницы. */
(function(){
 var button=document.getElementById('btnTop');if(!button)return;
 function update(){button.classList.toggle('is-visible',window.scrollY>500);}
 window.addEventListener('scroll',update,{passive:true});update();
 button.addEventListener('click',function(){window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});
})();
