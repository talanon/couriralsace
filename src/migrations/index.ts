import * as migration_20260210_190143 from './20260210_190143';
import * as migration_20260210_215939_add_missing_pages_schema from './20260210_215939_add_missing_pages_schema';

export const migrations = [
  {
    up: migration_20260210_190143.up,
    down: migration_20260210_190143.down,
    name: '20260210_190143',
  },
  {
    up: migration_20260210_215939_add_missing_pages_schema.up,
    down: migration_20260210_215939_add_missing_pages_schema.down,
    name: '20260210_215939_add_missing_pages_schema'
  },
];
