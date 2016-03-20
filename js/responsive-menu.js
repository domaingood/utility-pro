( function (document, $, undefined) {
    'use strict';

    var utility = {},
        mainMenuButtonClass = 'menu-toggle',
        subMenuButtonClass = 'sub-menu-toggle',
        footerMenuButtonClass = 'footer-menu-toggle';

    utility.init = function () {
        var toggleButtons = {
            menu: $('<button />', {
                'class': mainMenuButtonClass,
                'aria-controls': $('.nav-primary').attr('id'),
                'aria-expanded': false,
                'aria-label': utility.params.buttonLabel,
                'aria-pressed': false,
                'role': 'button'
            })
                .append(utility.params.buttonText),
            submenu: $('<button />', {
                'class': subMenuButtonClass,
                'aria-expanded': false,
                'aria-label': utility.params.subButtonLabel,
                'aria-pressed': false,
                'role': 'button'
            })
                .append($('<span />', {
                    'class': 'screen-reader-text',
                    text: utility.params.subButtonText
                })),
            footermenu: $('<button />', {
                'class': footerMenuButtonClass,
                'aria-controls': $('.nav-footer').attr('id'),
                'aria-expanded': false,
                'aria-label': utility.params.footerButtonLabel,
                'aria-pressed': false,
                'role': 'button'
            })
                .append(utility.params.footerButtonText)
        };
        $('.nav-primary').before(toggleButtons.menu); // add the main nav button
        $('.nav-primary .sub-menu').before(toggleButtons.submenu); // add the submenu nav button
        $('.nav-footer').before(toggleButtons.footermenu); // add the footer menu nav button
        $('.' + mainMenuButtonClass).each( _addClassID);
        $(window).on('resize.utility', _doResize).triggerHandler('resize.utility');
        $('.' + mainMenuButtonClass).on('click.utility-mainbutton', _mainmenuToggle);
        $('.' + subMenuButtonClass).on('click.utility-subbutton', _submenuToggle);
        $('.' + footerMenuButtonClass).on('click.utility-footerbutton', _footermenuToggle);
    };

    // add nav class and ID to related button
    function _addClassID() {
        var $this = $(this),
            nav = $this.next('nav'),
            id = 'class';
        $this.addClass($(nav).attr('class'));
        if ($(nav).attr('id')) {
            id = 'id';
        }
        $this.attr('id', 'mobile-' + $(nav).attr(id));
    }

    // Change Skiplinks and Superfish
    function _doResize() {
        var buttons = $('button[id^=mobile-]').attr('id');
        if (typeof buttons === 'undefined') {
            return;
        }
        _superfishToggle(buttons);
        _changeSkipLink(buttons);
        _maybeClose(buttons);
    }

    /**
     * action to happen when the main menu button is clicked
     */
    function _mainmenuToggle() {
        var $this = $(this);
        _toggleAria($this, 'aria-pressed');
        _toggleAria($this, 'aria-expanded');
        $this.toggleClass('activated');
        $this.next('.nav-primary, .sub-menu').slideToggle('fast');
    }

    /**
     * action for submenu toggles
     */
    function _submenuToggle() {

        var $this = $(this),
        others = $this.closest('.menu-item').siblings();
        _toggleAria($this, 'aria-pressed');
        _toggleAria($this, 'aria-expanded');
        $this.toggleClass('activated');
        $this.next('.sub-menu').slideToggle('fast');

        others.find('.' + subMenuButtonClass).removeClass('activated').attr('aria-pressed', 'false');
        others.find('.sub-menu').slideUp('fast');

    }

    /**
     * action for footermenu toggles
     */
     function _footermenuToggle() {
        var $this = $(this);
        _toggleAria($this, 'aria-pressed');
        _toggleAria($this, 'aria-expanded');
        $this.toggleClass('activated');
        $this.next('.nav-footer').slideToggle('fast');
     }

    /**
     * activate/deactivate superfish
     */
    function _superfishToggle(buttons) {
        if (typeof $('.js-superfish').superfish !== 'function') {
            return;
        }
        if ('none' === _getDisplayValue(buttons)) {
            $('.js-superfish').superfish({
                'delay': 100,
                'animation': {'opacity': 'show', 'height': 'show'},
                'dropShadows': false
            });
        } else {
            $('.js-superfish').superfish('destroy');
        }
    }

    /**
     * modify skip links to match mobile buttons
     */
    function _changeSkipLink(buttons) {
        var startLink = 'genesis-nav',
            endLink = 'mobile-genesis-nav';
        if ('none' === _getDisplayValue(buttons)) {
            startLink = 'mobile-genesis-nav';
            endLink = 'genesis-nav';
        }
        $('.genesis-skip-link a[href^="#' + startLink + '"]').each(function () {
            var link = $(this).attr('href');
            link = link.replace(startLink, endLink);
            $(this).attr('href', link );
        });
    }

    function _maybeClose(buttons) {
        if ('none' !== _getDisplayValue(buttons)) {
            return;
        }
        $('.menu-toggle, .sub-menu-toggle, .footer-menu-toggle')
            .removeClass('activated')
            .attr('aria-expanded', false)
            .attr('aria-pressed', false);
        $('nav, .sub-menu')
            .attr('style', '');
    }

    /**
     * generic function to get the display value of an element
     * @param  {id} $id ID to check
     * @return {string}     CSS value of display property
     */
    function _getDisplayValue($id) {
        var element = document.getElementById($id),
            style = window.getComputedStyle(element);
        return style.getPropertyValue('display');
    }

    /**
     * Toggle aria attributes
     * @param  {button} $this     passed through
     * @param  {aria-xx} attribute aria attribute to toggle
     * @return {bool}           from _ariaReturn
     */
    function _toggleAria($this, attribute) {
        $this.attr(attribute, function(index, value) {
            return _ariaReturn(value);
        });
    }

    /**
     * update aria-xx value of an attribute
     * @param  {aria-xx} value passed from function
     * @return {bool}
     */
    function _ariaReturn(value) {
        return 'false' === value ? 'true' : 'false';
    }

    $(document).ready(function () {
        utility.params = typeof utilityResponsiveL10n === 'undefined' ? '' : utilityResponsiveL10n;

        if (typeof utility.params !== 'undefined') {
            utility.init();
        }
    });

})(document, jQuery);
