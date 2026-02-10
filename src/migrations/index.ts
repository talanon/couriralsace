import * as migration_20260210_190143 from './20260210_190143';

export const migrations = [
  {
    up: migration_20260210_190143.up,
    down: migration_20260210_190143.down,
    name: '20260210_190143'
  },
];
