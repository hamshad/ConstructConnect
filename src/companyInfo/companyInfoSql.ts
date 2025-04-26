import { SQL } from '../utils/SQL';
import type { TableSql } from '../utils/TableSql';

export class CompanyInfoSql implements TableSql<SingleCompanyType> {

  title = 'Company Info';
  table_name = 'company_details';

  async getLength() {
    const result = await SQL.client.query(`SELECT COUNT(*) FROM ${this.table_name};`,);
    console.log('Project length:', result.rows[0].count);
    return result.rows[0].count;
  }

  async getAll(limit?: number) {
    console.log('start transaction');
    try {
      console.log('Getting all companies...');
      const result = await SQL.client.query(
        'SELECT * FROM company_leads LIMIT $1;',
        [limit ?? 10000]
      );
      console.log('commit transaction');
      return result.rows[0].count;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }

  async getAllIds(limit?: number, offset?: number): Promise<string[]> {
    try {
      console.log('Getting all companies id...');
      const result = await SQL.client.query('SELECT company_id FROM company_leads LIMIT $1 OFFSET $2;', [limit ?? 10000, offset ?? 0]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }

  async insert(data: SingleCompanyType): Promise<void> {

    try {
      // Use the first company information record
      const companyInfo = data.companyInformation[0];

      const query = `
      INSERT INTO public.company_details (
        id,
        company_id,
        source_company_id,
        website,
        fax,
        email_address,
        contacts,
        portfolio,
        notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO NOTHING
      RETURNING *;
    `;

      const values = [
        companyInfo.Id,
        companyInfo.SourceCompanyId.toString(),
        companyInfo.SourceCompanyId.toString(),
        companyInfo.Website || null,
        companyInfo.Fax ? companyInfo.Fax.toString() : null,
        companyInfo.EmailAddress || null,
        JSON.stringify(data.associatedContacts || []),
        JSON.stringify(data.companyPortfolio || []),
        JSON.stringify(data.companyNotes || [])
      ];

      const result = await SQL.client.query(query, values);
      console.log('Inserted company info successfully', result);
    } catch (err) {
      console.error('Error inserting company info: ', err);
      console.info(JSON.stringify(data, null, 2))
    }
  }
}
