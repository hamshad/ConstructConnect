-- Table: public.company_leads

-- DROP TABLE IF EXISTS public.company_leads;

CREATE TABLE IF NOT EXISTS public.company_leads
(
    company_id integer NOT NULL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    industry_value character varying(100) COLLATE pg_catalog."default",
    project_count integer,
    project_value numeric(18,2),
    phone character varying(50) COLLATE pg_catalog."default",
    is_watched boolean DEFAULT false,
    is_viewed boolean DEFAULT false,
    latitude numeric(10,8),
    longitude numeric(11,8),
    city character varying(100) COLLATE pg_catalog."default",
    country_code character varying(10) COLLATE pg_catalog."default",
    county character varying(100) COLLATE pg_catalog."default",
    state character varying(100) COLLATE pg_catalog."default",
    state_code character varying(10) COLLATE pg_catalog."default",
    zipcode character varying(20) COLLATE pg_catalog."default",
    address_line1 character varying(255) COLLATE pg_catalog."default",
    address_line2 character varying(255) COLLATE pg_catalog."default",
    last_viewed_date timestamp without time zone,
    role_groups jsonb,
    role_types jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT company_leads_pkey PRIMARY KEY (company_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.company_leads
    OWNER to postgres;



-- Table: public.project_leads

-- DROP TABLE IF EXISTS public.project_leads;

CREATE TABLE IF NOT EXISTS public.project_leads
(
    project_id integer NOT NULL,
    unique_id character varying(50) COLLATE pg_catalog."default",
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    project_url character varying(255) COLLATE pg_catalog."default",
    bid_date timestamp without time zone,
    property_type character varying(100) COLLATE pg_catalog."default",
    document_count integer,
    project_status character varying(50) COLLATE pg_catalog."default",
    start_date timestamp without time zone,
    project_value numeric(18,2),
    building_uses_string text COLLATE pg_catalog."default",
    addenda_count integer,
    content_type character varying(50) COLLATE pg_catalog."default",
    bids_to_contact_role_group character varying(100) COLLATE pg_catalog."default",
    contracting_method character varying(100) COLLATE pg_catalog."default",
    project_category character varying(100) COLLATE pg_catalog."default",
    square_footage integer,
    is_watched boolean DEFAULT false,
    is_viewed boolean DEFAULT false,
    is_hidden boolean DEFAULT false,
    latitude numeric(10,8),
    longitude numeric(11,8),
    city character varying(100) COLLATE pg_catalog."default",
    state character varying(100) COLLATE pg_catalog."default",
    zipcode character varying(20) COLLATE pg_catalog."default",
    address_line1 character varying(255) COLLATE pg_catalog."default",
    last_updated_date timestamp without time zone,
    created_project_date timestamp without time zone,
    is_shareable boolean DEFAULT true,
    categories jsonb,
    sub_categories jsonb,
    construction_types jsonb,
    sectors jsonb,
    trades jsonb,
    stories jsonb,
    value_ranges jsonb,
    csi_codes jsonb,
    tags jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT project_leads_pkey PRIMARY KEY (project_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.project_leads
    OWNER to postgres;


-- Table: public.project_companies

-- DROP TABLE IF EXISTS public.project_companies;

CREATE TABLE IF NOT EXISTS public.project_companies
(
	id SERIAL NOT NULL,
    project_id integer NOT NULL,
    company_id integer,
    company_name character varying(255) COLLATE pg_catalog."default",
    role character varying(100) COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT project_companies_pkey PRIMARY KEY (id),
    CONSTRAINT project_companies_company_id_fkey FOREIGN KEY (company_id)
        REFERENCES public.company_leads (company_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT project_companies_project_id_fkey FOREIGN KEY (project_id)
        REFERENCES public.project_leads (project_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.project_companies
    OWNER to postgres;


-- Table: public.company_details

-- DROP TABLE IF EXISTS public.company_details;

CREATE TABLE IF NOT EXISTS public.company_details
(
    id integer NOT NULL,
    company_id integer NOT NULL,
    source_company_id character varying(50) COLLATE pg_catalog."default",
    website character varying(255) COLLATE pg_catalog."default",
    fax character varying(50) COLLATE pg_catalog."default",
    email_address character varying(255) COLLATE pg_catalog."default",
    contacts jsonb,
    portfolio jsonb,
    notes jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT company_details_pkey PRIMARY KEY (id),
    CONSTRAINT company_details_company_id_fkey FOREIGN KEY (company_id)
        REFERENCES public.company_leads (company_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.company_details
    OWNER to postgres;

-- Trigger: update_company_details_modtime


-- Table: public.project_details

-- DROP TABLE IF EXISTS public.project_details;

CREATE TABLE IF NOT EXISTS public.project_details
(
    id integer NOT NULL,
    project_id integer NOT NULL,
    description text COLLATE pg_catalog."default",
    package_id character varying(50) COLLATE pg_catalog."default",
    status character varying(50) COLLATE pg_catalog."default",
    stage character varying(100) COLLATE pg_catalog."default",
    construction_type character varying(100) COLLATE pg_catalog."default",
    project_type character varying(100) COLLATE pg_catalog."default",
    sector_type character varying(100) COLLATE pg_catalog."default",
    contracting_method_detail character varying(100) COLLATE pg_catalog."default",
    owner_name character varying(255) COLLATE pg_catalog."default",
    owner_id integer,
    building_type character varying(100) COLLATE pg_catalog."default",
    events jsonb,
    participants jsonb,
    notes jsonb,
    bonds jsonb,
    set_asides jsonb,
    solicitation_number character varying(100) COLLATE pg_catalog."default",
    document_availability_status character varying(100) COLLATE pg_catalog."default",
    plans_from character varying(255) COLLATE pg_catalog."default",
    is_deleted_or_cancelled boolean DEFAULT false,
    is_archived boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT project_details_pkey PRIMARY KEY (id),
    CONSTRAINT project_details_project_id_fkey FOREIGN KEY (project_id)
        REFERENCES public.project_leads (project_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.project_details
    OWNER to postgres;


-- Table: public.curated_project_details

-- DROP TABLE IF EXISTS public.curated_project_details;

CREATE TABLE IF NOT EXISTS public.curated_project_details
(
    project_id integer NOT NULL,
    estimated_value numeric(18,2),
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    create_date timestamp without time zone,
    project_update_date timestamp without time zone,
    name character varying(255) COLLATE pg_catalog."default",
    package_id integer,
    description text COLLATE pg_catalog."default",
    stories integer,
    status integer,
    stage integer,
    ucms_stage integer,
    construction_type integer,
    project_type integer,
    sector_type integer,
    sector character varying(100) COLLATE pg_catalog."default",
    contracting_method_type integer,
    contracting_method character varying(100) COLLATE pg_catalog."default",
    crimson_project_status character varying(50) COLLATE pg_catalog."default",
    phase integer,
    building_type integer,
    owner_name character varying(255) COLLATE pg_catalog."default",
    owner_id integer,
    street_address character varying(255) COLLATE pg_catalog."default",
    city character varying(100) COLLATE pg_catalog."default",
    state character varying(50) COLLATE pg_catalog."default",
    country character varying(50) COLLATE pg_catalog."default",
    postal_code character varying(20) COLLATE pg_catalog."default",
    latitude numeric(10,8),
    longitude numeric(11,8),
    county_name character varying(100) COLLATE pg_catalog."default",
    is_deleted_or_cancelled boolean DEFAULT false,
    is_archived boolean DEFAULT false,
    can_edit_project boolean DEFAULT false,
    is_p1_project boolean DEFAULT false,
    solicitation_number character varying(255) COLLATE pg_catalog."default",
    document_availability_status character varying(50) COLLATE pg_catalog."default",
    bid_date_description text COLLATE pg_catalog."default",
    plans_from character varying(255) COLLATE pg_catalog."default",
    union_labor character varying(100) COLLATE pg_catalog."default",
    crimson_id integer,
    project_categories jsonb,
    building_use_types jsonb,
    project_types jsonb,
    building_uses jsonb,
    location jsonb,
    bonds jsonb,
    set_asides jsonb,
    project_events jsonb,
    project_structures jsonb,
    project_trades jsonb,
    project_design_team jsonb,
    project_document_list jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT curated_project_details_pkey PRIMARY KEY (project_id),
    CONSTRAINT fk_curated_project_details_project_leads FOREIGN KEY (project_id)
        REFERENCES public.project_leads (project_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.curated_project_details
    OWNER to postgres;
