import { spinner } from '@clack/prompts';
import type companyRawLeads from '../../data/companyRawLeads';
import { SQL } from '../utils/SQL';
import { Transactional } from '../utils/Transactions';

export class CompanySql {

  @Transactional()
  async getAllCompanies(limit?: number) {
    console.log('start transaction');
    try {
      console.log('Getting all companies...');
      const result = await SQL.client.query(
        'SELECT * FROM companies LIMIT $1;',
        [limit ?? 10000]
      );
      console.log('commit transaction');
      return result.rows;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }

  @Transactional()
  async addCompanies(company: typeof companyRawLeads[0]) {
    console.log('[COMPANY]:', company);

    try {
      const query = `
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
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (id) DO NOTHING;
      `;

      const values = [
        company.companyId,
        company.name,
        company.industryValue ?? null,
        company.projectCount ?? null,
        company.projectValue ?? null,
        company.phone ?? null,
        company.email ?? null,
        company.roleGroup ?? null,
        company.roleType ?? null,
        company.isWatched ?? null,
        company.isViewed ?? null,
        company.lastViewedDate ?? null,
        company.location,
        company.address
      ];

      const insertResult = await SQL.client.query(query, values);
      console.log('INSERT RESULT', insertResult);
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
            associated_contacts = $12,
            company_portfolio = $13,
            company_notes = $14
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
        company.associatedContacts,
        company.companyPortfolio,
        company.companyNotes.length === 0 ? company.companyNotes : null,
        companyId
      ];

      const insertResult = await SQL.client.query(query, values);
      s.stop('Single Companies from file added to database');
      console.log('INSERT RESULT', insertResult);
    } catch (error) {
      s.stop('Error adding single company' + error);
      throw new Error(`Error adding single company: ${error}`);
    }
  }
}
