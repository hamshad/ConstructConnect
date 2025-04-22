type ProjectLeadsType = {
  numFound: number;
  start: number;
  data: {
    projectId: number;
    projectUrl: string;
    projectDescription: string;
    propertyType: string;
    documentCount: number;
    addendaCount: number;
    lastAddendaDate: string;
    hasNewAddenda: boolean;
    bidsToContactRoleGroup: string;
    contractingMethod: string;
    floorsBelowGrade: string;
    categories: string[];
    subCategories: string[];
    certifications: string[];
    constructionTypes: string[];
    projectSections: string[];
    trades: string[];
    projectValueRange: string[];
    isWatched: boolean;
    isHidden: boolean;
    projectCategory: string;
    location: {
      latitude: number;
      longitude: number;
      [key: string]: any;
    };
    address: {
      city: string;
      countryCode: string;
      county: string;
      state: string;
      stateCode: string;
      zipcode: number;
      stateAbbr: string;
      addressLine1: string;
      region: string;
      [key: string]: any;
    };
    squareFootage: number;
    csiCodes: string[];
    companyId: number[];
    companyNameList: string[];
    lastUpdatedDate: string;
    createdProjectDate: string;
    isShareable: boolean;
    id: number;
    title: string;
    bidDate: string;
    startDate: string;
    projectStatus: string;
    projectValue: number;
    buildingUsesString: string;
    contentType: string;
    uniqueProjectId: string;
    sectors: string[];
    isViewed: boolean;
    documentAcquisitionStatus: string;
    documentAcquisitionStatusId: number;
    [key: string]: any;
  }[];
  facets: {
    bidsToContactRolegroup: {
      key: string;
      value: number;
    }[];
    buildingUseName: {
      key: string;
      value: number;
    }[];
    projectTypeName: {
      key: string;
      value: number;
    }[];
  };
}

type CuratedProjectType = {
  projectDetails: {
    Id: number;
    EstimatedValue: number;
    Title: string;
    CreateDate: string;
    ProjectUpdateDate: string;
    Name: string;
    PackageId: number;
    Description: string;
    Stories: number;
    Status: number;
    Stage: number;
    UCMSStage: number;
    ConstructionType: number;
    ProjectType: number;
    SectorType: number;
    Sector: string;
    ContractingMethodType: number;
    ContractingMethod: string;
    ProjectCategories: {
      Id: number;
      Name: string;
    }[];
    BuildingUseTypes: {
      Id: number;
      Name: string;
      BuildingUseType: number;
    }[];
    CrimsonProjectStatus: string;
    ProjectTypes: string[];
    ProjectCategory: string;
    BuildingUses: string[];
    Phase: number;
    BuildingType: number;
    OwnerName: string;
    OwnerId: number;
    Location: {
      StreetAddress: string;
      City: string;
      State: string;
      Country: string;
      PostalCode: number;
      Latitude: number;
      Longitude: number;
      CountyName: string;
    };
    IsDeletedOrCancelled: boolean;
    IsArchived: boolean;
    CanEditProject: boolean;
    IsP1Project: boolean;
    Bonds: {
      Bid: string;
      Perf: string;
      Pay: string;
    };
    SetAsides: { [key: string]: any; };
    SolicitationNumber: string;
    DocumentAvailabilityStatus: number;
    BidDateDescription: string;
    PlansFrom: string;
    UnionLabor: string;
    CrimsonId: number;
  }[];
  projectEvents: {
    Id: number;
    MeetingType: number;
    UserEnteredTimeZone: string;
    MeetingDate: string;
    IsMandatory: boolean;
    MeetingNotes: string;
  }[];
  projectStructures: {
    Id: number;
    ProjectId: number;
    BuildingUseType: number;
    ProjectType: number;
    Units: { [key: string]: any; }[];
    SourceStructureId: number;
    SourceType: number;
  }[];
  projectTrades: {
    Code: number;
    Name: string;
    Trades: {
      Code: number;
      Description: string;
      IsMine: boolean;
    }[];
  }[];
  projectDesignTeam: {
    Id: number;
    UserProfileId: number;
    FirstName: string;
    LastName: string;
    FullName: string;
    Title: string;
    Phone: number;
    Ext: string;
    Fax: number;
    Mobile: string;
    AddressLine1: string;
    AddressLine2: string;
    City: string;
    State: string;
    ZipCode: number;
    Email: string;
    Website: string;
    Function: string;
    JobFunctionGroup: number;
    CompanyName: string;
    Department: string;
    CompanyID: number;
    LoggedInTimes: number;
    OpenShop: boolean;
    Bondable: boolean;
    IsNetworkSub: boolean;
    DateAdded: string;
    UserType: number;
    UserStatus: number;
    Status: number;
    BidAmount: string;
    LastUpdatedUtcDate: string;
    Roles: string[];
    IsPrivate: boolean;
    FunctionId: number;
    SequenceId: number;
    PotentialBidder: boolean;
    IsCompanyOptedOutFromSOR: boolean;
    JobFunctions: any[];
    IsDeleted: boolean;
    IsTracked: boolean;
  }[];
  projectDocumentList: {
    id: number;
    ItemId: number;
    DocumentType: string;
    P2DocumentType: string;
    expanded: boolean;
    IsLeaf: number;
    DisplayName: string;
    Children: {
      id: number;
      ItemId: number;
      DocumentType: string;
      P2DocumentType: string;
      expanded: boolean;
      IsLeaf: number;
      DisplayName: string;
      DateUploaded: string;
      Size: number;
      Children: any[];
      IsWebViewerCompatible: boolean;
      IsAccessible: boolean;
      AccessDeniedReasonId: number;
      AllowAllPackagesAccess: boolean;
    }[];
    IsWebViewerCompatible: boolean;
    IsAccessible: boolean;
    AccessDeniedReasonId: number;
    AllowAllPackagesAccess: boolean;
    FolderPermissionRestrictionsExist: boolean;
  }[];
}


type ProjectCompanyType = {
  id: number;
  project_id: number;
  company_id: number;
  company_name: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}
