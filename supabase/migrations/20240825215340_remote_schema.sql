SET statement_timeout = 0
SET lock_timeout = 0
SET idle_in_transaction_session_timeout = 0
SET client_encoding = 'UTF8'
SET standard_conforming_strings = on
SELECT pg_catalog.set_config('search_path', '', false)
SET check_function_bodies = false
SET xmloption = content
SET client_min_messages = warning
SET row_security = off
CREATE SCHEMA IF NOT EXISTS "api"
ALTER SCHEMA "api" OWNER TO "postgres"
CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium"
COMMENT ON SCHEMA "public" IS 'standard public schema'
CREATE SCHEMA IF NOT EXISTS "test"
ALTER SCHEMA "test" OWNER TO "postgres"
CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql"
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions"
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions"
CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions"
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault"
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions"
CREATE OR REPLACE FUNCTION "public"."create_user_on_signup"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
    INSERT INTO public.users (id, email)
    VALUES (new.id, new.email);
    RETURN new;
END;$$
ALTER FUNCTION "public"."create_user_on_signup"() OWNER TO "postgres"
SET default_tablespace = ''
SET default_table_access_method = "heap"
CREATE TABLE IF NOT EXISTS "public"."images" (
    "id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "compressed_url" "text",
    "url" "text"
)
ALTER TABLE "public"."images" OWNER TO "postgres"
CREATE TABLE IF NOT EXISTS "public"."referrals" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "referrals" "text"[] NOT NULL
)
ALTER TABLE "public"."referrals" OWNER TO "postgres"
CREATE TABLE IF NOT EXISTS "public"."tasks" (
    "id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "image" "text",
    "name" "text",
    "reward_coins" integer,
    "reward_by_day" "json",
    "description" "text",
    "type" "text" NOT NULL
)
ALTER TABLE "public"."tasks" OWNER TO "postgres"
CREATE TABLE IF NOT EXISTS "public"."tasks_progress" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp without time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "is_completed" boolean DEFAULT false NOT NULL,
    "task" "text",
    "completed_at" timestamp without time zone,
    "user" "uuid" NOT NULL,
    "day" smallint
)
ALTER TABLE "public"."tasks_progress" OWNER TO "postgres"
COMMENT ON TABLE "public"."tasks_progress" IS 'Describes user progress within a specific task'
CREATE TABLE IF NOT EXISTS "public"."user_tasks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "user_id" "uuid" NOT NULL,
    "task_id" "text" NOT NULL,
    "completed" boolean NOT NULL,
    "days_completed" smallint DEFAULT '0'::smallint NOT NULL
)
ALTER TABLE "public"."user_tasks" OWNER TO "postgres"
COMMENT ON TABLE "public"."user_tasks" IS 'Tasks completed by a user'
CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "email" character varying,
    "coins" bigint DEFAULT '0'::bigint NOT NULL,
    "last_hourly_reward_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "energy" integer DEFAULT 1000 NOT NULL,
    "referrals" "text"[] NOT NULL,
    "last_claimed_daily_reward_at" timestamp without time zone,
    "last_hourly_reward" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "last_daily_reward" timestamp with time zone
)
ALTER TABLE "public"."users" OWNER TO "postgres"
ALTER TABLE ONLY "public"."images"
    ADD CONSTRAINT "images_pkey" PRIMARY KEY ("id")
ALTER TABLE ONLY "public"."referrals"
    ADD CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
ALTER TABLE ONLY "public"."tasks_progress"
    ADD CONSTRAINT "tasks_progress_pkey" PRIMARY KEY ("id")
ALTER TABLE ONLY "public"."user_tasks"
    ADD CONSTRAINT "user_tasks_pkey" PRIMARY KEY ("id")
ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id")
ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_image_fkey" FOREIGN KEY ("image") REFERENCES "public"."images"("id") ON UPDATE CASCADE ON DELETE SET DEFAULT
ALTER TABLE ONLY "public"."tasks_progress"
    ADD CONSTRAINT "tasks_progress_task_fkey" FOREIGN KEY ("task") REFERENCES "public"."tasks"("id") ON UPDATE CASCADE ON DELETE CASCADE
