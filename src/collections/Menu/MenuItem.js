import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import META from '../../utils/Meta'

export default class MenuItem extends Component {
  static propTypes = {
    activeItem: PropTypes.string,
    callbackParent: PropTypes.func,
    children: PropTypes.node,
    className: PropTypes.string,
    label: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    name: PropTypes.string,
    onClick: PropTypes.func,
  }

  handleClick = e => {
    if (this.props.onClick) {
      this.props.onClick(this.props.name)
    }
    this.props.callbackParent(this.props.name)
  }

  static _meta = {
    library: META.library.semanticUI,
    name: 'MenuItem',
    type: META.type.collection,
    parent: 'Menu',
  }

  render() {
    const menuLabel = <div className='sd-menu-label ui blue label'>{this.props.label}</div>
    const isActive = this.props.activeItem === this.props.name
    const classes = classNames(
      'sd-menu-item',
      this.props.className,
      'item',
      { active: isActive }
    )
    return (
      <a {...this.props} className={classes} onClick={this.handleClick}>
        {this.props.name}
        {this.props.label && menuLabel}
        {this.props.children}
      </a>
    )
  }
}