/**
 * WEBSITE: https://themefisher.com
 * TWITTER: https://twitter.com/themefisher
 * FACEBOOK: https://www.facebook.com/themefisher
 * GITHUB: https://github.com/themefisher/
 */

(function ($) {
	'use strict';

	// Preloader js    
	$(window).on('load', function () {
		$('.preloader').fadeOut(100);

		// masonry
		$('.masonry-wrapper').masonry({
			columnWidth: 1
		});
	});


	// navfixed
	$(window).scroll(function () {
		if ($('.navigation').offset().top > 50) {
			$('.navigation').addClass('nav-bg');
		} else {
			$('.navigation').removeClass('nav-bg');
		}
	});

	// clipboard
	var clipInit = false;
	$('code').each(function () {
		var code = $(this),
			text = code.text();
		if (text.length > 2) {
			if (!clipInit) {
				var text, clip = new ClipboardJS('.copy-to-clipboard', {
					text: function (trigger) {
						text = $(trigger).prev('code').text();
						return text.replace(/^\$\s/gm, '');
					}
				});
				clipInit = true;
			}
			code.after('<span class="copy-to-clipboard">copy</span>');
		}
	});
	$('.copy-to-clipboard').click(function () {
		$(this).html('copied');
	});


	// match height
	$(function () {
		$('.match-height').matchHeight({
			byRow: true,
			property: 'height',
			target: null,
			remove: false
		});
	});

	// search
	$('#search-by').keyup(function () {
		if (this.value) {
			$(this).addClass('active');
		} else {
			$(this).removeClass('active');
		}
	});

   // navbar
   $('.navbar-burger').click(function() {
      $('.navbar-burger').toggleClass('is-active');
      $('.navbar-menu').toggleClass('is-active');

      $(this).attr('data-hidden', $(this).attr('data-hidden') === 'true' ? 'false' : 'true');
	});
	
	
	// tab
	$('.tab-content').find('.tab-pane').each(function (idx, item) {
		var navTabs = $(this).closest('.code-tabs').find('.nav-tabs'),
			title = $(this).attr('title');
		navTabs.append('<li class="control"><a class="button" href="#">' + title + '</a></li>');
	});

	$('.code-tabs ul.nav-tabs').each(function () {
		$(this).find('li:first').addClass('active');
	});

	$('.code-tabs .tab-content').each(function () {
		$(this).find('div:first').addClass('active').show();
	});

	$('.nav-tabs a').click(function (e) {
		e.preventDefault();
		var tab = $(this).parent(),
			tabIndex = tab.index(),
			tabPanel = $(this).closest('.code-tabs'),
			tabPane = tabPanel.find('.tab-pane').eq(tabIndex);
		tabPanel.find('.active').removeClass('active');
		tab.addClass('active');
		tabPane.addClass('active');
	});
	
   // JSAccordion/Collapse
	$.fn.collapsible = function() {
		var ns = {
			open: function (me, bypass) { // Open the target
				var conf = me[0].__collapsible;
				if (!conf) { return; }
				if (bypass !== true) {
					if (typeof conf.group === 'string') {
							if (String(conf.allowMultiple).toLowerCase() !== 'true') {
								window['collapsibleAnimations_'+conf.group] = 0;
								window['collapsibleGroup_'+conf.group] 		= $('[data-group="'+conf.group+'"]').not(me);
								var group = window['collapsibleGroup_'+conf.group];
									group.each(function () { ns.close($(this)); });
								ns.open(me, true);
								return;
							}
					}
				}
				me.trigger('before:open');
				me.attr('aria-expanded', true);
				conf.target.attr('aria-expanded', true);
				conf.expanded = true;
				me.trigger('open');
				if (conf.init !== true) {
					setTimeout(function () {
					conf.init = true;
					me.__collapsible = conf;
					}, conf.speed + 100);
				}
			},
			close: function (me) { // Close the target
				var conf = me[0].__collapsible;
				if (!conf) { return; }
				me.trigger('before:close');
				me.attr('aria-expanded', false);
				conf.target.attr('aria-expanded', false);
				conf.expanded = false;
				me.trigger('close');
				if (conf.init !== true) {
					setTimeout(function () {
					conf.init = true;
					me.__collapsible = conf;
					}, conf.speed + 100);
				}
			},
			toggle: function (me) { // Toggle the target open/close
				var conf = me[0].__collapsible;
				if (!conf) { return; }
				me.trigger('before:toggle');
				var active = String(me.attr('aria-expanded')).toLowerCase();
					active = (active === 'true') ? true : false;
				if (active === true) {
					ns.close(me);
				} else {
					ns.open(me);
				}
				me.trigger('toggle');
			},
			onClick: function (e) { // On click handler
				if (!e.target.__collapsible) { return; }
				if ($(e.target).is('a')) {
					e.preventDefault();
				}
				ns.toggle($(e.target));
			},
			onClose: function (e) { // On close handler
				if (!e.target.__collapsible) { return; }
				var me = e.target;
				var targ = me.__collapsible.target;
				targ.stop().slideUp(me.__collapsible.speed, function () {
					$(me).trigger('after:close');
					$(me).trigger('animation:complete', ['close']);
					window['collapsibleAnimations_'+me.__collapsible.group] += 1;
					var count = window['collapsibleAnimations_'+me.__collapsible.group];
					var group = window['collapsibleGroup_'+me.__collapsible.group];
					if (!group) { return; }
					if (count >= group.length) {
							$('[data-group="'+me.__collapsible.group+'"]:focus').trigger('animations:complete', ['close']);
					}
				});
			},
			onOpen: function (e) { // On open handler
				if (!e.target.__collapsible) { return; }
				var me = e.target;
				var targ = me.__collapsible.target;
				targ.stop().slideDown(me.__collapsible.speed, function () {
					$(me).trigger('after:open');
					$(me).trigger('animation:complete', ['open']);

					if (me.__collapsible.init === true) {
							if (String(me.__collapsible.allowMultiple).toLowerCase() === 'true') {
								$(me).trigger('animations:complete', ['open']);
							}
					}
				});
			}
		};

		if (typeof arguments[0] === 'string') { // Public Methods
				switch (String(arguments[0]).toLowerCase()) {
					case 'open':
					case 'show':
						this.each(function () { ns.open($(this)); });
						break;
					case 'close':
					case 'hide':
						this.each(function () { ns.close($(this)); });
						break;
					case 'toggle':
						this.each(function () { ns.toggle($(this)); });
						break;
				}
				return this;
		} else { // Initialization
				// Event listeners
				this.on('click', ns.onClick);
				this.on('open', ns.onOpen);
				this.on('close', ns.onClose);
				var defaultConfig = $.extend({
					allowMultiple: false,
					expanded: false,
					group: null,
					init: false,
					speed: 250,
					target: null,
					temp: {}
				}, arguments[0]);

				// Constructor
				this.each(function (i) {
					// Default config
					var config = $.extend({}, defaultConfig);
					// update the config with data attributes
					var data = $(this).data();
					for (var prop in defaultConfig) {
						if (data[prop]) { config[prop] = data[prop]; }
					}
					// If the element is an <a> tag -> use the href attribute
					if ($(this).is('a')) {
						config.target = $(this).attr('href') || config.target;
					}
					// Exit if no target specified
					if (!config.target || config.target === null) { return; }
					// Convert the target into a jQuery object
					config.target = $(config.target);
					// Set the expanded value
					config.expanded = $(this).attr('aria-expanded') || config.expanded;
					config.expanded = (typeof config.expanded === 'string') ? config.expanded.toLowerCase() : config.expanded;
					config.expanded = (config.expanded === 'true') ? true : config.expanded;
					// temp storage object
					config.temp = {animations: 0, group: null};
					// Initialize
					this.__collapsible = config;
					// Open/close any elements
					if (config.expanded === true) {
						ns.open($(this));
					} else {
						ns.close($(this));
					}
				});
				// Return the query
				return this;
		}
	};
	// Default initializer
	$('[data-toggle="collapse"]').collapsible();

	// Accordions
	$('[data-toggle="collapse"]').on('click', function() {
		if( $(this).attr('aria-expanded') === 'true' ) {
			$(this).children('.ti-plus').removeClass('ti-plus').addClass('ti-minus');
		} else {
			$(this).children('.ti-minus').removeClass('ti-minus').addClass('ti-plus');
		}
	});

})(jQuery);


