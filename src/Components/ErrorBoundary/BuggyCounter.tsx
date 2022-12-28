/* eslint-disable  @typescript-eslint/no-explicit-any */
import React from 'react'

export default class BuggyCounter extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = { counter: 0 }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    this.setState(({ counter }: any) => ({
      counter: counter + 1
    }))
  }

  render() {
    if (this.state.counter === 5) {
      // Simulate a JS error
      return (
        <h1>{this.state.aa.a} 123</h1>
      )
    }
    return <h1 onClick={ this.handleClick }>{this.state.counter}</h1>
  }
}
