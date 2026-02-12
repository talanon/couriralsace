import * as migration_20260210_190143 from './20260210_190143';
import * as migration_20260210_215939_add_missing_pages_schema from './20260210_215939_add_missing_pages_schema';
import * as migration_20260211_090104 from './20260211_090104';
import * as migration_20260211_205014_add_events_courses_structure from './20260211_205014_add_events_courses_structure';
import * as migration_20260212_161803_modify_structure from './20260212_161803_modify_structure';
import * as migration_20260212_171800_convert_events_description_to_richtext from './20260212_171800_convert_events_description_to_richtext';
import * as migration_20260212_172900_convert_image_text_description_to_richtext from './20260212_172900_convert_image_text_description_to_richtext';

export const migrations = [
  {
    up: migration_20260210_190143.up,
    down: migration_20260210_190143.down,
    name: '20260210_190143',
  },
  {
    up: migration_20260210_215939_add_missing_pages_schema.up,
    down: migration_20260210_215939_add_missing_pages_schema.down,
    name: '20260210_215939_add_missing_pages_schema',
  },
  {
    up: migration_20260211_090104.up,
    down: migration_20260211_090104.down,
    name: '20260211_090104',
  },
  {
    up: migration_20260211_205014_add_events_courses_structure.up,
    down: migration_20260211_205014_add_events_courses_structure.down,
    name: '20260211_205014_add_events_courses_structure',
  },
  {
    up: migration_20260212_161803_modify_structure.up,
    down: migration_20260212_161803_modify_structure.down,
    name: '20260212_161803_modify_structure',
  },
  {
    up: migration_20260212_171800_convert_events_description_to_richtext.up,
    down: migration_20260212_171800_convert_events_description_to_richtext.down,
    name: '20260212_171800_convert_events_description_to_richtext',
  },
  {
    up: migration_20260212_172900_convert_image_text_description_to_richtext.up,
    down: migration_20260212_172900_convert_image_text_description_to_richtext.down,
    name: '20260212_172900_convert_image_text_description_to_richtext',
  },
];
