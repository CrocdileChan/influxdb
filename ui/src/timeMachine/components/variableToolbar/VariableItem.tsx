// Libraries
import React, {PureComponent} from 'react'

// Types
import {Variable} from '@influxdata/influx'

// Styles
import 'src/timeMachine/components/fluxFunctionsToolbar/FluxFunctionsToolbar.scss'

interface Props {
  variable: Variable
}

interface State {}

class VariableItem extends PureComponent<Props, State> {
  public state: State = {isActive: false, hoverPosition: undefined}

  public render() {
    const {variable} = this.props
    return (
      <dl className="variables-toolbar--item">
        <dd className="variables-toolbar--label">{variable.name}</dd>
      </dl>
    )
  }
}

export default VariableItem
