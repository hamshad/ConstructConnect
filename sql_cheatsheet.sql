-- [deletes all the records from table]
-- truncate companies;

select * from companies;

-- [duplicate records]
SELECT *
FROM companies
WHERE company_id IN (
    SELECT company_id
    FROM companies
    GROUP BY company_id
    HAVING COUNT(*) > 1
);

-- Add new columns to store additional JSON data
ALTER TABLE IF EXISTS public.companies
    ADD COLUMN IF NOT EXISTS source_company_id integer,
    ADD COLUMN IF NOT EXISTS last_updated_date timestamp,
    ADD COLUMN IF NOT EXISTS associated_contacts jsonb,
    ADD COLUMN IF NOT EXISTS company_portfolio jsonb,
    ADD COLUMN IF NOT EXISTS company_notes jsonb;

-- [Search from the string]
SELECT * FROM companies WHERE address::text ilike '%Santa Monica%';

-- [Search from the jsonb]
select * from companies where address->>'city' = 'Santa Monica';

-- [Search the jsonb from the jsonb]
select address->>'zipcode' from companies where address->>'state' = 'California' and address->>'zipcode' = '95742';

-- [Search from the jsonb array]
SELECT * FROM companies
WHERE associated_contacts @> '[{"FirstName": "Jeff"}]';