ALTER TABLE ONLY "public"."tasks_progress"
    ADD CONSTRAINT "tasks_progress_user_fkey" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE
ALTER TABLE ONLY "public"."user_tasks"
    ADD CONSTRAINT "user_tasks_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON UPDATE CASCADE ON DELETE CASCADE
ALTER TABLE ONLY "public"."user_tasks"
    ADD CONSTRAINT "user_tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE
ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE
CREATE POLICY "Enable insert for authenticated users only" ON "public"."users" FOR INSERT TO "supabase_auth_admin" WITH CHECK (true)
CREATE POLICY "Enable insert for users based on user_id" ON "public"."user_tasks" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"))
CREATE POLICY "Enable insert for users based on user_id" ON "public"."users" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"))
CREATE POLICY "Enable select for authenticated users only" ON "public"."images" FOR SELECT TO "authenticated" USING (true)
CREATE POLICY "Enable select for authenticated users only" ON "public"."tasks" FOR SELECT TO "authenticated" USING (true)
CREATE POLICY "Enable select for users based on user_id" ON "public"."user_tasks" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"))
CREATE POLICY "Enable update for users based on user_id" ON "public"."users" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "id"))
CREATE POLICY "Enable updatee for users based on user_id" ON "public"."users" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "id"))
CREATE POLICY "asdfasdf" ON "public"."users" TO "supabase_auth_admin" USING (true) WITH CHECK (true)
ALTER TABLE "public"."images" ENABLE ROW LEVEL SECURITY
ALTER TABLE "public"."referrals" ENABLE ROW LEVEL SECURITY
ALTER TABLE "public"."tasks" ENABLE ROW LEVEL SECURITY
ALTER TABLE "public"."tasks_progress" ENABLE ROW LEVEL SECURITY
ALTER TABLE "public"."user_tasks" ENABLE ROW LEVEL SECURITY
ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY
ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres"
GRANT USAGE ON SCHEMA "api" TO "anon"
GRANT USAGE ON SCHEMA "api" TO "authenticated"
GRANT USAGE ON SCHEMA "api" TO "service_role"
GRANT USAGE ON SCHEMA "public" TO "postgres"
GRANT USAGE ON SCHEMA "public" TO "anon"
GRANT USAGE ON SCHEMA "public" TO "authenticated"
GRANT USAGE ON SCHEMA "public" TO "service_role"
GRANT ALL ON FUNCTION "public"."create_user_on_signup"() TO "anon"
GRANT ALL ON FUNCTION "public"."create_user_on_signup"() TO "authenticated"
GRANT ALL ON FUNCTION "public"."create_user_on_signup"() TO "service_role"
GRANT ALL ON TABLE "public"."images" TO "anon"
GRANT ALL ON TABLE "public"."images" TO "authenticated"
GRANT ALL ON TABLE "public"."images" TO "service_role"
GRANT ALL ON TABLE "public"."referrals" TO "anon"
GRANT ALL ON TABLE "public"."referrals" TO "authenticated"
GRANT ALL ON TABLE "public"."referrals" TO "service_role"
GRANT ALL ON TABLE "public"."tasks" TO "anon"
GRANT ALL ON TABLE "public"."tasks" TO "authenticated"
GRANT ALL ON TABLE "public"."tasks" TO "service_role"
GRANT ALL ON TABLE "public"."tasks_progress" TO "anon"
GRANT ALL ON TABLE "public"."tasks_progress" TO "authenticated"
GRANT ALL ON TABLE "public"."tasks_progress" TO "service_role"
GRANT ALL ON TABLE "public"."user_tasks" TO "anon"
GRANT ALL ON TABLE "public"."user_tasks" TO "authenticated"
GRANT ALL ON TABLE "public"."user_tasks" TO "service_role"
GRANT ALL ON TABLE "public"."users" TO "anon"
GRANT ALL ON TABLE "public"."users" TO "authenticated"
GRANT ALL ON TABLE "public"."users" TO "service_role"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role"
RESET ALL
