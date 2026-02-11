import * as migration_20260210_190143 from './20260210_190143';
import * as migration_20260210_215939_add_missing_pages_schema from './20260210_215939_add_missing_pages_schema';
import * as migration_20260211_090104 from './20260211_090104';

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
    name: '20260211_090104'
  },
];
