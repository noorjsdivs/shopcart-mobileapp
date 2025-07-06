-- Enable uuid-ossp extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = NOW();
RETURN NEW;
END;

$$
language 'plpgsql';

-- Create users table
CREATE TABLE public.users (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    email character varying(255) NOT NULL,
    name character varying(255) NULL,
    image text NULL,
    created_at timestamp with time zone NULL DEFAULT now(),
    updated_at timestamp with time zone NULL DEFAULT now(),
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
) TABLESPACE pg_default;

-- Create index for users.email
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users USING btree (email) TABLESPACE pg_default;

-- Create trigger for users
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create products table
CREATE TABLE public.products (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    title character varying(255) NOT NULL,
    price numeric(10, 2) NOT NULL,
    image text NULL,
    created_at timestamp with time zone NULL DEFAULT now(),
    updated_at timestamp with time zone NULL DEFAULT now(),
    CONSTRAINT products_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Create index for products.title
CREATE INDEX IF NOT EXISTS idx_products_title ON public.products USING btree (title) TABLESPACE pg_default;

-- Create trigger for products
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create orders table
CREATE TABLE public.orders (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    order_number character varying(100) NOT NULL,
    customer_name character varying(255) NOT NULL,
    customer_email character varying(255) NOT NULL,
    total_amount numeric(10, 2) NOT NULL,
    status character varying(50) NULL DEFAULT 'pending'::character varying,
    user_id uuid NULL,
    created_at timestamp with time zone NULL DEFAULT now(),
    updated_at timestamp with time zone NULL DEFAULT now(),
    CONSTRAINT orders_pkey PRIMARY KEY (id),
    CONSTRAINT orders_order_number_key UNIQUE (order_number),
    CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Create indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders USING btree (user_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders USING btree (order_number) TABLESPACE pg_default;

-- Create trigger for orders
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create order_items table
CREATE TABLE public.order_items (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    order_id uuid NOT NULL,
    product_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    price numeric(10, 2) NOT NULL,
    quantity integer NOT NULL,
    image text NULL,
    created_at timestamp with time zone NULL DEFAULT now(),
    CONSTRAINT order_items_pkey PRIMARY KEY (id),
    CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders (id) ON DELETE CASCADE,
    CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products (id) ON DELETE RESTRICT
) TABLESPACE pg_default;

-- Create indexes for order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items USING btree (order_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items USING btree (product_id) TABLESPACE pg_default;
$$
