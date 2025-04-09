import { SQL } from '../utils/SQL';
import type { TableSql } from '../utils/TableSql';

export class CuratedProjectSql implements TableSql<CuratedProjectType> {

  title = 'Curated Project';
  table_name = 'curated_project_details';

  async getLength() {
    const result = await SQL.client.query(`SELECT COUNT(*) FROM ${this.table_name};`,);
    console.log('Project length:', result.rows[0].count);
    return result.rows[0].count;
  }

  async getAll(limit?: number) {
    console.log('start transaction');
    try {
      console.log('Getting all projects...');
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

  async getAllIds(): Promise<string[]> {
    try {
      console.log('Getting all companies id...');
      const result = await SQL.client.query('SELECT company_id FROM companies;');
      return result.rows;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }

  async insert(data: CuratedProjectType): Promise<void> {

    try {
      // Extract the first project detail (assuming there's always at least one)
      const projectDetail = data.projectDetails[0];

      const query = `
      INSERT INTO curated_project_details (
        project_id,
        estimated_value,
        title,
        create_date,
        project_update_date,
        name,
        package_id,
        description,
        stories,
        status,
        stage,
        ucms_stage,
        construction_type,
        project_type,
        sector_type,
        sector,
        contracting_method_type,
        contracting_method,
        crimson_project_status,
        phase,
        building_type,
        owner_name,
        owner_id,
        street_address,
        city,
        state,
        country,
        postal_code,
        latitude,
        longitude,
        county_name,
        is_deleted_or_cancelled,
        is_archived,
        can_edit_project,
        is_p1_project,
        solicitation_number,
        document_availability_status,
        bid_date_description,
        plans_from,
        union_labor,
        crimson_id,
        project_categories,
        building_use_types,
        project_types,
        building_uses,
        location,
        bonds,
        set_asides,
        project_events,
        project_structures,
        project_trades,
        project_design_team,
        project_document_list
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
        $31, $32, $33, $34, $35, $36, $37, $38, $39, $40,
        $41, $42, $43, $44, $45, $46, $47, $48, $49, $50,
        $51, $52, $53
      )
      ON CONFLICT (project_id) DO NOTHING
      RETURNING *;
    `;

      const values = [
        projectDetail.Id ?? null,
        projectDetail.EstimatedValue ?? null,
        projectDetail.Title ?? null,
        projectDetail.CreateDate ? new Date(projectDetail.CreateDate) : null,
        projectDetail.ProjectUpdateDate ? new Date(projectDetail.ProjectUpdateDate) : null,
        projectDetail.Name ?? null,
        projectDetail.PackageId ?? null,
        projectDetail.Description ?? null,
        projectDetail.Stories ?? null,
        projectDetail.Status ?? null,
        projectDetail.Stage ?? null,
        projectDetail.UCMSStage ?? null,
        projectDetail.ConstructionType ?? null,
        projectDetail.ProjectType ?? null,
        projectDetail.SectorType ?? null,
        projectDetail.Sector ?? null,
        projectDetail.ContractingMethodType ?? null,
        projectDetail.ContractingMethod ?? null,
        projectDetail.CrimsonProjectStatus ?? null,
        projectDetail.Phase ?? null,
        projectDetail.BuildingType ?? null,
        projectDetail.OwnerName ?? null,
        projectDetail.OwnerId ?? null,
        projectDetail.Location?.StreetAddress ?? null,
        projectDetail.Location?.City ?? null,
        projectDetail.Location?.State ?? null,
        projectDetail.Location?.Country ?? null,
        projectDetail.Location?.PostalCode ?? null,
        projectDetail.Location?.Latitude ?? null,
        projectDetail.Location?.Longitude ?? null,
        projectDetail.Location?.CountyName ?? null,
        projectDetail.IsDeletedOrCancelled ?? false,
        projectDetail.IsArchived ?? false,
        projectDetail.CanEditProject ?? false,
        projectDetail.IsP1Project ?? false,
        projectDetail.SolicitationNumber ?? null,
        projectDetail.DocumentAvailabilityStatus ?? null,
        projectDetail.BidDateDescription ?? null,
        projectDetail.PlansFrom ?? null,
        projectDetail.UnionLabor ?? null,
        projectDetail.CrimsonId ?? null,
        JSON.stringify(projectDetail.ProjectCategories ?? []),
        JSON.stringify(projectDetail.BuildingUseTypes ?? []),
        JSON.stringify(projectDetail.ProjectTypes ?? []),
        JSON.stringify(projectDetail.BuildingUses ?? []),
        JSON.stringify(projectDetail.Location ?? {}),
        JSON.stringify(projectDetail.Bonds ?? {}),
        JSON.stringify(projectDetail.SetAsides ?? {}),
        JSON.stringify(data.projectEvents ?? []),
        JSON.stringify(data.projectStructures ?? []),
        JSON.stringify(data.projectTrades ?? []),
        JSON.stringify(data.projectDesignTeam ?? []),
        JSON.stringify(data.projectDocumentList ?? [])
      ];

      const result = await SQL.client.query(query, values);
      console.log('Inserted curated project details successfully');
    } catch (err) {
      console.error('Error inserting project lead: ', err);
      console.info(JSON.stringify(data, null, 2))
    }
  }
}
