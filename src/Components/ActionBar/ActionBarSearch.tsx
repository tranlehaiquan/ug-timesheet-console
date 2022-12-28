import React from 'react'
import { debounce as _debounce } from 'lodash'

import { ActionBarSearchItem } from 'skedulo-ui'

interface Props {
  onSearch: (searchPhrase: string) => void
  onClear: () => void
}

const ActionBarSearch: React.FunctionComponent<Props> = props => {
  const onSearch = _debounce((searchPhrase: string) => {
    if (searchPhrase.length === 0) {
      props.onClear()
    } else {
      props.onSearch(searchPhrase)
    }
  }, 200)

  return (
    <ActionBarSearchItem
      onChange={ (event: React.ChangeEvent<HTMLInputElement>) => onSearch(event.target.value) }
      onClear={ props.onClear }
    />
  )
}

export default ActionBarSearch
