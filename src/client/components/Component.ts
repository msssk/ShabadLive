/**
 * Simple class to attach a controller to an existing DOM node
 */
class Component {
	node: HTMLElement;

	/**
	 * @param node Top-level node of the component
	 * @param options All properties will be assigned to instance object
	 */
	constructor (node: HTMLElement, options?: Record<string, any>) {
		this.node = node;
		Object.assign(this, options);
		this.init();
	}

	init () {}
}

export { Component };