document.addEventListener('DOMContentLoaded', () => {

    const serviceLinks = document.querySelectorAll('.service-arrow-link');
    const closeButtons = document.querySelectorAll('.close-panel-btn');

    // Function to handle opening/closing the details panel
    const togglePanel = (targetId) => {
        const targetPanel = document.querySelector(targetId);
        if (!targetPanel) return;

        const isActive = targetPanel.classList.contains('is-active');
        
        // 1. Close ALL other panels
        document.querySelectorAll('.service-details-panel.is-active').forEach(openPanel => {
            if (openPanel.id !== targetPanel.id.substring(1)) {
                // Ensure the animation starts from the full height to slide up smoothly
                openPanel.style.height = openPanel.scrollHeight + 'px';
                setTimeout(() => {
                    openPanel.style.height = '0'; // Transition to height 0
                }, 10);
                openPanel.classList.remove('is-active');

                // Reset the associated link text
                const associatedLink = document.querySelector(`.service-arrow-link[data-target="#${openPanel.id}"]`);
                if (associatedLink) {
                    associatedLink.innerHTML = `View Details <i class="ti-arrow-right"></i>`;
                }
            }
        });

        // 2. Toggle the current panel
        if (isActive) {
            // Close the panel (Slide up)
            targetPanel.style.height = targetPanel.scrollHeight + 'px'; // Set current height
            setTimeout(() => {
                targetPanel.style.height = '0'; // Transition to height 0
            }, 10);
            targetPanel.classList.remove('is-active');
            
        } else {
            // Open the panel (Slide down)
            targetPanel.classList.add('is-active');
            // Set the height to scrollHeight for the slide-down animation
            targetPanel.style.height = targetPanel.scrollHeight + 'px';
            
            // CRITICAL: Remove height property after transition finishes
            targetPanel.addEventListener('transitionend', function handler() {
                if (targetPanel.classList.contains('is-active')) {
                    targetPanel.style.height = 'auto'; // Revert to auto height after slide is complete
                }
                targetPanel.removeEventListener('transitionend', handler);
            });
        }
        
        // 3. Update the arrow/link text 
        const currentLink = document.querySelector(`.service-arrow-link[data-target="${targetId}"]`);
        if (currentLink) {
            if (isActive) {
                 currentLink.innerHTML = `View Details <i class="ti-arrow-right"></i>`;
            } else {
                 currentLink.innerHTML = `Hide Details <i class="ti-arrow-up"></i>`; // Change arrow direction
            }
        }
    };
    
    // Attach listener to all "View Details" links
    serviceLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            togglePanel(targetId);
        });
    });

    // Attach listener to all "Close" buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = button.getAttribute('data-target');
            togglePanel(targetId);
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // 1. Get the fixed navigation bar element and calculate its height
    // Using a safe query selector for the fixed nav bar
    const navbar = document.querySelector('.navbar.is-sticky-top');
    // Set a default offset in case the navbar is not found
    let NAVBAR_HEIGHT = navbar ? navbar.offsetHeight : 0; 
    
    // Add extra padding (e.g., 20 pixels) below the navbar for better visual separation
    const SCROLL_OFFSET = NAVBAR_HEIGHT + 20; 

    const detailButtons = document.querySelectorAll('[data-target]');

    detailButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); 
            
            const targetId = button.getAttribute('data-target');
            const targetPanel = document.querySelector(targetId);

            if (targetPanel) {
                // (Existing logic to show the panel happens here)

                // Wait for the panel's height transition to complete (500ms is a safe delay)
                setTimeout(() => {
                    // 2. Calculate the position to scroll to
                    // targetPanel.offsetTop gives the element's position from the top of the document
                    const targetPosition = targetPanel.offsetTop - SCROLL_OFFSET;

                    // 3. Perform the scroll using the calculated position
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }, 500); 
            }
        });
    });
});
