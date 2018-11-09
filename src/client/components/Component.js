/**
 * Simple class to attach a controller to an existing DOM node
 */
class Component {
	/**
	 * @param {HTMLElement} node Top-level node of the component
	 * @param {Object} options All properties will be assigned to instance object
	 */
	constructor (node, options) {
		this.node = node;
		Object.assign(this, options);
		this.init();
	}

	init () {}
}

export { Component };
