import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_template" AS ENUM('default', 'hero');
  CREATE TYPE "public"."enum__pages_v_version_template" AS ENUM('default', 'hero');
  CREATE TABLE "pages_blocks_home_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"headline" varchar DEFAULT 'Toutes les sorties trail & course à pied',
  	"highlight_text" varchar DEFAULT 'officielles... ou pas !',
  	"tagline" varchar DEFAULT 'Le fil des sorties, officielles ou improvisées.',
  	"background_url" varchar,
  	"background_id" integer,
  	"input_placeholder" varchar DEFAULT 'Votre adresse mail...',
  	"button_label" varchar DEFAULT 'Rester informé(e) !',
  	"logo_nude_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_home_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"headline" varchar DEFAULT 'Toutes les sorties trail & course à pied',
  	"highlight_text" varchar DEFAULT 'officielles... ou pas !',
  	"tagline" varchar DEFAULT 'Le fil des sorties, officielles ou improvisées.',
  	"background_url" varchar,
  	"background_id" integer,
  	"input_placeholder" varchar DEFAULT 'Votre adresse mail...',
  	"button_label" varchar DEFAULT 'Rester informé(e) !',
  	"logo_nude_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages" ADD COLUMN "template" "enum_pages_template" DEFAULT 'default';
  ALTER TABLE "_pages_v" ADD COLUMN "version_template" "enum__pages_v_version_template" DEFAULT 'default';
  ALTER TABLE "pages_blocks_home_hero" ADD CONSTRAINT "pages_blocks_home_hero_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_hero" ADD CONSTRAINT "pages_blocks_home_hero_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_hero" ADD CONSTRAINT "pages_blocks_home_hero_logo_nude_id_media_id_fk" FOREIGN KEY ("logo_nude_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_hero" ADD CONSTRAINT "pages_blocks_home_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_hero" ADD CONSTRAINT "_pages_v_blocks_home_hero_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_hero" ADD CONSTRAINT "_pages_v_blocks_home_hero_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_hero" ADD CONSTRAINT "_pages_v_blocks_home_hero_logo_nude_id_media_id_fk" FOREIGN KEY ("logo_nude_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_hero" ADD CONSTRAINT "_pages_v_blocks_home_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_home_hero_order_idx" ON "pages_blocks_home_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_home_hero_parent_id_idx" ON "pages_blocks_home_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_home_hero_path_idx" ON "pages_blocks_home_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_home_hero_logo_idx" ON "pages_blocks_home_hero" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_home_hero_background_idx" ON "pages_blocks_home_hero" USING btree ("background_id");
  CREATE INDEX "pages_blocks_home_hero_logo_nude_idx" ON "pages_blocks_home_hero" USING btree ("logo_nude_id");
  CREATE INDEX "_pages_v_blocks_home_hero_order_idx" ON "_pages_v_blocks_home_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_home_hero_parent_id_idx" ON "_pages_v_blocks_home_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_home_hero_path_idx" ON "_pages_v_blocks_home_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_home_hero_logo_idx" ON "_pages_v_blocks_home_hero" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_home_hero_background_idx" ON "_pages_v_blocks_home_hero" USING btree ("background_id");
  CREATE INDEX "_pages_v_blocks_home_hero_logo_nude_idx" ON "_pages_v_blocks_home_hero" USING btree ("logo_nude_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_home_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_home_hero" CASCADE;
  ALTER TABLE "pages" DROP COLUMN "template";
  ALTER TABLE "_pages_v" DROP COLUMN "version_template";
  DROP TYPE "public"."enum_pages_template";
  DROP TYPE "public"."enum__pages_v_version_template";`)
}
