import { SQL } from '../utils/SQL';


export class ProjectCompanySql {

  title = 'Project Company';
  table_name = 'project_companies';

  async getLength() {
    const result = await SQL.client.query(`SELECT COUNT(*) FROM ${this.table_name};`);
    console.log('Project companies count:', result.rows[0].count);
    return result.rows[0].count;
  }

  async getAll(limit?: number) {
    try {
      console.log('Getting all project companies...');
      const result = await SQL.client.query(
        `SELECT * FROM ${this.table_name} LIMIT $1;`,
        [limit ?? 10000]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching project companies:', error);
      throw error;
    }
  }

  async getByProjectId(projectId: number) {
    try {
      console.log(`Getting companies for project ${projectId}...`);
      const result = await SQL.client.query(
        `SELECT * FROM ${this.table_name} WHERE project_id = $1;`,
        [projectId]
      );
      return result.rows;
    } catch (error) {
      console.error(`Error fetching companies for project ${projectId}:`, error);
      throw error;
    }
  }

  async getByCompanyId(companyId: number) {
    try {
      console.log(`Getting projects for company ${companyId}...`);
      const result = await SQL.client.query(
        `SELECT * FROM ${this.table_name} WHERE company_id = $1;`,
        [companyId]
      );
      return result.rows;
    } catch (error) {
      console.error(`Error fetching projects for company ${companyId}:`, error);
      throw error;
    }
  }

  async insert(data: ProjectCompanyType): Promise<void> {
    try {
      const query = `
      INSERT INTO ${this.table_name} (
        project_id,
        company_id,
        company_name,
        role
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `;

      const values = [
        data.project_id,
        data.company_id ?? null,
        data.company_name ?? null,
        data.role ?? null
      ];

      const result = await SQL.client.query(query, values);
      console.log('Inserted project company association successfully');
    } catch (err) {
      console.error('Error inserting project company association:', err);
      console.info(JSON.stringify(data, null, 2));
      throw err;
    }
  }

  async bulkInsert(data: ProjectCompanyType[]): Promise<void> {
    try {
      console.log('Starting bulk insert of project company associations...');

      // Begin transaction
      await SQL.client.query('BEGIN');

      for (const item of data) {
        await this.insert(item);
      }

      // Commit transaction
      await SQL.client.query('COMMIT');
      console.log(`Successfully inserted ${data.length} project company associations`);
    } catch (err) {
      // Rollback on error
      await SQL.client.query('ROLLBACK');
      console.error('Error in bulk insert of project company associations:', err);
      throw err;
    }
  }

  async deleteByProjectId(projectId: number): Promise<void> {
    try {
      const query = `
      DELETE FROM ${this.table_name}
      WHERE project_id = $1;
      `;

      await SQL.client.query(query, [projectId]);
      console.log(`Deleted all company associations for project ${projectId}`);
    } catch (err) {
      console.error(`Error deleting company associations for project ${projectId}:`, err);
      throw err;
    }
  }

  async getCompaniesByRole(role: string, limit?: number) {
    try {
      console.log(`Getting companies with role "${role}"...`);
      const result = await SQL.client.query(
        `SELECT * FROM ${this.table_name} WHERE role = $1 LIMIT $2;`,
        [role, limit ?? 10000]
      );
      return result.rows;
    } catch (error) {
      console.error(`Error fetching companies with role "${role}":`, error);
      throw error;
    }
  }

  async getProjectCompanyCounts() {
    try {
      console.log('Getting project company association counts...');
      const result = await SQL.client.query(`
        SELECT project_id, COUNT(*) as company_count 
        FROM ${this.table_name} 
        GROUP BY project_id
        ORDER BY company_count DESC;
      `);
      return result.rows;
    } catch (error) {
      console.error('Error fetching project company counts:', error);
      throw error;
    }
  }
}
