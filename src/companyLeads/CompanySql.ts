import { spinner } from '@clack/prompts';
import type companyRawLeads from '../../data/companyRawLeads';
import { SQL } from '../utils/SQL';
import { Transactional } from '../utils/Transactions';

export class CompanySql {

  table_name = 'company_leads';

  async getAllCompanies(limit?: number) {
    console.log('start transaction');
    try {
      console.log('Getting all companies...');
      const result = await SQL.client.query(
        'SELECT * FROM company_leads LIMIT $1;',
        [limit ?? 10000]
      );
      console.log('commit transaction');
      return result.rows;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }

  async getAllCompaniesIds(): Promise<string[]> {
    try {
      console.log('Getting all companies id...');
      const result = await SQL.client.query('SELECT company_id FROM companies;');
      return result.rows;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }

  // @Transactional()
  async addCompanies(company: typeof companyRawLeads[0]) {
    console.log('[COMPANY]:', company);

    try {
      const query = `
        INSERT INTO public.company_leads (
              company_id,
              name,
              industry_value,
              project_count,
              project_value,
              phone,
              is_watched,
              is_viewed,
              latitude,
              longitude,
              city,
              country_code,
              county,
              state,
              state_code,
              zipcode,
              address_line1,
              address_line2,
              last_viewed_date,
              role_groups,
              role_types
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
              $11, $12, $13, $14, $15, $16, $17, $18, $19, $20::jsonb, $21::jsonb
            )
            RETURNING company_id;
      `;

      const values = [
        company.companyId,
        company.name,
        company.industryValue || null,
        company.projectCount || null,
        company.projectValue || null,
        company.phone || null,
        company.isWatched !== undefined ? company.isWatched : false,
        company.isViewed !== undefined ? company.isViewed : false,
        company.location.latitude || null,
        company.location.longitude || null,
        company.address.city || null,
        company.address.countryCode || null,
        company.address.county || null,
        company.address.state || null,
        company.address.stateCode || null,
        company.address.zipcode || null,
        company.address.addressLine1 || null,
        company.address.addressLine2 || null,
        company.lastViewedDate || null,
        JSON.stringify(company.roleGroup) || null,
        JSON.stringify(company.roleType) || null
      ];

      await SQL.client.query(query, values);
    } catch (error) {
      console.error(error);
      throw new Error(`Error adding company: ${error}`);
    }
  }

  @Transactional()
  async addSingleCompany(companyId: string, company: SingleCompanyType) {
    console.log('[SINGLE COMPANY]:', company);

    const s = spinner();
    s.start('Adding SINGLE company leads from file to database');

    try {
      const query = `
        UPDATE public.companies
        SET 
            updated_id = $1,
            source_company_id = $2,
            name = $3,
            website = $4,
            phone = $5,
            fax = $6,
            email = $7,
            address = $8,
            is_watched = $9,
            project_count = $10,
            last_updated_date = $11::timestamp,
            associated_contacts = $12::jsonb,
            company_portfolio = $13::jsonb,
            company_notes = $14::jsonb
        WHERE company_id = $15;
      `;

      const values = [
        company.companyInformation[0].Id,
        company.companyInformation[0].SourceCompanyId,
        company.companyInformation[0].CompanyName,
        company.companyInformation[0].Website ?? null,
        company.companyInformation[0].Phone ?? null,
        company.companyInformation[0].Fax ?? null,
        company.companyInformation[0].EmailAddress ?? null,
        company.companyInformation[0].Address,
        company.companyInformation[0].IsWatched,
        company.companyInformation[0].ProjectCount,
        company.companyInformation[0].LastUpdatedDate,
        JSON.stringify(company.associatedContacts),
        JSON.stringify(company.companyPortfolio),
        JSON.stringify(company.companyNotes),
        companyId
      ];

      console.log('VALUES:', values);

      await SQL.client.query(query, values);
      s.stop('Single Companies from file added to database');
    } catch (error) {
      s.stop('Error adding single company' + error);
      throw new Error(`Error adding single company: ${error}`);
    }
  }

  async addSingleCompanyDirectly(companyFromList: typeof companyRawLeads[0], singleCompany: SingleCompanyType): Promise<void> {


    const query = `
      INSERT INTO public.companies(
        company_id, name, industry_value, project_count, project_value, 
        phone, email, role_group, role_type, is_watched, is_viewed, 
        last_viewed_date, location, address, website, fax, 
        source_company_id, last_updated_date, associated_contacts, 
        company_portfolio, company_notes, updated_id
      )
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 
             $14, $15, $16, $17, $18::timestamp, 
             $19::jsonb,
             $20::jsonb,
             $21::jsonb,
             $22)
      RETURNING id`;

    // Values array that matches the parameters in order
    /**
     * NOTE: if we are parsing a json array into postgresql
     *       we should create a column of type jsonb (not jsonb[])
     *       and we need to use the ::jsonb to cast the value
     *       with stringified json array in values.
     */
    const values = [
      companyFromList.companyId,
      singleCompany.companyInformation[0].CompanyName,
      companyFromList.industryValue ?? null,
      companyFromList.projectCount,
      companyFromList.projectValue,
      singleCompany.companyInformation[0].Phone ?? null,
      singleCompany.companyInformation[0].EmailAddress ?? null,
      companyFromList.roleGroup,
      companyFromList.roleType,
      singleCompany.companyInformation[0].IsWatched,
      companyFromList.isViewed,
      companyFromList.lastViewedDate,
      companyFromList.location,
      singleCompany.companyInformation[0].Address,
      singleCompany.companyInformation[0].Website ?? null,
      singleCompany.companyInformation[0].Fax ?? null,
      singleCompany.companyInformation[0].SourceCompanyId,
      singleCompany.companyInformation[0].LastUpdatedDate,
      JSON.stringify(singleCompany.associatedContacts),
      JSON.stringify(singleCompany.companyPortfolio),
      JSON.stringify(singleCompany.companyNotes),
      singleCompany.companyInformation[0].Id
    ];

    console.log(values);

    try {
      const result = await SQL.client.query(query, values);
      console.log('Company inserted with ID:', result.rows[0].id);
    } catch (error) {
      console.error('Error inserting company:', error);
    }
  }
}
