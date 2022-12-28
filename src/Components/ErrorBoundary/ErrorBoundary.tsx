/* eslint-disable  @typescript-eslint/no-explicit-any */
import React from 'react'
import { Button } from '../../temp/components/buttons/button/Button'
import getUserInfo from '../../common/utils/getUserInfo'
import { dataService } from '../../Services/DataServices'

export default class ErrorBoundary extends React.Component<
  any,
  { error: any, errorInfo: any, sentError: boolean }
> {
  constructor(props: any) {
    super(props)
    this.state = { error: null, errorInfo: null, sentError: false }

    this.sendErrorLog = this.sendErrorLog.bind(this)
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({
      error,
      errorInfo
    })
  }

  async sendErrorLog() {
    this.setState({
      sentError: true
    })

    const error = {
      Name: this.state.error.toString(),
      Error: this.state.error.toString(),
      ErrorInfo: JSON.stringify(this.state.errorInfo.componentStack),
      Path: window.location.pathname,
      UserInfo: JSON.stringify(getUserInfo())
    }
    await dataService.createLogError(error)
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <div className="sk-p-4">
          <div>
            <h2>Something went wrong.</h2>
            <details style={ { whiteSpace: 'pre-wrap' } }>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
            </details>
            {!this.state.sentError && (
              <Button
                buttonType="primary"
                type="button"
                onClick={ this.sendErrorLog }
              >
                Send Error!
              </Button>
            )}
            {this.state.sentError && <p>Thank you, error sent!</p>}
          </div>
        </div>
      )
    }
    // Normally, just render children
    return this.props.children
  }
}
