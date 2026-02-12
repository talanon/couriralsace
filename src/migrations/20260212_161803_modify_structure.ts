import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_section_entete_left_button_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_section_entete_right_button_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_event_grid_event_source_mode" AS ENUM('currentEventCourses', 'otherEventsCourses', 'manualSelection');
  CREATE TYPE "public"."enum__pages_v_blocks_section_entete_left_button_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_section_entete_right_button_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_event_grid_event_source_mode" AS ENUM('currentEventCourses', 'otherEventsCourses', 'manualSelection');
  CREATE TYPE "public"."enum_header_nav_items_icon" AS ENUM('bell', 'phone', 'compass', 'shopping-bag', 'calendar-days', 'camera', 'gift', 'target', 'map-pin', 'clock-3', 'dumbbell', 'users', 'message-circle', 'footprints', 'bike', 'arrow-right', 'ruler-dimension-line', 'circle-help', 'heart-pulse', 'zap', 'sparkles', 'info', 'check-circle-2', 'external-link', 'mail', 'menu', 'mountain', 'mountain-snow', 'rocket', 'flag', 'route', 'heart-handshake', 'gauge', 'play', 'plus', 'shield-check', 'megaphone', 'award', 'search', 'chevron-right', 'trophy', 'smile', 'landmark', 'star', 'leaf', 'ticket', 'eye', 'carrot', 'waves', 'x', 'home', 'newspaper', 'medal');
  ALTER TYPE "public"."enum_pages_template" ADD VALUE 'event';
  ALTER TYPE "public"."enum__pages_v_version_template" ADD VALUE 'event';
  CREATE TABLE "pages_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "_pages_v_version_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "event_template" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"template_page_id" integer,
  	"help" varchar DEFAULT '{{event.title}}
  {{event.startDate}}
  {{event.endDate}}
  {{event.dateRange}}
  {{event.location}}
  {{event.description}}
  {{event.registrationLink}}
  {{event.slug}}
  {{event.image}}
  {{event.imageUrl}}
  {{event.imageAlt}}
  {{event.courseCount}}
  {{event.firstCourse.title}}
  {{event.firstCourse.date}}
  {{event.firstCourse.location}}
  {{event.firstCourse.distance}}
  {{event.firstCourse.elevationGain}}
  {{event.firstCourse.type}}
  {{event.firstCourse.image}}
  {{event.firstCourse.imageUrl}}',
  	"content" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages_blocks_stats_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_feature_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_stats_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_feature_section" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_stats_items" CASCADE;
  DROP TABLE "pages_blocks_stats" CASCADE;
  DROP TABLE "pages_blocks_feature_section" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_items" CASCADE;
  DROP TABLE "_pages_v_blocks_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_section" CASCADE;
  ALTER TABLE "pages_blocks_section_entete" DROP CONSTRAINT "pages_blocks_section_entete_background_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_section_entete" DROP CONSTRAINT "_pages_v_blocks_section_entete_background_image_id_media_id_fk";
  
  ALTER TABLE "header_nav_items" DROP CONSTRAINT "header_nav_items_icon_id_media_id_fk";
  
  DROP INDEX "pages_blocks_section_entete_background_image_idx";
  DROP INDEX "_pages_v_blocks_section_entete_background_image_idx";
  DROP INDEX "header_nav_items_icon_idx";
  ALTER TABLE "events" ALTER COLUMN "description" SET DATA TYPE jsonb;
  ALTER TABLE "pages_blocks_section_entete" ADD COLUMN "left_title" varchar DEFAULT 'LE FIL
  DES COURSES
  & SOCIAL RUN
  <green>EN ALSACE</green>';
  ALTER TABLE "pages_blocks_section_entete" ADD COLUMN "left_description" varchar;
  ALTER TABLE "pages_blocks_section_entete" ADD COLUMN "left_button_label" varchar DEFAULT 'Trouver une sortie';
  ALTER TABLE "pages_blocks_section_entete" ADD COLUMN "left_button_type" "enum_pages_blocks_section_entete_left_button_type" DEFAULT 'reference';
  ALTER TABLE "pages_blocks_section_entete" ADD COLUMN "left_button_reference_id" integer;
  ALTER TABLE "pages_blocks_section_entete" ADD COLUMN "left_button_url" varchar;
  ALTER TABLE "pages_blocks_section_entete" ADD COLUMN "right_image_id" integer;
  ALTER TABLE "pages_blocks_section_entete" ADD COLUMN "featured_event_id" integer;
  ALTER TABLE "pages_blocks_section_entete" ADD COLUMN "right_title" varchar DEFAULT 'CREEZ VOTRE EVENEMENT';
  ALTER TABLE "pages_blocks_section_entete" ADD COLUMN "right_description" varchar;
  ALTER TABLE "pages_blocks_section_entete" ADD COLUMN "right_button_label" varchar DEFAULT 'Proposer une sortie';
  ALTER TABLE "pages_blocks_section_entete" ADD COLUMN "right_button_type" "enum_pages_blocks_section_entete_right_button_type" DEFAULT 'reference';
  ALTER TABLE "pages_blocks_section_entete" ADD COLUMN "right_button_reference_id" integer;
  ALTER TABLE "pages_blocks_section_entete" ADD COLUMN "right_button_url" varchar;
  ALTER TABLE "pages_blocks_event_grid" ADD COLUMN "event_source_mode" "enum_pages_blocks_event_grid_event_source_mode" DEFAULT 'manualSelection';
  ALTER TABLE "pages_blocks_image_text" ADD COLUMN "use_event_image" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_media_block" ADD COLUMN "use_event_image" boolean DEFAULT false;
  ALTER TABLE "pages" ADD COLUMN "parent_id" integer;
  ALTER TABLE "_pages_v_blocks_section_entete" ADD COLUMN "left_title" varchar DEFAULT 'LE FIL
  DES COURSES
  & SOCIAL RUN
  <green>EN ALSACE</green>';
  ALTER TABLE "_pages_v_blocks_section_entete" ADD COLUMN "left_description" varchar;
  ALTER TABLE "_pages_v_blocks_section_entete" ADD COLUMN "left_button_label" varchar DEFAULT 'Trouver une sortie';
  ALTER TABLE "_pages_v_blocks_section_entete" ADD COLUMN "left_button_type" "enum__pages_v_blocks_section_entete_left_button_type" DEFAULT 'reference';
  ALTER TABLE "_pages_v_blocks_section_entete" ADD COLUMN "left_button_reference_id" integer;
  ALTER TABLE "_pages_v_blocks_section_entete" ADD COLUMN "left_button_url" varchar;
  ALTER TABLE "_pages_v_blocks_section_entete" ADD COLUMN "right_image_id" integer;
  ALTER TABLE "_pages_v_blocks_section_entete" ADD COLUMN "featured_event_id" integer;
  ALTER TABLE "_pages_v_blocks_section_entete" ADD COLUMN "right_title" varchar DEFAULT 'CREEZ VOTRE EVENEMENT';
  ALTER TABLE "_pages_v_blocks_section_entete" ADD COLUMN "right_description" varchar;
  ALTER TABLE "_pages_v_blocks_section_entete" ADD COLUMN "right_button_label" varchar DEFAULT 'Proposer une sortie';
  ALTER TABLE "_pages_v_blocks_section_entete" ADD COLUMN "right_button_type" "enum__pages_v_blocks_section_entete_right_button_type" DEFAULT 'reference';
  ALTER TABLE "_pages_v_blocks_section_entete" ADD COLUMN "right_button_reference_id" integer;
  ALTER TABLE "_pages_v_blocks_section_entete" ADD COLUMN "right_button_url" varchar;
  ALTER TABLE "_pages_v_blocks_event_grid" ADD COLUMN "event_source_mode" "enum__pages_v_blocks_event_grid_event_source_mode" DEFAULT 'manualSelection';
  ALTER TABLE "_pages_v_blocks_image_text" ADD COLUMN "use_event_image" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN "use_event_image" boolean DEFAULT false;
  ALTER TABLE "_pages_v" ADD COLUMN "version_parent_id" integer;
  ALTER TABLE "header_nav_items" ADD COLUMN "icon" "enum_header_nav_items_icon";
  ALTER TABLE "pages_breadcrumbs" ADD CONSTRAINT "pages_breadcrumbs_doc_id_pages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_breadcrumbs" ADD CONSTRAINT "pages_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_breadcrumbs" ADD CONSTRAINT "_pages_v_version_breadcrumbs_doc_id_pages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_breadcrumbs" ADD CONSTRAINT "_pages_v_version_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "event_template" ADD CONSTRAINT "event_template_template_page_id_pages_id_fk" FOREIGN KEY ("template_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_breadcrumbs_order_idx" ON "pages_breadcrumbs" USING btree ("_order");
  CREATE INDEX "pages_breadcrumbs_parent_id_idx" ON "pages_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "pages_breadcrumbs_doc_idx" ON "pages_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "_pages_v_version_breadcrumbs_order_idx" ON "_pages_v_version_breadcrumbs" USING btree ("_order");
  CREATE INDEX "_pages_v_version_breadcrumbs_parent_id_idx" ON "_pages_v_version_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_breadcrumbs_doc_idx" ON "_pages_v_version_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "event_template_template_page_idx" ON "event_template" USING btree ("template_page_id");
  ALTER TABLE "pages_blocks_section_entete" ADD CONSTRAINT "pages_blocks_section_entete_left_button_reference_id_pages_id_fk" FOREIGN KEY ("left_button_reference_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_section_entete" ADD CONSTRAINT "pages_blocks_section_entete_right_image_id_media_id_fk" FOREIGN KEY ("right_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_section_entete" ADD CONSTRAINT "pages_blocks_section_entete_featured_event_id_events_id_fk" FOREIGN KEY ("featured_event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_section_entete" ADD CONSTRAINT "pages_blocks_section_entete_right_button_reference_id_pages_id_fk" FOREIGN KEY ("right_button_reference_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_section_entete" ADD CONSTRAINT "_pages_v_blocks_section_entete_left_button_reference_id_pages_id_fk" FOREIGN KEY ("left_button_reference_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_section_entete" ADD CONSTRAINT "_pages_v_blocks_section_entete_right_image_id_media_id_fk" FOREIGN KEY ("right_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_section_entete" ADD CONSTRAINT "_pages_v_blocks_section_entete_featured_event_id_events_id_fk" FOREIGN KEY ("featured_event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_section_entete" ADD CONSTRAINT "_pages_v_blocks_section_entete_right_button_reference_id_pages_id_fk" FOREIGN KEY ("right_button_reference_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_parent_id_pages_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_section_entete_left_button_left_button_refe_idx" ON "pages_blocks_section_entete" USING btree ("left_button_reference_id");
  CREATE INDEX "pages_blocks_section_entete_right_image_idx" ON "pages_blocks_section_entete" USING btree ("right_image_id");
  CREATE INDEX "pages_blocks_section_entete_featured_event_idx" ON "pages_blocks_section_entete" USING btree ("featured_event_id");
  CREATE INDEX "pages_blocks_section_entete_right_button_right_button_re_idx" ON "pages_blocks_section_entete" USING btree ("right_button_reference_id");
  CREATE INDEX "pages_parent_idx" ON "pages" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_section_entete_left_button_left_button_r_idx" ON "_pages_v_blocks_section_entete" USING btree ("left_button_reference_id");
  CREATE INDEX "_pages_v_blocks_section_entete_right_image_idx" ON "_pages_v_blocks_section_entete" USING btree ("right_image_id");
  CREATE INDEX "_pages_v_blocks_section_entete_featured_event_idx" ON "_pages_v_blocks_section_entete" USING btree ("featured_event_id");
  CREATE INDEX "_pages_v_blocks_section_entete_right_button_right_button_idx" ON "_pages_v_blocks_section_entete" USING btree ("right_button_reference_id");
  CREATE INDEX "_pages_v_version_version_parent_idx" ON "_pages_v" USING btree ("version_parent_id");
  ALTER TABLE "pages_blocks_section_entete" DROP COLUMN "cta_label";
  ALTER TABLE "pages_blocks_section_entete" DROP COLUMN "cta_url";
  ALTER TABLE "pages_blocks_section_entete" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_section_entete" DROP COLUMN "highlighted_text";
  ALTER TABLE "pages_blocks_section_entete" DROP COLUMN "location";
  ALTER TABLE "pages_blocks_section_entete" DROP COLUMN "background_image_id";
  ALTER TABLE "pages_blocks_section_entete" DROP COLUMN "show_decorative_curves";
  ALTER TABLE "pages_blocks_section_entete" DROP COLUMN "curve_opacity";
  ALTER TABLE "pages_blocks_image_text" DROP COLUMN "show_decorative_curves";
  ALTER TABLE "_pages_v_blocks_section_entete" DROP COLUMN "cta_label";
  ALTER TABLE "_pages_v_blocks_section_entete" DROP COLUMN "cta_url";
  ALTER TABLE "_pages_v_blocks_section_entete" DROP COLUMN "title";
  ALTER TABLE "_pages_v_blocks_section_entete" DROP COLUMN "highlighted_text";
  ALTER TABLE "_pages_v_blocks_section_entete" DROP COLUMN "location";
  ALTER TABLE "_pages_v_blocks_section_entete" DROP COLUMN "background_image_id";
  ALTER TABLE "_pages_v_blocks_section_entete" DROP COLUMN "show_decorative_curves";
  ALTER TABLE "_pages_v_blocks_section_entete" DROP COLUMN "curve_opacity";
  ALTER TABLE "_pages_v_blocks_image_text" DROP COLUMN "show_decorative_curves";
  ALTER TABLE "header_nav_items" DROP COLUMN "icon_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
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
  
  ALTER TABLE "pages_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "event_template" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_breadcrumbs" CASCADE;
  DROP TABLE "_pages_v_version_breadcrumbs" CASCADE;
  DROP TABLE "event_template" CASCADE;
  ALTER TABLE "pages_blocks_section_entete" DROP CONSTRAINT "pages_blocks_section_entete_left_button_reference_id_pages_id_fk";
  
  ALTER TABLE "pages_blocks_section_entete" DROP CONSTRAINT "pages_blocks_section_entete_right_image_id_media_id_fk";
  
  ALTER TABLE "pages_blocks_section_entete" DROP CONSTRAINT "pages_blocks_section_entete_featured_event_id_events_id_fk";
  
  ALTER TABLE "pages_blocks_section_entete" DROP CONSTRAINT "pages_blocks_section_entete_right_button_reference_id_pages_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_parent_id_pages_id_fk";
  
  ALTER TABLE "_pages_v_blocks_section_entete" DROP CONSTRAINT "_pages_v_blocks_section_entete_left_button_reference_id_pages_id_fk";
  
  ALTER TABLE "_pages_v_blocks_section_entete" DROP CONSTRAINT "_pages_v_blocks_section_entete_right_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_section_entete" DROP CONSTRAINT "_pages_v_blocks_section_entete_featured_event_id_events_id_fk";
  
  ALTER TABLE "_pages_v_blocks_section_entete" DROP CONSTRAINT "_pages_v_blocks_section_entete_right_button_reference_id_pages_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_parent_id_pages_id_fk";
  
  ALTER TABLE "pages" ALTER COLUMN "template" SET DATA TYPE text;
  ALTER TABLE "pages" ALTER COLUMN "template" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum_pages_template";
  CREATE TYPE "public"."enum_pages_template" AS ENUM('default', 'hero');
  ALTER TABLE "pages" ALTER COLUMN "template" SET DEFAULT 'default'::"public"."enum_pages_template";
  ALTER TABLE "pages" ALTER COLUMN "template" SET DATA TYPE "public"."enum_pages_template" USING "template"::"public"."enum_pages_template";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_template" SET DATA TYPE text;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_template" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum__pages_v_version_template";
  CREATE TYPE "public"."enum__pages_v_version_template" AS ENUM('default', 'hero');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_template" SET DEFAULT 'default'::"public"."enum__pages_v_version_template";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_template" SET DATA TYPE "public"."enum__pages_v_version_template" USING "version_template"::"public"."enum__pages_v_version_template";
  DROP INDEX "pages_blocks_section_entete_left_button_left_button_refe_idx";
  DROP INDEX "pages_blocks_section_entete_right_image_idx";
  DROP INDEX "pages_blocks_section_entete_featured_event_idx";
  DROP INDEX "pages_blocks_section_entete_right_button_right_button_re_idx";
  DROP INDEX "pages_parent_idx";
  DROP INDEX "_pages_v_blocks_section_entete_left_button_left_button_r_idx";
  DROP INDEX "_pages_v_blocks_section_entete_right_image_idx";
  DROP INDEX "_pages_v_blocks_section_entete_featured_event_idx";
  DROP INDEX "_pages_v_blocks_section_entete_right_button_right_button_idx";
  DROP INDEX "_pages_v_version_version_parent_idx";
  ALTER TABLE "events" ALTER COLUMN "description" SET DATA TYPE varchar;
  ALTER TABLE "pages_blocks_section_entete" ADD COLUMN "cta_label" varchar DEFAULT 'Proposer une sortie';
  ALTER TABLE "pages_blocks_section_entete" ADD COLUMN "cta_url" varchar DEFAULT '/proposer';
  ALTER TABLE "pages_blocks_section_entete" ADD COLUMN "title" varchar DEFAULT 'TOUTES LES SORTIES';
  ALTER TABLE "pages_blocks_section_entete" ADD COLUMN "highlighted_text" varchar DEFAULT 'TRAIL & COURSE A PIED';
  ALTER TABLE "pages_blocks_section_entete" ADD COLUMN "location" varchar DEFAULT 'EN ALSACE';
  ALTER TABLE "pages_blocks_section_entete" ADD COLUMN "background_image_id" integer;
  ALTER TABLE "pages_blocks_section_entete" ADD COLUMN "show_decorative_curves" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_section_entete" ADD COLUMN "curve_opacity" varchar DEFAULT 'opacity-80';
  ALTER TABLE "pages_blocks_image_text" ADD COLUMN "show_decorative_curves" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_section_entete" ADD COLUMN "cta_label" varchar DEFAULT 'Proposer une sortie';
  ALTER TABLE "_pages_v_blocks_section_entete" ADD COLUMN "cta_url" varchar DEFAULT '/proposer';
  ALTER TABLE "_pages_v_blocks_section_entete" ADD COLUMN "title" varchar DEFAULT 'TOUTES LES SORTIES';
  ALTER TABLE "_pages_v_blocks_section_entete" ADD COLUMN "highlighted_text" varchar DEFAULT 'TRAIL & COURSE A PIED';
  ALTER TABLE "_pages_v_blocks_section_entete" ADD COLUMN "location" varchar DEFAULT 'EN ALSACE';
  ALTER TABLE "_pages_v_blocks_section_entete" ADD COLUMN "background_image_id" integer;
  ALTER TABLE "_pages_v_blocks_section_entete" ADD COLUMN "show_decorative_curves" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_section_entete" ADD COLUMN "curve_opacity" varchar DEFAULT 'opacity-80';
  ALTER TABLE "_pages_v_blocks_image_text" ADD COLUMN "show_decorative_curves" boolean DEFAULT true;
  ALTER TABLE "header_nav_items" ADD COLUMN "icon_id" integer;
  ALTER TABLE "pages_blocks_stats_items" ADD CONSTRAINT "pages_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_section" ADD CONSTRAINT "pages_blocks_feature_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_items" ADD CONSTRAINT "_pages_v_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats" ADD CONSTRAINT "_pages_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_section" ADD CONSTRAINT "_pages_v_blocks_feature_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_stats_items_order_idx" ON "pages_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_items_parent_id_idx" ON "pages_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_order_idx" ON "pages_blocks_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_parent_id_idx" ON "pages_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_path_idx" ON "pages_blocks_stats" USING btree ("_path");
  CREATE INDEX "pages_blocks_feature_section_order_idx" ON "pages_blocks_feature_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_section_parent_id_idx" ON "pages_blocks_feature_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_section_path_idx" ON "pages_blocks_feature_section" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_stats_items_order_idx" ON "_pages_v_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_items_parent_id_idx" ON "_pages_v_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_order_idx" ON "_pages_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_parent_id_idx" ON "_pages_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_path_idx" ON "_pages_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_feature_section_order_idx" ON "_pages_v_blocks_feature_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_section_parent_id_idx" ON "_pages_v_blocks_feature_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_section_path_idx" ON "_pages_v_blocks_feature_section" USING btree ("_path");
  ALTER TABLE "pages_blocks_section_entete" ADD CONSTRAINT "pages_blocks_section_entete_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_section_entete" ADD CONSTRAINT "_pages_v_blocks_section_entete_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_section_entete_background_image_idx" ON "pages_blocks_section_entete" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_blocks_section_entete_background_image_idx" ON "_pages_v_blocks_section_entete" USING btree ("background_image_id");
  CREATE INDEX "header_nav_items_icon_idx" ON "header_nav_items" USING btree ("icon_id");
  ALTER TABLE "pages_blocks_section_entete" DROP COLUMN "left_title";
  ALTER TABLE "pages_blocks_section_entete" DROP COLUMN "left_description";
  ALTER TABLE "pages_blocks_section_entete" DROP COLUMN "left_button_label";
  ALTER TABLE "pages_blocks_section_entete" DROP COLUMN "left_button_type";
  ALTER TABLE "pages_blocks_section_entete" DROP COLUMN "left_button_reference_id";
  ALTER TABLE "pages_blocks_section_entete" DROP COLUMN "left_button_url";
  ALTER TABLE "pages_blocks_section_entete" DROP COLUMN "right_image_id";
  ALTER TABLE "pages_blocks_section_entete" DROP COLUMN "featured_event_id";
  ALTER TABLE "pages_blocks_section_entete" DROP COLUMN "right_title";
  ALTER TABLE "pages_blocks_section_entete" DROP COLUMN "right_description";
  ALTER TABLE "pages_blocks_section_entete" DROP COLUMN "right_button_label";
  ALTER TABLE "pages_blocks_section_entete" DROP COLUMN "right_button_type";
  ALTER TABLE "pages_blocks_section_entete" DROP COLUMN "right_button_reference_id";
  ALTER TABLE "pages_blocks_section_entete" DROP COLUMN "right_button_url";
  ALTER TABLE "pages_blocks_event_grid" DROP COLUMN "event_source_mode";
  ALTER TABLE "pages_blocks_image_text" DROP COLUMN "use_event_image";
  ALTER TABLE "pages_blocks_media_block" DROP COLUMN "use_event_image";
  ALTER TABLE "pages" DROP COLUMN "parent_id";
  ALTER TABLE "_pages_v_blocks_section_entete" DROP COLUMN "left_title";
  ALTER TABLE "_pages_v_blocks_section_entete" DROP COLUMN "left_description";
  ALTER TABLE "_pages_v_blocks_section_entete" DROP COLUMN "left_button_label";
  ALTER TABLE "_pages_v_blocks_section_entete" DROP COLUMN "left_button_type";
  ALTER TABLE "_pages_v_blocks_section_entete" DROP COLUMN "left_button_reference_id";
  ALTER TABLE "_pages_v_blocks_section_entete" DROP COLUMN "left_button_url";
  ALTER TABLE "_pages_v_blocks_section_entete" DROP COLUMN "right_image_id";
  ALTER TABLE "_pages_v_blocks_section_entete" DROP COLUMN "featured_event_id";
  ALTER TABLE "_pages_v_blocks_section_entete" DROP COLUMN "right_title";
  ALTER TABLE "_pages_v_blocks_section_entete" DROP COLUMN "right_description";
  ALTER TABLE "_pages_v_blocks_section_entete" DROP COLUMN "right_button_label";
  ALTER TABLE "_pages_v_blocks_section_entete" DROP COLUMN "right_button_type";
  ALTER TABLE "_pages_v_blocks_section_entete" DROP COLUMN "right_button_reference_id";
  ALTER TABLE "_pages_v_blocks_section_entete" DROP COLUMN "right_button_url";
  ALTER TABLE "_pages_v_blocks_event_grid" DROP COLUMN "event_source_mode";
  ALTER TABLE "_pages_v_blocks_image_text" DROP COLUMN "use_event_image";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "use_event_image";
  ALTER TABLE "_pages_v" DROP COLUMN "version_parent_id";
  ALTER TABLE "header_nav_items" DROP COLUMN "icon";
  DROP TYPE "public"."enum_pages_blocks_section_entete_left_button_type";
  DROP TYPE "public"."enum_pages_blocks_section_entete_right_button_type";
  DROP TYPE "public"."enum_pages_blocks_event_grid_event_source_mode";
  DROP TYPE "public"."enum__pages_v_blocks_section_entete_left_button_type";
  DROP TYPE "public"."enum__pages_v_blocks_section_entete_right_button_type";
  DROP TYPE "public"."enum__pages_v_blocks_event_grid_event_source_mode";
  DROP TYPE "public"."enum_header_nav_items_icon";`)
}
