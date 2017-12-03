import React, { Component } from 'react';
import ReactDom from 'react-dom';
import DragDropManager from '../DragDropManager';

export default class Draggable extends Component {
  constructor() {
    super();
    this.baseStyle = {};

    this.hoveringStyle = {};
    this.domDraggableElement;
    this.html = document.getElementsByTagName('html')[0];
    this.html.addEventListener('mousemove', this.setMousePosition.bind(this), false);

    this.currentPosition = { x: 0, y: 0 };
    this.clicked = false;
    this.dragging = false;
    this.dropped = false;

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.setInitialDimensions = this.setInitialDimensions.bind(this);
    this.setStyle = this.setStyle.bind(this);
    this.setClassName = this.setClassName.bind(this);

    this.dimensions = {
      x: 0,
      y: 0,
      width: 100,
      height: 100
    };

    this.isOverTarget = false;
    this.hoveredDropTarget = null;

    this.setState = this.setState;
  }

  setInitialDimensions(ref) {
    if (ref !== null) {
      this.domDraggableElement = ReactDom.findDOMNode(ref);
      this.dimensions = {
        x: this.domDraggableElement.offsetLeft,
        y: this.domDraggableElement.offsetTop,
        width: this.domDraggableElement.offsetWidth,
        height: this.domDraggableElement.offsetHeight
      };
    }
  }

  componentDidMount() {
    this.props.manager.registerDraggable(this);
    this.id = this.props.id;
  }

  render() {
    var styleOutput = this.setStyle();
    var classOutput = this.setClassName();
    return (
      <div ref={this.setInitialDimensions}
        style={styleOutput}
        className={classOutput}
        key={this.props.id}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}>
        {this.props.children}
      </div>
    );
  }

  setStyle(theStyle) {
    var childStyle = '';
    var styleOutput = '';
    var clickedStyle = '';
    var draggingStyle = '';
    var baseStyle = this.state ? this.state.baseStyle : '';

    if (theStyle) {
      styleOutput = theStyle;
    }
    else {
      if (this.dragging && this.props.draggingStyle) {
        draggingStyle = this.props.draggingStyle;
      }
      if (this.clicked && this.props.clickedStyle) {
        clickedStyle = this.props.clickedStyle;
      }
      if (this.props.style) {
        styleOutput = Object.assign({}, draggingStyle, clickedStyle, baseStyle, this.props.style)
      }
      else {
        styleOutput = Object.assign({}, draggingStyle, clickedStyle, baseStyle)
      }
    }
    return styleOutput;
  }

  setClassName() {
    var className = '';
    if (this.clicked && this.props.baseClassName) {
      className = this.props.baseClassName;
    }
    if (this.clicked && this.props.clickedClassName) {
      className = this.props.clickedClassName;
    }
    else if (this.dragging && this.props.draggingClassName) {
      className = this.props.draggingClassName;
    }
    else if (this.dropped && this.props.droppedClassName) {
      className = this.props.droppedClassName;
    }
    return className;
  }

  setMousePosition(ev) {
    this.localNextPosition.x = (ev.clientX);
    this.localNextPosition.y = (ev.clientY);

    if (this.clicked) {
      this.dragging = true;
      this.localNextPosition.x -= (this.dimensions.width / 2);
      this.localNextPosition.y = (this.localNextPosition.y + window.scrollY) - (this.dimensions.height / 2);

      if (this.props.manager) {
        var draggableisOverDropTarget = this.props.manager.draggableIsOverDropTarget(this, ev);
        if (draggableisOverDropTarget) {
          this.isOverTarget = true;
          this.hoveredDropTarget = this.props.manager.hoveredDropTarget;
          this.hoveredDropTarget.draggableHoveringOverDropTarget();
        }
        else {
          this.isOverTarget = false;
        }
      }
      var dimensions = Object.assign({}, this.dimensions, {
        x: this.localNextPosition.x,
        y: this.localNextPosition.y
      });
      this.dimensions = dimensions;
      var styling = {
        left: dimensions.x,
        top: dimensions.y,
        position: 'absolute'
      };
      var newHoveringStyle = Object.assign({}, this.hoveringStyle, styling);

      this.setState({
        baseStyle: newHoveringStyle
      });
    }
  }

  handleMouseDown(ev) {
    this.clicked = true;
    this.setState({
      clicked: true
    });
    if (this.props.handleMouseDown) {
      this.props.handleMouseDown(ev);
    }
  }

  handleMouseUp(ev) {
    this.clicked = false;
    this.dragging = false;
    this.html.removeEventListener('mousemove', this.setMousePosition.bind(this), false);
    this.setState({
      clicked: false,
      dragging: false,
      baseStyle: {}
    });
    if (this.props.handleMouseUp) {
      this.props.handleMouseUp(ev);
    }
    if (this.props.manager) {
      this.props.manager.releaseDraggableOnDropTarget(this);
    }
  }
}

Draggable.prototype.localNextPosition = { x: 0, y: 0 };
Draggable.propTypes = {
  id: React.PropTypes.string,
  manager: React.PropTypes.instanceOf(DragDropManager).isRequired,
  droppedStyle: React.PropTypes.object,
  draggingStyle: React.PropTypes.object,
  clickedStyle: React.PropTypes.object,
  style: React.PropTypes.object,
  baseClassName: React.PropTypes.string,
  clickedClassName: React.PropTypes.string,
  draggingClassName: React.PropTypes.string,
  droppedClassName: React.PropTypes.string,
  handleMouseUp: React.PropTypes.func,
  handleMouseDown: React.PropTypes.func,
  handleDrop: React.PropTypes.func
};
