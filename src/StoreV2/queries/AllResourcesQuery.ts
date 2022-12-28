export const AllResourcesQuery = `
query getResources($orderBy: EQLOrderByClauseResources, $first: PositiveIntMax200, $offset:  NonNegativeInt) {
  resources (filter: "IsActive == true", orderBy: $orderBy, first: $first, offset: $offset) {
    pageInfo {
      hasNextPage
    }
    totalCount
    edges {
      node {
        UID
        Name
        WorkingHourType
        Category
        ResourceTags {
          Tag {
            UID
            Name
          }
        }
        ResourceRegions {
          Region {
            UID
            Name
          }
        }
        PrimaryRegion {
          Name
          UID
        }
        User {
          UID
          SmallPhotoUrl
          FullPhotoUrl
        }
      }
    }
  }
}
`

export default AllResourcesQuery
