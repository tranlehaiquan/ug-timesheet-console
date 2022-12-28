/* eslint-disable @typescript-eslint/no-explicit-any */
export type TimesheetStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected'
export type DistanceUnit = 'KM' | 'MI'
export type EntryTypes = 'Job' | 'Shift' | 'Activity' | 'Unavailability' | 'Manual'
export type DefinedEntryTypes = Exclude<EntryTypes, 'Manual'>
export type UID = string
export type TimeRange = {
  startDate: string
  endDate: string
}

export type Avatars = {
  [key: string]: string
}

export namespace ReduxDataTypes {
  export type State = {
    avatars?: Avatars
    busy: boolean
    busyCnt: string[]
    subscriptionStatus?: string
    resources?: Resource[]
    timesheet?: Timesheet[]
    timesheetEntry?: TimesheetEntry
    filters: Filter[]
    newEntryJob?: Job[]
    newEntryShift?: Shift[]
    newEntryActivity?: Activity[]
    newEntryUnavailability?: Availability[]

    [key: string]: any
    timesheetTableItems?: TimesheetTableItem[]
    displayedTimesheetTableItems?: TimesheetTableItem[]
    timesheetData?: TimesheetData[]

    timeRange: TimeRange

    settings: Settings
    currentUser?: User

    summary?: {
      jobs: number
      distance: number
      logged: number
      unavailability: number
    }

    vendor?: VendorType
  }

  export interface Resource {
    UID: string
    Name: string
    ResourceTags: ResourceTag[]
    ResourceRegions: ResourceRegion[]
    PrimaryRegion: Region
    User: {
      UID: UID
      SmallPhotoUrl: string
      FullPhotoUrl: string
    }
    Email: string
    ResourceType: string
    Category: string
    Alias: string
  }

  export interface Filter {
    selector: string
    name: string
    description: string
    value: string[]
    options: string[]
    filterValues?: string[]
  }

  export interface ResourceTag {
    Tag: Tag
  }

  export interface Tag {
    UID: string
    Name: string
  }

  export interface ResourceRegion {
    Region: Region
  }

  export interface Region {
    UID: string
    Name: string
  }

  export interface TimesheetTableRecord {
    id?: number
    Name?: string
    Position?: string
    Avatar?: string
    Scheduled?: number
    Activity?: number
    Unavailability?: number
    TotalLogged?: number
    Availability?: number
    Distance?: number
    Status?: TimesheetStatus
    Action?: string
  }

  export interface Job {
    Name: string
    UID: string
    Start: string
    End: string
    Duration: string
    Description: string
    TravelDistance?: number
    Type: string
    JobStatus: string
    Timezone: string
    ContactId: string
    Contact: {
      FullName: string
      Email: string
    }
    Account: {
      Name: string
    }
    JobAllocations: JobAllocation[]
    LunchBreakDuration?: number
    Premiums?: string[]
    JobAllocationId?: string
  }

  export interface JobAllocation {
    UID: UID
    Start: string
    End: string
    Resource: {
      UID: UID
      Name: string
    }
    Job: Job
    LunchBreakDuration: number
    Premiums: string[]
    ResourceId: string
    TimesheetDuration: number
    TimeStartTravel: string
    TimeCheckedIn: string
    TimeInProgress: string
    TimeCompleted: string
  }

  export interface Shift {
    DisplayName: string
    UID: string
    Start: string
    End: string
    Duration: string
    Name: string
    Location: {
      Name: string
    }
    isFinished?: boolean
    Breaks?: Break[]
  }

  export interface Activity {
    Name: string
    UID: string
    Start: string
    End: string
    Type: string
    Timezone: string
  }

  export interface Availability {
    UID: string
    Start: string
    Finish: string
    Name: string
    Type: string
  }

  export interface Break {
    Start: string
    End: string
    UID: UID
  }

  export type TimesheetEntryRelation = Job | Shift | Activity | Availability

  export interface TimesheetTableItem extends Timesheet {
    Scheduled?: number
    Job?: number
    Shift?: number
    Activity?: number
    Unavailability?: number
    Manual?: number
    Logged?: number
    Availability?: number
    Distance?: number
    DistanceUnit?: DistanceUnit
    TimesheetEntries?: TimesheetEntry[]
  }

  export interface Settings {
    distanceUnit: DistanceUnit
    defaultTimezone?: string
    showErrorMessage?: boolean
  }

  export type DistanceUnit = 'KM' | 'MI'

  export interface User {
    id: string
  }

  export interface Timesheet {
    ApprovedBy: {
      Name: string
    }
    ApprovedById: UID
    ApprovedDate: string
    ApproverComments: string
    EndDate: string
    Resource: Resource
    ResourceId: UID
    StartDate: string
    Status: TimesheetStatus
    SubmitterComments: string
    UID: UID
    Entries: TimesheetEntry[]
  }

  export interface TimesheetSummaryFields {
    Logged?: number | null
    Job?: number | null
    Shift?: number | null
    Unavailability?: number | null
    Activity?: number | null
    Manual?: number | null
    Distance?: number | null
    DistanceUnit?: DistanceUnit
    JobAllocationIds?: string[]
  }

  export type TimesheetData = {
    [key: string]: any
  } & Timesheet & TimesheetSummaryFields

  export interface TimesheetEntry {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
    Activity: Activity
    ActivityId: UID
    Description: string
    Distance: number
    DistanceUnit: DistanceUnit
    Duration?: number
    EndDate: string
    EndTime: string
    EntryType: EntryTypes
    Job: Job
    JobId: UID
    Shift: Shift
    ShiftId: UID
    StartDate: string
    StartTime: string
    TimesheetId: UID
    UID: UID
    Timesheet: Timesheet
    UnavailabilityId: UID
    Unavailability: Availability
    ActualDuration?: number
    LunchBreakDuration?: number
    Premiums?: string
    ContactId?: string
    Timezone: string | null
    IsNew: boolean
  }

  export enum VendorType {
    SKEDULO = 'skedulo',
    SALESFORCE = 'salesforce'
  }

  export interface Account {
    UID: string
    Name: string
  }
}

export default ReduxDataTypes
