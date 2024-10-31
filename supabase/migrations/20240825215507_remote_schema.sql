CREATE TRIGGER create_user_on_signup AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION create_user_on_signup()
grant delete on table "storage"."s3_multipart_uploads" to "postgres"
grant insert on table "storage"."s3_multipart_uploads" to "postgres"
grant references on table "storage"."s3_multipart_uploads" to "postgres"
grant select on table "storage"."s3_multipart_uploads" to "postgres"
grant trigger on table "storage"."s3_multipart_uploads" to "postgres"
grant truncate on table "storage"."s3_multipart_uploads" to "postgres"
grant update on table "storage"."s3_multipart_uploads" to "postgres"
grant delete on table "storage"."s3_multipart_uploads_parts" to "postgres"
grant insert on table "storage"."s3_multipart_uploads_parts" to "postgres"
grant references on table "storage"."s3_multipart_uploads_parts" to "postgres"
grant select on table "storage"."s3_multipart_uploads_parts" to "postgres"
grant trigger on table "storage"."s3_multipart_uploads_parts" to "postgres"
grant truncate on table "storage"."s3_multipart_uploads_parts" to "postgres"
grant update on table "storage"."s3_multipart_uploads_parts" to "postgres"
create policy "Give anon users access to JPG images in folder ppd1e8_0"
on "storage"."objects"
as permissive
for select
to public
using (((bucket_id = 'application'::text) AND (lower((storage.foldername(name))[1]) = 'public'::text) AND (auth.role() = 'anon'::text)))
create policy "Give users access to own folder 1io9m69_0"
on "storage"."objects"
as permissive
for select
to public
using (((bucket_id = 'photos'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])))
create policy "Give users access to own folder 1io9m69_1"
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'photos'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])))
