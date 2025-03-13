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

-- [Search from the string]
-- SELECT * FROM companies WHERE address::text ilike '%Santa Monica%';

-- [Search from the jsonb]
select * from companies where address->>'city' = 'Santa Monica';
