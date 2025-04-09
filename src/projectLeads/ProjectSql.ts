import { spinner } from '@clack/prompts';
import type companyRawLeads from '../../data/companyRawLeads';
import { SQL } from '../utils/SQL';
import { Transactional } from '../utils/Transactions';
import type projectLeads from '../../data/projectLeads';

export class ProjectSql {

  table_name = 'project_leads';

  async getProjectLength() {
    const result = await SQL.client.query(`SELECT COUNT(*) FROM ${this.table_name};`,);
    console.log('Project length:', result.rows[0].count);
    return result.rows[0].count;
  }

  async getAllProjects(limit?: number) {
    try {
      console.log('Getting all projects...');
      const result = await SQL.client.query(
        'SELECT * FROM company_leads LIMIT $1;',
        [limit ?? 10000]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }

  async getAllProjectsIds(): Promise<string[]> {
    try {
      console.log(`Getting all projects id...`);
      const result = await SQL.client.query(`SELECT project_id FROM ${this.table_name};`);
      return result.rows;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  async getAllCuratedProjectIds(offset: number): Promise<string[]> {
    try {
      console.log(`Getting all curated projects id on offset ${offset}...`);
      const result = await SQL.client.query(`SELECT project_id FROM ${this.table_name} where content_type = 'CuratedProject' LIMIT 50 OFFSET ${offset};`);

      return result.rows;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  async insertProjectLead(data: ProjectLeadsType['data'][0]): Promise<void> {

    try {
      const query = `
      INSERT INTO project_leads (
        project_id,
        unique_id,
        title,
        project_url,
        bid_date,
        property_type,
        document_count,
        project_status,
        start_date,
        project_value,
        building_uses_string,
        addenda_count,
        content_type,
        bids_to_contact_role_group,
        contracting_method,
        project_category,
        square_footage,
        is_watched,
        is_viewed,
        is_hidden,
        latitude,
        longitude,
        city,
        state,
        zipcode,
        address_line1,
        last_updated_date,
        created_project_date,
        is_shareable,
        categories,
        sub_categories,
        construction_types,
        sectors,
        trades,
        stories,
        value_ranges,
        csi_codes,
        tags
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
        $31, $32, $33, $34, $35, $36, $37, $38
      )
      ON CONFLICT (project_id) DO NOTHING
      RETURNING *;
    `;

      const values = [
        data.projectId ?? null,
        data.uniqueProjectId ?? null,
        data.title ?? null,
        data.projectUrl ?? null,
        data.bidDate ?? null,
        data.propertyType ?? null,
        data.documentCount ?? null,
        data.projectStatus ?? null,
        data.startDate ?? null,
        data.projectValue ?? null,
        data.buildingUsesString ?? null,
        data.addendaCount ?? null,
        data.contentType ?? null,
        data.bidsToContactRoleGroup ?? null,
        data.contractingMethod ?? null,
        data.projectCategory ?? null,
        data.squareFootage ?? null,
        data.isWatched ?? false,
        data.isViewed ?? false,
        data.isHidden ?? false,
        data.location.latitude ?? null,
        data.location.longitude ?? null,
        data.address.city ?? null,
        data.address.state ?? null,
        data.address.zipcode ?? null,
        data.address.addressLine1 ?? null,
        data.lastUpdatedDate ?? null,
        data.createdProjectDate ?? null,
        data.isShareable ?? true,
        JSON.stringify(data.categories ?? null),
        JSON.stringify(data.subCategories ?? null),
        JSON.stringify(data.constructionTypes ?? null),
        JSON.stringify(data.sectors ?? null),
        JSON.stringify(data.trades ?? null),
        JSON.stringify(data.stories ?? null),
        JSON.stringify(data.projectValueRange ?? null),
        JSON.stringify(data.csiCodes ?? null),
        JSON.stringify(data.tags ?? null)
      ];

      const result = await SQL.client.query(query, values);
    } catch (err) {
      console.error('Error inserting project lead: ', err);
      console.info(JSON.stringify(data, null, 2))
    }
  }

  @Transactional()
  async addSingleProjectc(companyId: string, company: SingleCompanyType) {
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

  async addSingleProjectDirectly(companyFromList: typeof companyRawLeads[0], singleCompany: SingleCompanyType): Promise<void> {


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
