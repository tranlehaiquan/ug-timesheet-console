import { ApolloClient } from 'apollo-client'
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { WebSocketLink } from 'apollo-link-ws'
import gql from 'graphql-tag'
import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import ReduxDataTypes from 'src/Store/DataTypes'
import {
  fetchMoreHandler,
  handleUpdateMessage } from '../Store/reducersSubscriptions'
import { GRAPHQL_WS_ENDPOINT } from '../config'

interface RegisterOptions {
  query: string
  subscriptionName: string
  variables?: {}
  fetchMore: boolean
  dispatch: ThunkDispatch<ReduxDataTypes.State, undefined, Action>
}

export class Subscriptions {
  wsClient?: SubscriptionClient

  apolloClient?: ApolloClient<NormalizedCacheObject>

  isConnected = false

  private authToken: string

  private ENDPOINT: string = GRAPHQL_WS_ENDPOINT

  private ongoingSubscriptions: string[]

  constructor(apiServer: string, token: string, connect = false) {
    this.authToken = token
    this.ongoingSubscriptions = []
    const server = apiServer ? apiServer.split('https://')[1] : ''
    this.ENDPOINT = server ? `wss://${server}/graphql/subscriptions` : GRAPHQL_WS_ENDPOINT
    if (connect) {
      try {
        this.initConnection()
      } catch (error) {
        // tslint:disable-next-line: no-console
        console.warn(error)
      }
    }
  }

  initConnection(reconnect = true) {
    return new Promise((resolve, reject) => {
      this.wsClient = new SubscriptionClient(this.ENDPOINT, {
        reconnect,
        connectionParams: {
          Authorization: `Bearer ${this.authToken}`
        },
        connectionCallback: err => {
          if (err) {
            // tslint:disable-next-line: no-console
            console.warn('Couldn\'t connect to WS', err)
            reject({ connectionStatus: 'Subscription connection error', error: err })
          } else {
            this.isConnected = true
            resolve({ connectionStatus: 'connected' })
          }
        }
      })
      this.apolloClient = new ApolloClient({
        link: new WebSocketLink(this.wsClient),
        cache: new InMemoryCache()
      })
      // tslint:disable-next-line: no-console
      this.wsClient.onError((...args) => console.warn('onError', args))
    })
  }

  registerSubscription(options: RegisterOptions) {
    const { subscriptionName } = options
    if (this.isConnected) {
      if (this.ongoingSubscriptions.indexOf(subscriptionName) === -1) {
        this.ongoingSubscriptions.push(subscriptionName)
        this.register(options)
      }
    } else {
      // tslint:disable-next-line: no-console
      console.error('Init connection before registering new subscription')
    }
  }

  register({ query, subscriptionName, variables, fetchMore, dispatch }: RegisterOptions) {
    this.apolloClient!
      .subscribe({
        query: gql(query),
        variables: variables || {}
      }).subscribe({
        next({ data }) {
          if (fetchMore) {
            (dispatch as ThunkDispatch<ReduxDataTypes.State, undefined, Action>)(fetchMoreHandler[subscriptionName](data))
          } else {
            (dispatch as ThunkDispatch<ReduxDataTypes.State, undefined, Action>)(handleUpdateMessage({ subscriptionName, data }))
          }
        },
        error: this.registerErrorHandler(subscriptionName)
      })
  }

  // tslint:disable-next-line: no-console
  registerErrorHandler = (name: string) => (err: Error) => console.warn(name, err)
}

export default Subscriptions
