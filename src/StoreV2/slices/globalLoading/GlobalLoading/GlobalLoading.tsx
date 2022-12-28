import * as React from 'react'
import { useGlobalLoading } from '../hooks'
import LoadingIndicator from '../LoadingIndicator'

const GlobalLoading: React.FC = () => {
  const { isLoading } = useGlobalLoading()
  return <>{isLoading && <LoadingIndicator />}</>
}

export default React.memo(GlobalLoading)
