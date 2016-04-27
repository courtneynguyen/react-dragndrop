export default class DropTarget{
	constructor(id, x, y, width, height){
		this.id = id;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.baseStyle = '';
		this.hoverStyle = '';
		this.draggableHoveringOverDropTargetStyle = '';
		this.wrapperElement = '';
		this.title = '';
	}

	getCurrentPosition(){
		return {x: this.x, y: this.y};
	}
	getDimensions(){
		return {width: this.width, height: this.height};
	}
	getId(){
		return this.id;
	}
	setBaseStyle(style){
		this.baseStyle = style;
	}
	getBaseStyle(){
		return this.baseStyle;
	}
}
