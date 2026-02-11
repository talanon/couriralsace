import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_image_text_layout" AS ENUM('imageLeft', 'imageRight');
  CREATE TYPE "public"."enum__pages_v_blocks_image_text_layout" AS ENUM('imageLeft', 'imageRight');
  CREATE TYPE "public"."enum_events_courses_type" AS ENUM('trail', 'course');
  CREATE TYPE "public"."enum_events_courses_level" AS ENUM('beginner', 'intermediate', 'expert');
  CREATE TYPE "public"."enum_header_nav_items_style" AS ENUM('link', 'green-pill');
  CREATE TABLE "pages_blocks_section_entete" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cta_label" varchar DEFAULT 'Proposer une sortie',
  	"cta_url" varchar DEFAULT '/proposer',
  	"title" varchar DEFAULT 'TOUTES LES SORTIES',
  	"highlighted_text" varchar DEFAULT 'TRAIL & COURSE A PIED',
  	"location" varchar DEFAULT 'EN ALSACE',
  	"background_image_id" integer,
  	"show_decorative_curves" boolean DEFAULT true,
  	"curve_opacity" varchar DEFAULT 'opacity-80',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"highlighted_text" varchar,
  	"description" varchar,
  	"cta_text" varchar DEFAULT 'Proposer une sortie',
  	"cta_link" varchar DEFAULT '/proposer',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_event_grid_manual_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"date_label" varchar,
  	"distance_label" varchar,
  	"elevation_label" varchar,
  	"location_label" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_event_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'LES PROCHAINES SORTIES',
  	"cta_text" varchar DEFAULT 'Toutes les courses',
  	"cta_link" varchar DEFAULT '/courses',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image_text_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"link" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE "pages_blocks_image_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_pages_blocks_image_text_layout" DEFAULT 'imageLeft',
  	"image_id" integer,
  	"title" varchar,
  	"subtitle" varchar,
  	"highlighted_text" varchar,
  	"description" varchar,
  	"show_decorative_curves" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"is_active" boolean DEFAULT true,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"highlighted_text" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_alsace_events_map" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Evenements en Alsace',
  	"subtitle" varchar DEFAULT 'Filtrez les evenements par periode',
  	"months_ahead" numeric DEFAULT 12,
  	"max_events" numeric DEFAULT 200,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_section_entete" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_label" varchar DEFAULT 'Proposer une sortie',
  	"cta_url" varchar DEFAULT '/proposer',
  	"title" varchar DEFAULT 'TOUTES LES SORTIES',
  	"highlighted_text" varchar DEFAULT 'TRAIL & COURSE A PIED',
  	"location" varchar DEFAULT 'EN ALSACE',
  	"background_image_id" integer,
  	"show_decorative_curves" boolean DEFAULT true,
  	"curve_opacity" varchar DEFAULT 'opacity-80',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"highlighted_text" varchar,
  	"description" varchar,
  	"cta_text" varchar DEFAULT 'Proposer une sortie',
  	"cta_link" varchar DEFAULT '/proposer',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_event_grid_manual_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"date_label" varchar,
  	"distance_label" varchar,
  	"elevation_label" varchar,
  	"location_label" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_event_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'LES PROCHAINES SORTIES',
  	"cta_text" varchar DEFAULT 'Toutes les courses',
  	"cta_link" varchar DEFAULT '/courses',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_text_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"link" varchar,
  	"icon" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout" "enum__pages_v_blocks_image_text_layout" DEFAULT 'imageLeft',
  	"image_id" integer,
  	"title" varchar,
  	"subtitle" varchar,
  	"highlighted_text" varchar,
  	"description" varchar,
  	"show_decorative_curves" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"is_active" boolean DEFAULT true,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"highlighted_text" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_alsace_events_map" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Evenements en Alsace',
  	"subtitle" varchar DEFAULT 'Filtrez les evenements par periode',
  	"months_ahead" numeric DEFAULT 12,
  	"max_events" numeric DEFAULT 200,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "events_courses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"type" "enum_events_courses_type" DEFAULT 'trail' NOT NULL,
  	"official" boolean DEFAULT true,
  	"level" "enum_events_courses_level" DEFAULT 'intermediate' NOT NULL,
  	"distance" numeric,
  	"elevation_gain" numeric,
  	"location" varchar,
  	"image_id" integer,
  	"gpx_id" integer
  );
  
  ALTER TABLE "events" DROP CONSTRAINT "events_gpx_id_media_id_fk";
  
  DROP INDEX "events_gpx_idx";
  ALTER TABLE "events" ALTER COLUMN "tenant_id" DROP NOT NULL;
  ALTER TABLE "pages_blocks_home_hero" ADD COLUMN "headline_styled" varchar DEFAULT 'Toutes les sorties
  <green>trail & course à pied</green>
  en Alsace';
  ALTER TABLE "pages_rels" ADD COLUMN "events_id" integer;
  ALTER TABLE "_pages_v_blocks_home_hero" ADD COLUMN "headline_styled" varchar DEFAULT 'Toutes les sorties
  <green>trail & course à pied</green>
  en Alsace';
  ALTER TABLE "_pages_v_rels" ADD COLUMN "events_id" integer;
  ALTER TABLE "events" ADD COLUMN "start_date" timestamp(3) with time zone NOT NULL;
  ALTER TABLE "events" ADD COLUMN "end_date" timestamp(3) with time zone NOT NULL;
  ALTER TABLE "events" ADD COLUMN "image_id" integer;
  ALTER TABLE "header_nav_items" ADD COLUMN "icon_id" integer;
  ALTER TABLE "header_nav_items" ADD COLUMN "style" "enum_header_nav_items_style" DEFAULT 'link';
  ALTER TABLE "pages_blocks_section_entete" ADD CONSTRAINT "pages_blocks_section_entete_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_section_entete" ADD CONSTRAINT "pages_blocks_section_entete_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_items" ADD CONSTRAINT "pages_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_section" ADD CONSTRAINT "pages_blocks_feature_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_event_grid_manual_events" ADD CONSTRAINT "pages_blocks_event_grid_manual_events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_event_grid_manual_events" ADD CONSTRAINT "pages_blocks_event_grid_manual_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_event_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_event_grid" ADD CONSTRAINT "pages_blocks_event_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_text_ctas" ADD CONSTRAINT "pages_blocks_image_text_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_image_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_text" ADD CONSTRAINT "pages_blocks_image_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_text" ADD CONSTRAINT "pages_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_steps" ADD CONSTRAINT "pages_blocks_timeline_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline" ADD CONSTRAINT "pages_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_alsace_events_map" ADD CONSTRAINT "pages_blocks_alsace_events_map_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_section_entete" ADD CONSTRAINT "_pages_v_blocks_section_entete_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_section_entete" ADD CONSTRAINT "_pages_v_blocks_section_entete_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_items" ADD CONSTRAINT "_pages_v_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats" ADD CONSTRAINT "_pages_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_section" ADD CONSTRAINT "_pages_v_blocks_feature_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_event_grid_manual_events" ADD CONSTRAINT "_pages_v_blocks_event_grid_manual_events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_event_grid_manual_events" ADD CONSTRAINT "_pages_v_blocks_event_grid_manual_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_event_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_event_grid" ADD CONSTRAINT "_pages_v_blocks_event_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_text_ctas" ADD CONSTRAINT "_pages_v_blocks_image_text_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_image_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_text" ADD CONSTRAINT "_pages_v_blocks_image_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_text" ADD CONSTRAINT "_pages_v_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_steps" ADD CONSTRAINT "_pages_v_blocks_timeline_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline" ADD CONSTRAINT "_pages_v_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_alsace_events_map" ADD CONSTRAINT "_pages_v_blocks_alsace_events_map_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_courses" ADD CONSTRAINT "events_courses_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_courses" ADD CONSTRAINT "events_courses_gpx_id_media_id_fk" FOREIGN KEY ("gpx_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_courses" ADD CONSTRAINT "events_courses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_section_entete_order_idx" ON "pages_blocks_section_entete" USING btree ("_order");
  CREATE INDEX "pages_blocks_section_entete_parent_id_idx" ON "pages_blocks_section_entete" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_section_entete_path_idx" ON "pages_blocks_section_entete" USING btree ("_path");
  CREATE INDEX "pages_blocks_section_entete_background_image_idx" ON "pages_blocks_section_entete" USING btree ("background_image_id");
  CREATE INDEX "pages_blocks_stats_items_order_idx" ON "pages_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_items_parent_id_idx" ON "pages_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_order_idx" ON "pages_blocks_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_parent_id_idx" ON "pages_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_path_idx" ON "pages_blocks_stats" USING btree ("_path");
  CREATE INDEX "pages_blocks_feature_section_order_idx" ON "pages_blocks_feature_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_section_parent_id_idx" ON "pages_blocks_feature_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_section_path_idx" ON "pages_blocks_feature_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_event_grid_manual_events_order_idx" ON "pages_blocks_event_grid_manual_events" USING btree ("_order");
  CREATE INDEX "pages_blocks_event_grid_manual_events_parent_id_idx" ON "pages_blocks_event_grid_manual_events" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_event_grid_manual_events_image_idx" ON "pages_blocks_event_grid_manual_events" USING btree ("image_id");
  CREATE INDEX "pages_blocks_event_grid_order_idx" ON "pages_blocks_event_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_event_grid_parent_id_idx" ON "pages_blocks_event_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_event_grid_path_idx" ON "pages_blocks_event_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_text_ctas_order_idx" ON "pages_blocks_image_text_ctas" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_text_ctas_parent_id_idx" ON "pages_blocks_image_text_ctas" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_text_order_idx" ON "pages_blocks_image_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_text_parent_id_idx" ON "pages_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_text_path_idx" ON "pages_blocks_image_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_text_image_idx" ON "pages_blocks_image_text" USING btree ("image_id");
  CREATE INDEX "pages_blocks_timeline_steps_order_idx" ON "pages_blocks_timeline_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_steps_parent_id_idx" ON "pages_blocks_timeline_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_order_idx" ON "pages_blocks_timeline" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_parent_id_idx" ON "pages_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_path_idx" ON "pages_blocks_timeline" USING btree ("_path");
  CREATE INDEX "pages_blocks_alsace_events_map_order_idx" ON "pages_blocks_alsace_events_map" USING btree ("_order");
  CREATE INDEX "pages_blocks_alsace_events_map_parent_id_idx" ON "pages_blocks_alsace_events_map" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_alsace_events_map_path_idx" ON "pages_blocks_alsace_events_map" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_section_entete_order_idx" ON "_pages_v_blocks_section_entete" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_section_entete_parent_id_idx" ON "_pages_v_blocks_section_entete" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_section_entete_path_idx" ON "_pages_v_blocks_section_entete" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_section_entete_background_image_idx" ON "_pages_v_blocks_section_entete" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_blocks_stats_items_order_idx" ON "_pages_v_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_items_parent_id_idx" ON "_pages_v_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_order_idx" ON "_pages_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_parent_id_idx" ON "_pages_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_path_idx" ON "_pages_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_feature_section_order_idx" ON "_pages_v_blocks_feature_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_section_parent_id_idx" ON "_pages_v_blocks_feature_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_section_path_idx" ON "_pages_v_blocks_feature_section" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_event_grid_manual_events_order_idx" ON "_pages_v_blocks_event_grid_manual_events" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_event_grid_manual_events_parent_id_idx" ON "_pages_v_blocks_event_grid_manual_events" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_event_grid_manual_events_image_idx" ON "_pages_v_blocks_event_grid_manual_events" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_event_grid_order_idx" ON "_pages_v_blocks_event_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_event_grid_parent_id_idx" ON "_pages_v_blocks_event_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_event_grid_path_idx" ON "_pages_v_blocks_event_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_text_ctas_order_idx" ON "_pages_v_blocks_image_text_ctas" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_text_ctas_parent_id_idx" ON "_pages_v_blocks_image_text_ctas" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_text_order_idx" ON "_pages_v_blocks_image_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_text_parent_id_idx" ON "_pages_v_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_text_path_idx" ON "_pages_v_blocks_image_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_text_image_idx" ON "_pages_v_blocks_image_text" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_timeline_steps_order_idx" ON "_pages_v_blocks_timeline_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_steps_parent_id_idx" ON "_pages_v_blocks_timeline_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_order_idx" ON "_pages_v_blocks_timeline" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_parent_id_idx" ON "_pages_v_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_path_idx" ON "_pages_v_blocks_timeline" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_alsace_events_map_order_idx" ON "_pages_v_blocks_alsace_events_map" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_alsace_events_map_parent_id_idx" ON "_pages_v_blocks_alsace_events_map" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_alsace_events_map_path_idx" ON "_pages_v_blocks_alsace_events_map" USING btree ("_path");
  CREATE INDEX "events_courses_order_idx" ON "events_courses" USING btree ("_order");
  CREATE INDEX "events_courses_parent_id_idx" ON "events_courses" USING btree ("_parent_id");
  CREATE INDEX "events_courses_image_idx" ON "events_courses" USING btree ("image_id");
  CREATE INDEX "events_courses_gpx_idx" ON "events_courses" USING btree ("gpx_id");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_rels_events_id_idx" ON "pages_rels" USING btree ("events_id");
  CREATE INDEX "_pages_v_rels_events_id_idx" ON "_pages_v_rels" USING btree ("events_id");
  CREATE INDEX "events_image_idx" ON "events" USING btree ("image_id");
  CREATE INDEX "header_nav_items_icon_idx" ON "header_nav_items" USING btree ("icon_id");
  ALTER TABLE "pages_blocks_home_hero" DROP COLUMN "headline";
  ALTER TABLE "pages_blocks_home_hero" DROP COLUMN "highlight_text";
  ALTER TABLE "_pages_v_blocks_home_hero" DROP COLUMN "headline";
  ALTER TABLE "_pages_v_blocks_home_hero" DROP COLUMN "highlight_text";
  ALTER TABLE "events" DROP COLUMN "date";
  ALTER TABLE "events" DROP COLUMN "distance";
  ALTER TABLE "events" DROP COLUMN "elevation_gain";
  ALTER TABLE "events" DROP COLUMN "gpx_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_section_entete" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_stats_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_feature_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_event_grid_manual_events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_event_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_image_text_ctas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_image_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_timeline_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_alsace_events_map" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_section_entete" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_stats_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_feature_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_event_grid_manual_events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_event_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_image_text_ctas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_image_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_timeline_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_alsace_events_map" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_courses" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_section_entete" CASCADE;
  DROP TABLE "pages_blocks_stats_items" CASCADE;
  DROP TABLE "pages_blocks_stats" CASCADE;
  DROP TABLE "pages_blocks_feature_section" CASCADE;
  DROP TABLE "pages_blocks_event_grid_manual_events" CASCADE;
  DROP TABLE "pages_blocks_event_grid" CASCADE;
  DROP TABLE "pages_blocks_image_text_ctas" CASCADE;
  DROP TABLE "pages_blocks_image_text" CASCADE;
  DROP TABLE "pages_blocks_timeline_steps" CASCADE;
  DROP TABLE "pages_blocks_timeline" CASCADE;
  DROP TABLE "pages_blocks_alsace_events_map" CASCADE;
  DROP TABLE "_pages_v_blocks_section_entete" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_items" CASCADE;
  DROP TABLE "_pages_v_blocks_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_section" CASCADE;
  DROP TABLE "_pages_v_blocks_event_grid_manual_events" CASCADE;
  DROP TABLE "_pages_v_blocks_event_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_image_text_ctas" CASCADE;
  DROP TABLE "_pages_v_blocks_image_text" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline" CASCADE;
  DROP TABLE "_pages_v_blocks_alsace_events_map" CASCADE;
  DROP TABLE "events_courses" CASCADE;
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_events_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_events_fk";
  
  ALTER TABLE "events" DROP CONSTRAINT "events_image_id_media_id_fk";
  
  ALTER TABLE "header_nav_items" DROP CONSTRAINT "header_nav_items_icon_id_media_id_fk";
  
  DROP INDEX "pages_rels_events_id_idx";
  DROP INDEX "_pages_v_rels_events_id_idx";
  DROP INDEX "events_image_idx";
  DROP INDEX "header_nav_items_icon_idx";
  ALTER TABLE "events" ALTER COLUMN "tenant_id" SET NOT NULL;
  ALTER TABLE "pages_blocks_home_hero" ADD COLUMN "headline" varchar DEFAULT 'Toutes les sorties trail & course à pied';
  ALTER TABLE "pages_blocks_home_hero" ADD COLUMN "highlight_text" varchar DEFAULT 'officielles... ou pas !';
  ALTER TABLE "_pages_v_blocks_home_hero" ADD COLUMN "headline" varchar DEFAULT 'Toutes les sorties trail & course à pied';
  ALTER TABLE "_pages_v_blocks_home_hero" ADD COLUMN "highlight_text" varchar DEFAULT 'officielles... ou pas !';
  ALTER TABLE "events" ADD COLUMN "date" timestamp(3) with time zone NOT NULL;
  ALTER TABLE "events" ADD COLUMN "distance" numeric;
  ALTER TABLE "events" ADD COLUMN "elevation_gain" numeric;
  ALTER TABLE "events" ADD COLUMN "gpx_id" integer;
  ALTER TABLE "events" ADD CONSTRAINT "events_gpx_id_media_id_fk" FOREIGN KEY ("gpx_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "events_gpx_idx" ON "events" USING btree ("gpx_id");
  ALTER TABLE "pages_blocks_home_hero" DROP COLUMN "headline_styled";
  ALTER TABLE "pages_rels" DROP COLUMN "events_id";
  ALTER TABLE "_pages_v_blocks_home_hero" DROP COLUMN "headline_styled";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "events_id";
  ALTER TABLE "events" DROP COLUMN "start_date";
  ALTER TABLE "events" DROP COLUMN "end_date";
  ALTER TABLE "events" DROP COLUMN "image_id";
  ALTER TABLE "header_nav_items" DROP COLUMN "icon_id";
  ALTER TABLE "header_nav_items" DROP COLUMN "style";
  DROP TYPE "public"."enum_pages_blocks_image_text_layout";
  DROP TYPE "public"."enum__pages_v_blocks_image_text_layout";
  DROP TYPE "public"."enum_events_courses_type";
  DROP TYPE "public"."enum_events_courses_level";
  DROP TYPE "public"."enum_header_nav_items_style";`)
}
