import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$
   BEGIN
     IF EXISTS (
       SELECT 1
       FROM information_schema.columns
       WHERE table_schema = 'public'
         AND table_name = 'pages_blocks_image_text'
         AND column_name = 'description'
         AND udt_name <> 'jsonb'
     ) THEN
       ALTER TABLE "pages_blocks_image_text"
       ALTER COLUMN "description" SET DATA TYPE jsonb
       USING CASE
         WHEN "description" IS NULL OR btrim("description") = '' THEN NULL
         ELSE jsonb_build_object(
           'root',
           jsonb_build_object(
             'type', 'root',
             'children', jsonb_build_array(
               jsonb_build_object(
                 'type', 'paragraph',
                 'children', jsonb_build_array(
                   jsonb_build_object(
                     'type', 'text',
                     'text', "description",
                     'detail', 0,
                     'format', 0,
                     'mode', 'normal',
                     'style', '',
                     'version', 1
                   )
                 ),
                 'direction', 'ltr',
                 'format', '',
                 'indent', 0,
                 'textFormat', 0,
                 'textStyle', '',
                 'version', 1
               )
             ),
             'direction', 'ltr',
             'format', '',
             'indent', 0,
             'version', 1
           )
         )
       END;
     END IF;

     IF EXISTS (
       SELECT 1
       FROM information_schema.columns
       WHERE table_schema = 'public'
         AND table_name = '_pages_v_blocks_image_text'
         AND column_name = 'description'
         AND udt_name <> 'jsonb'
     ) THEN
       ALTER TABLE "_pages_v_blocks_image_text"
       ALTER COLUMN "description" SET DATA TYPE jsonb
       USING CASE
         WHEN "description" IS NULL OR btrim("description") = '' THEN NULL
         ELSE jsonb_build_object(
           'root',
           jsonb_build_object(
             'type', 'root',
             'children', jsonb_build_array(
               jsonb_build_object(
                 'type', 'paragraph',
                 'children', jsonb_build_array(
                   jsonb_build_object(
                     'type', 'text',
                     'text', "description",
                     'detail', 0,
                     'format', 0,
                     'mode', 'normal',
                     'style', '',
                     'version', 1
                   )
                 ),
                 'direction', 'ltr',
                 'format', '',
                 'indent', 0,
                 'textFormat', 0,
                 'textStyle', '',
                 'version', 1
               )
             ),
             'direction', 'ltr',
             'format', '',
             'indent', 0,
             'version', 1
           )
         )
       END;
     END IF;
   END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DO $$
   BEGIN
     IF EXISTS (
       SELECT 1
       FROM information_schema.columns
       WHERE table_schema = 'public'
         AND table_name = 'pages_blocks_image_text'
         AND column_name = 'description'
         AND udt_name <> 'text'
     ) THEN
       ALTER TABLE "pages_blocks_image_text"
       ALTER COLUMN "description" SET DATA TYPE text
       USING CASE
         WHEN "description" IS NULL THEN NULL
         ELSE "description"::text
       END;
     END IF;

     IF EXISTS (
       SELECT 1
       FROM information_schema.columns
       WHERE table_schema = 'public'
         AND table_name = '_pages_v_blocks_image_text'
         AND column_name = 'description'
         AND udt_name <> 'text'
     ) THEN
       ALTER TABLE "_pages_v_blocks_image_text"
       ALTER COLUMN "description" SET DATA TYPE text
       USING CASE
         WHEN "description" IS NULL THEN NULL
         ELSE "description"::text
       END;
     END IF;
   END $$;
  `)
}
