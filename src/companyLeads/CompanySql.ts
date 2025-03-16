import type companyRawLeads from '../../data/companyRawLeads';
import { SQL } from '../utils/SQL';

export class CompanySql {
  sql = SQL.sql;

  async getAllCompanies() {
    try {
      const result = await SQL.sql`
        SELECT * FROM companies
      `;

      return result;

    } catch (error) {
      console.error(error);
      throw new Error(`Error getting companies: ${error}`);
    }
  }

  async addCompanies(company: typeof companyRawLeads[0]) {
    console.log('[COMPANY]:', company);

    try {
      const insertResult = await SQL.sql`
        INSERT INTO companies (
          company_id,
          name,
          industry_value,
          project_count,
          project_value,
          phone,
          email,
          role_group,
          role_type,
          is_watched,
          is_viewed,
          last_viewed_date,
          location,
          address
        ) VALUES (
          ${company.companyId},
          ${company.name},
          ${company.industryValue ?? null},
          ${company.projectCount ?? null},
          ${company.projectValue ?? null},
          ${company.phone ?? null},
          ${company.email ?? null},
          ${company.roleGroup ?? null},
          ${company.roleType ?? null},
          ${company.isWatched ?? null},
          ${company.isViewed ?? null},
          ${company.lastViewedDate ?? null},
          ${company.location},
          ${company.address}
        )
        ON CONFLICT (id) DO NOTHING
      `;

      console.log('INSERT RESULT', insertResult);

    } catch (error) {
      console.error(error);
      throw new Error(`Error adding company: ${error}`);
    }
  }

  async addSingleCompany(companyId: string, company: SingleCompanyType) {
    console.log('[SINGLE COMPANY]:', company);

    try {
      const insertResult = await SQL.sql`
        UPDATE public.companies
        SET 
            updated_id = ${company.companyInformation[0].Id},
            source_company_id = ${company.companyInformation[0].SourceCompanyId},
            name = ${company.companyInformation[0].CompanyName},
            website = ${company.companyInformation[0].Website},
            phone = ${company.companyInformation[0].Phone},
            fax = ${company.companyInformation[0].Fax},
            email = ${company.companyInformation[0].EmailAddress},
            address = ${company.companyInformation[0].Address},
            is_watched = ${company.companyInformation[0].IsWatched},
            project_count = ${company.companyInformation[0].ProjectCount},
            last_updated_date = ${company.companyInformation[0].LastUpdatedDate}::timestamp,
            associated_contacts = ${company.associatedContacts},
            company_portfolio = ${company.companyPortfolio},
            company_notes = ${company.companyNotes}
        WHERE company_id = ${companyId};
    `;

      console.log('INSERT RESULT', insertResult);

    } catch (error) {
      console.error(error);
      throw new Error(`Error adding single company: ${error} `);
    }
  }
}
