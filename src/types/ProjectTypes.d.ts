type ProjectLeadsType = {
  numFound: number;
  start: number;
  data: typeof projectLeads[0] & {
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
