create table public.users (
id uuid not null default extensions.uuid_generate_v4 (),
email character varying(255) not null,
name character varying(255) null,
image text null,
created_at timestamp with time zone null default now(),
updated_at timestamp with time zone null default now(),
constraint users_pkey primary key (id),
constraint users_email_key unique (email)
) TABLESPACE pg_default;

create index IF not exists idx_users_email on public.users using btree (email) TABLESPACE pg_default;

create trigger update_users_updated_at BEFORE
update on users for EACH row
execute FUNCTION update_updated_at_column ();
