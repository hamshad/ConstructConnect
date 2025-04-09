type ProjectLeadsType = {
  numFound: number;
  start: number;
  data: {
    projectId: number;
    projectUrl: string;
    id: number;
    title: string;
    bidDate: string;
    propertyType: string;
    documentCount: number;
    projectStatus: string;
    startDate: string;
    projectValue: number;
    buildingUsesString: string;
    addendaCount: number;
    contentType: string;
    uniqueProjectId: string;
    bidsToContactRoleGroup: string;
    contractingMethod: string;
    floorsBelowGrade: string;
    categories: string[];
    subCategories: string[];
    constructionTypes: string[];
    projectSections: string[];
    sectors: string[];
    trades: string[];
    stories: string[];
    projectValueRange: string[];
    isWatched: boolean;
    isViewed: boolean;
    isHidden: boolean;
    projectCategory: string;
    location: {
      latitude: number;
      longitude: number;
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
    };
    squareFootage: number;
    csiCodes: string[];
    companyId: number[];
    companyNameList: string[];
    tags: any[];
    lastUpdatedDate: string;
    createdProjectDate: string;
    documentAcquisitionStatus: string;
    documentAcquisitionStatusId: number;
    isShareable: boolean;
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
    ProjectCategories: {
      Id: number;
      Name: string;
      [key: string]: any;
    }[];
    BuildingUseTypes: {
      Id: number;
      Name: string;
      BuildingUseType: number;
      [key: string]: any;
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
      [key: string]: any;
    };
    IsDeletedOrCancelled: boolean;
    IsArchived: boolean;
    CanEditProject: boolean;
    IsP1Project: boolean;
    Bonds: {};
    SetAsides: {};
    DocumentAvailabilityStatus: number;
    [key: string]: any;
  }[];
  projectEvents: {
    Id: number;
    MeetingType: number;
    MeetingDate: string;
    IsMandatory: boolean;
    [key: string]: any;
  }[];
  projectStructures: {
    Id: number;
    ProjectId: number;
    BuildingUseType: number;
    ProjectType: number;
    Units: {
      [];
      SourceStructureId: number;
      SourceType: number;
      [key: string]: any;
    }[];
    projectTrades: {
      Code: number;
      Name: string;
      Trades: {
        Code: number;
        Description: string;
        IsMine: boolean;
        [key: string]: any;
      }[];
      [key: string]: any;
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
      [key: string]: any;
    }[];
    projectDocumentList: {
      id: number;
      ItemId: number;
      DocumentType: string;
      P2DocumentType: string;
      expanded: boolean;
      IsLeaf: number;
      DisplayName: string;
      Children: any[];
      IsWebViewerCompatible: boolean;
      IsAccessible: boolean;
      AccessDeniedReasonId: number;
      AllowAllPackagesAccess: boolean;
      FolderPermissionRestrictionsExist: boolean;
      [key: string]: any;
    }[];
    [key: string]: any;
  }

