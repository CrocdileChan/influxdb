// Libraries
import {PureComponent} from 'react'
import _ from 'lodash'

// APIs
import {client} from 'src/utils/api'

// Types
import {RemoteDataState} from 'src/types'
import {Variable} from '@influxdata/influx'

interface Props {
  children: (variables: Variable[], loading: RemoteDataState) => JSX.Element
}

interface State {
  variables: Variable[]
  loading: RemoteDataState
}

class FetchVariables extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      variables: [],
      loading: RemoteDataState.NotStarted,
    }
  }

  public async componentDidMount() {
    this.fetchVariables()
  }

  public render() {
    const {variables, loading} = this.state
  
    return this.props.children(variables, loading)
  }

  public fetchVariables = async () => {
    const variables = await client.variables.getAll()
    this.setState({
      variables,
      loading: RemoteDataState.Done,
    })
  }
}

export default FetchVariables
