import * as React from 'react'
// import { useSelector } from 'react-redux'
// import { Avatar } from 'skedulo-ui'
import ReduxDataTypes from '../../../Store/DataTypes'

export const ResourceCell: React.FC<{
  resource: ReduxDataTypes.Resource
}> = ({ resource }) => {
  const { Name = '', Category = '' } = resource || {}

  // const avatars = useSelector((store: ReduxDataTypes.State) => store.avatars)
  // let avatar = 'https://www.gravatar.com/avatar/2f8e75901e671371deaae5466c509291?d=mm&s=45'

  // if (User && avatars && avatars[User.UID]) {
  //   avatar = avatars[User.UID]
  // }
  return (
    <div className="sk-flex sk-flex-row sk-items-center">
      {/* <Avatar name={ Name } imageUrl={ avatar } className="sk-mr-4" /> */}
      <div>
        <p className="sk-my-1">{ Name }</p>
        <p className="sk-text-grey sk-my-1">{ Category }</p>
      </div>
    </div>
  )
}
