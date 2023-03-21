CREATE TABLE IF NOT EXISTS
  public.movies (
    id serial NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL,
    duration integer NOT NULL,
    price integer NOT NULL
  );

ALTER TABLE
  public.movies
ADD
  CONSTRAINT untitled_table_pkey PRIMARY KEY (id);
  
  