import type companyRawLeads from '../../data/companyRawLeads';
import { SQL } from '../../SQL';

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
}
