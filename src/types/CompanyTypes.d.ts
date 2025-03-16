type SingleCompanyType = {
  companyInformation: {
    Id: number;
    SourceCompanyId: number;
    CompanyName: string;
    Website?: string;
    LastUpdatedDate: string;
    Phone?: number;
    Fax?: number;
    EmailAddress?: string;
    Address: {
      Id: number;
      AddressLine1?: string;
      City: string;
      State: string;
      ZipCode: number;
      IsVerified: boolean;
      CountryCode?: string;
      CountryID?: number;
      IsCommercial?: boolean;
    };
    IsWatched: boolean;
    ProjectCount: number;
  }[];
  associatedContacts: {
    Id: number;
    AccountId: number;
    FirstName: string;
    LastName: string;
    FullName: string;
    Email: string;
    OfficePhone: number;
    MobilePhone: number;
    Fax: number;
    LinkedinUrl: string;
    SourceContactId: number;
    Status: number;
  }[];
  companyPortfolio: {
    Year: number;
    ProjectCount: number;
    AverageProjectBudget: number;
    BuildingUses: any[];
  }[];
  companyNotes: {
    Id: number;
    OwnerAccountId: number;
    AccountId: number;
    AccountNoteType: number;
    Note: string;
    CreateDate: string;
    NoteCreatedBy: string;
    UserProfileId: number;
    IsReminderSet: boolean;
    CommunicationType: number;
  }[];
};
