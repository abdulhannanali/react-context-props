// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'

export const getContextualizer = (propTypes: Object, targetProp: string) => {
  class ContextProps extends Component {
    getChildContext () {
      const props = Object.keys(this.props).reduce((x, key) => {
        if (key !== 'children') {
          x[key] = this.props[key]
        }

        return x
      }, {})

      return targetProp ? { [targetProp]: props } : props
    }

    render () {
      return <span>{this.props.children}</span>
    }
  }

  ContextProps.displayName = 'ContextProps'

  ContextProps.childContextTypes = targetProp
    ? { [targetProp]: PropTypes.shape(propTypes) }
    : propTypes
  return ContextProps
}

export const withPropsFromContext = (propList : Array<string>) => Target => {
  class WithPropsFromContext extends Component {
    props:Object;
    render () {
      const contextProps = propList.reduce((prev, cur) => (prev[cur] = this.context[cur]), {})
      return <Target {...this.props} {...contextProps} />
    }
  }

  WithPropsFromContext.contextTypes = propList.reduce((x, prop) => {
    x[prop] = PropTypes.any
    return x
  }, {})

  WithPropsFromContext.displayName = (
    `${WithPropsFromContext.name}(${Target.name || Target.displayName})`
  )

  return WithPropsFromContext
}
