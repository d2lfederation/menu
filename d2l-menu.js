/**
`d2l-menu`
Polymer-based web component for menus.

@demo demo/menu.html standard, custom menu
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import 'd2l-colors/d2l-colors.js';
import 'd2l-hierarchical-view/d2l-hierarchical-view-behavior.js';
import 'd2l-polymer-behaviors/requestIdleCallback.js';
import './d2l-menu-item.js';
import './d2l-menu-item-return.js';
import './d2l-menu-item-separator.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-menu">

	<template strip-whitespace="">
		<style include="d2l-hierarchical-view-styles">

			:host {
				box-sizing: border-box;
				display: block;
				min-width: 180px;
				width: 100%;
				padding-top: 1px;
			}

			:host([active]) .d2l-menu-items d2l-menu-item-return[role="menuitem"],
			:host([active]) .d2l-menu-items ::slotted([role="menuitem"]),
			:host([active]) .d2l-menu-items ::slotted([role="menuitemcheckbox"]),
			:host([active]) .d2l-menu-items ::slotted([role="menuitemradio"]) {
				position: relative;
			}

			.d2l-menu-items d2l-menu-item-return[role="menuitem"],
			.d2l-menu-items ::slotted([role="menuitem"]),
			.d2l-menu-items ::slotted([role="menuitemcheckbox"]),
			.d2l-menu-items ::slotted([role="menuitemradio"]) {
				margin-top: -1px;
				border: 1px solid transparent;
				border-top-color: var(--d2l-color-gypsum);
				color: var(--d2l-color-ferrite);
			}
			.d2l-menu-items d2l-menu-item-return[role="menuitem"],
			.d2l-menu-items ::slotted(.d2l-menu-item-first[role="menuitem"]),
			.d2l-menu-items ::slotted(.d2l-menu-item-first[role="menuitemcheckbox"]),
			.d2l-menu-items ::slotted(.d2l-menu-item-first[role="menuitemradio"]) {
				border-top-color: transparent;
			}
			.d2l-menu-items d2l-menu-item-return[role="menuitem"]:focus,
			.d2l-menu-items d2l-menu-item-return[role="menuitem"]:hover,
			.d2l-menu-items ::slotted([role="menuitem"]:focus),
			.d2l-menu-items ::slotted([role="menuitem"]:hover),
			.d2l-menu-items ::slotted([role="menuitemcheckbox"]:focus),
			.d2l-menu-items ::slotted([role="menuitemcheckbox"]:hover),
			.d2l-menu-items ::slotted([role="menuitemradio"]:focus),
			.d2l-menu-items ::slotted([role="menuitemradio"]:hover),
			.d2l-menu-items ::slotted(.d2l-menu-item-first[role="menuitem"]:focus),
			.d2l-menu-items ::slotted(.d2l-menu-item-first[role="menuitem"]:hover),
			.d2l-menu-items ::slotted(.d2l-menu-item-first[role="menuitemcheckbox"]:focus),
			.d2l-menu-items ::slotted(.d2l-menu-item-first[role="menuitemcheckbox"]:hover),
			.d2l-menu-items ::slotted(.d2l-menu-item-first[role="menuitemradio"]:focus),
			.d2l-menu-items ::slotted(.d2l-menu-item-first[role="menuitemradio"]:hover) {
				z-index: 2;
				background-color: var(--d2l-color-celestine-plus-2);
				border-top: 1px solid var(--d2l-color-celestine-plus-1);
				border-bottom: 1px solid var(--d2l-color-celestine-plus-1);
				color: var(--d2l-color-celestine);
			}
			.d2l-menu-items ::slotted(.d2l-menu-item-last[role="menuitem"]:focus),
			.d2l-menu-items ::slotted(.d2l-menu-item-last[role="menuitem"]:hover),
			.d2l-menu-items ::slotted(.d2l-menu-item-last[role="menuitemcheckbox"]:focus),
			.d2l-menu-items ::slotted(.d2l-menu-item-last[role="menuitemcheckbox"]:hover),
			.d2l-menu-items ::slotted(.d2l-menu-item-last[role="menuitemradio"]:focus),
			.d2l-menu-items ::slotted(.d2l-menu-item-last[role="menuitemradio"]:hover) {
				border-bottom-color: var(--d2l-color-celestine-plus-1);
			}
			.d2l-menu-items ::slotted(d2l-menu-item-separator) {
				position: relative;
				z-index: 1;
				margin-top: -1px;
				border-top: 1px solid var(--d2l-color-corundum);
			}
		</style>
		<div class="d2l-menu-items d2l-hierarchical-view-content">
			<slot></slot>
		</div>
	</template>

	

</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'd2l-menu',

	behaviors: [
		D2L.PolymerBehaviors.HierarchicalViewBehavior
	],

	hostAttributes: {
		'role': 'menu'
	},

	listeners: {
		'_blur': '_onMenuItemBlur',
		'_focus': '_onMenuItemFocus',
		'_mouseenter': '_onMenuItemMouseEnter',
		'_mouseleave': '_onMenuItemMouseLeave',
		'd2l-hierarchical-view-show-start': '_onShowStart',
		'd2l-hierarchical-view-hide-complete': '_onHideComplete',
		'd2l-hierarchical-view-show-complete': '_onShowComplete',
		'd2l-hierarchical-view-resize': '_onViewResize',
		'd2l-menu-item-visibility-change': '_onMenuItemsChanged',
		'keydown': '_onKeyDown',
		'keypress': '_onKeyPress'
	},

	properties: {
		label: {
			type: String,
			observer: '_labelChanged',
			reflectToAttribute: true
		},
		noReturnItem: {
			type: Boolean,
			reflectToAttribute: true
		},
		active: {
			type: Boolean,
			reflectToAttribute: true
		}
	},

	_keyCodes: {
		DOWN: 40,
		ENTER: 13,
		ESCAPE: 27,
		LEFT: 37,
		SPACE: 32,
		RIGHT: 39,
		UP: 38
	},

	_items: [],

	ready: function() {
		this._labelChanged(this.label);
		dom(this).observeNodes(function() {
			requestAnimationFrame(function() {
				this._onMenuItemsChanged();
			}.bind(this));
		}.bind(this));
	},

	attached: function() {

		if (this.noReturnItem) {
			return;
		}

		requestIdleCallback(function() {

			this.active = this.getActiveView() === this;

			var returnItem = this.$$('d2l-menu-item-return');
			var items = this.$$('.d2l-menu-items');
			if (!this.childView && returnItem) {

				dom(items).removeChild(returnItem);
				this._onMenuItemsChanged();

			} else if (this.childView && !returnItem) {

				requestAnimationFrame(function() {
					dom(items).insertBefore(
						this._createReturnItem(),
						dom(items).childNodes[0]
					);
					this._onMenuItemsChanged();
				}.bind(this));

			}

		}.bind(this));

	},

	focus: function() {
		this._focusFirst();
	},

	_createReturnItem: function() {
		var item = document.createElement('d2l-menu-item-return');
		item.addEventListener('d2l-menu-item-select', function(e) {
			e.stopPropagation();
			this.hide();
		}.bind(this));
		dom(item).setAttribute('text', this.label);
		return item;
	},

	_focusFirst: function() {
		var item = this._tryGetNextFocusable();
		if (item) {
			item.focus();
		}
	},

	_focusLast: function() {
		var item = this._tryGetPreviousFocusable();
		if (item) {
			item.focus();
		}
	},

	_focusNext: function(item) {
		item = this._tryGetNextFocusable(item);
		item ? item.focus() : this._focusFirst();
	},

	_focusPrevious: function(item) {
		item = this._tryGetPreviousFocusable(item);
		item ? item.focus() : this._focusLast();
	},

	_getMenuItems: function() {
		var items = this.getEffectiveChildren();
		var returnItem = this._getMenuItemReturn();
		if (returnItem) {
			items.unshift(returnItem);
		}
		return items.filter(function(item) {
			var role = item.getAttribute('role');
			return (role === 'menuitem' || role === 'menuitemcheckbox' || role === 'menuitemradio');
		});
	},

	_getMenuItemReturn: function() {
		return this.$$('d2l-menu-item-return');
	},

	_isFocusable: function(item) {
		if (item.nodeType !== 1) {
			return false;
		}
		if (item.getAttribute('tabindex') !== '0' && item.getAttribute('tabindex') !== '-1') {
			return false;
		}
		if (window.getComputedStyle(item, null).getPropertyValue('display') === 'none') {
			return false;
		}
		return true;
	},

	_labelChanged: function(newValue) {
		this.setAttribute('aria-label', newValue);
		var returnItem = this.$$('d2l-menu-item-return');
		if (returnItem) {
			dom(returnItem).setAttribute('text', newValue);
		}
	},

	_onKeyDown: function(e) {

		var rootTarget = dom(e).rootTarget;
		if (this._items.indexOf(rootTarget) === -1) {
			return;
		}

		if (e.keyCode === this._keyCodes.DOWN || e.keyCode === this._keyCodes.UP) {
			// prevent scrolling when up/down arrows pressed
			e.preventDefault();
			e.stopPropagation();
			if (e.keyCode === this._keyCodes.DOWN) {
				this._focusNext(rootTarget);
			} else if (e.keyCode === this._keyCodes.UP) {
				this._focusPrevious(rootTarget);
			}
			return;
		}

		if (this.childView && e.keyCode === this._keyCodes.LEFT) {
			e.stopPropagation();
			this.hide();
			return;
		}

	},

	_onKeyPress: function(e) {

		if (this._items.indexOf(dom(e).rootTarget) === -1) {
			return;
		}

		if (e.keyCode === this._keyCodes.DOWN || e.keyCode === this._keyCodes.UP
			|| e.keyCode === this._keyCodes.SPACE || e.keyCode === this._keyCodes.ENTER
			|| e.keyCode === this._keyCodes.ESCAPE) {
			return;
		}

		e.stopPropagation();

		var startsWith = function(item, value) {
			if (item.text && item.text.length > 0 && item.text.substr(0, 1) === value) {
				return true;
			}
			return false;
		};

		var focusableItems = this._items.filter(this._isFocusable, this);
		if (!focusableItems || focusableItems.length === 0) {
			return;
		}

		var targetItemIndex = focusableItems.indexOf(dom(e).rootTarget);

		var getNextOrFirstIndex = function(itemIndex) {
			if (itemIndex === focusableItems.length - 1) {
				return 0;
			}
			return itemIndex + 1;
		}.bind(this);

		/* "charCode" is used instead of "key" due to Safari not supporting */
		var searchChar = String.fromCharCode(e.charCode);

		var itemIndex = getNextOrFirstIndex(targetItemIndex);
		while (itemIndex !== targetItemIndex) {
			var item = focusableItems[itemIndex];
			if (startsWith(item, searchChar)) {
				item.focus();
				return;
			}
			itemIndex = getNextOrFirstIndex(itemIndex);
		}

	},

	_getFirstVisibleItem: function() {
		for (var x = 0; x < this._items.length; x++) {
			if (!this._items[x].hidden) {
				return this._items[x];
			}
		}
		return null;
	},

	_getLastVisibleItem: function() {
		for (var x = this._items.length - 1; x >= 0; x--) {
			if (!this._items[x].hidden) {
				return this._items[x];
			}
		}
		return null;
	},

	_onMenuItemBlur: function(e) {
		var rootTarget = dom(e).rootTarget;
		if (rootTarget === this.$$('d2l-menu-item-return')) {
			dom(this.$$('.d2l-menu-items')).classList.remove('d2l-menu-item-return-focus');
		}
	},

	_onMenuItemFocus: function(e) {
		var rootTarget = dom(e).rootTarget;
		if (rootTarget === this.$$('d2l-menu-item-return')) {
			dom(this.$$('.d2l-menu-items')).classList.add('d2l-menu-item-return-focus');
		}
	},

	_onMenuItemMouseEnter: function(e) {
		var rootTarget = dom(e).rootTarget;
		if (rootTarget === this.$$('d2l-menu-item-return')) {
			dom(this.$$('.d2l-menu-items')).classList.add('d2l-menu-item-return-hover');
		}
	},

	_onMenuItemMouseLeave: function(e) {
		var rootTarget = dom(e).rootTarget;
		if (rootTarget === this.$$('d2l-menu-item-return')) {
			dom(this.$$('.d2l-menu-items')).classList.remove('d2l-menu-item-return-hover');
		}
	},

	_onMenuItemsChanged: function() {

		this._items = this._getMenuItems();
		if (!this._items || this._items.length === 0) {
			return;
		}

		var visibleItems = [];

		for (var i = 0; i < this._items.length; i++) {
			var item = this._items[i];
			dom(item).classList.remove('d2l-menu-item-first');
			dom(item).classList.remove('d2l-menu-item-last');
			if (!item.hidden) {
				dom(item).setAttribute('tabindex', visibleItems.length === 0 ? 0 : -1);
				visibleItems.push(item);
			}
		}

		if (visibleItems.length > 0) {
			dom(visibleItems[0]).classList.add('d2l-menu-item-first');
			dom(visibleItems[visibleItems.length - 1]).classList.add('d2l-menu-item-last');
		}

	},

	_onShowStart: function() {
		this.active = this.isActive();
	},

	_onHideComplete: function() {
		this.active = this.isActive();
	},

	_onShowComplete: function() {
		if (!this.isActive()) {
			return;
		}
		this.focus();
	},

	_onViewResize: function(e) {
		if (this.childView) {
			return;
		}
		this.fire('d2l-menu-resize', e.detail);
	},

	_tryGetPreviousFocusable: function(item) {

		var focusableItems = this._items.filter(this._isFocusable, this);
		if (!focusableItems || focusableItems.length === 0) {
			return;
		}

		if (!item) {
			return focusableItems[focusableItems.length - 1];
		}

		var itemIndex = focusableItems.indexOf(item);
		if (itemIndex === 0) {
			return;
		}

		return focusableItems[itemIndex - 1];

	},

	_tryGetNextFocusable: function(item) {

		var focusableItems = this._items.filter(this._isFocusable, this);
		if (!focusableItems || focusableItems.length === 0) {
			return;
		}

		if (!item) {
			return focusableItems[0];
		}

		var itemIndex = focusableItems.indexOf(item);
		if (itemIndex === focusableItems.length - 1) {
			return;
		}

		return focusableItems[itemIndex + 1];

	}

});
