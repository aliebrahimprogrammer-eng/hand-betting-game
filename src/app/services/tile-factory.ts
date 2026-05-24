import { TileDefinition, TileInstance } from '../models/tile.model';

const NUMBER_TILES: TileDefinition[] = [
  { id: 'dots-1', label: '1 Dot', symbol: '🀙', type: 'number', baseValue: 1 },
  { id: 'dots-2', label: '2 Dot', symbol: '🀚', type: 'number', baseValue: 2 },
  { id: 'dots-3', label: '3 Dot', symbol: '🀛', type: 'number', baseValue: 3 },
  { id: 'dots-4', label: '4 Dot', symbol: '🀜', type: 'number', baseValue: 4 },
  { id: 'dots-5', label: '5 Dot', symbol: '🀝', type: 'number', baseValue: 5 },
  { id: 'dots-6', label: '6 Dot', symbol: '🀞', type: 'number', baseValue: 6 },
  { id: 'dots-7', label: '7 Dot', symbol: '🀟', type: 'number', baseValue: 7 },
  { id: 'dots-8', label: '8 Dot', symbol: '🀠', type: 'number', baseValue: 8 },
  { id: 'dots-9', label: '9 Dot', symbol: '🀡', type: 'number', baseValue: 9 },

  { id: 'bamboo-1', label: '1 Bamboo', symbol: '🀐', type: 'number', baseValue: 1 },
  { id: 'bamboo-2', label: '2 Bamboo', symbol: '🀑', type: 'number', baseValue: 2 },
  { id: 'bamboo-3', label: '3 Bamboo', symbol: '🀒', type: 'number', baseValue: 3 },
  { id: 'bamboo-4', label: '4 Bamboo', symbol: '🀓', type: 'number', baseValue: 4 },
  { id: 'bamboo-5', label: '5 Bamboo', symbol: '🀔', type: 'number', baseValue: 5 },
  { id: 'bamboo-6', label: '6 Bamboo', symbol: '🀕', type: 'number', baseValue: 6 },
  { id: 'bamboo-7', label: '7 Bamboo', symbol: '🀖', type: 'number', baseValue: 7 },
  { id: 'bamboo-8', label: '8 Bamboo', symbol: '🀗', type: 'number', baseValue: 8 },
  { id: 'bamboo-9', label: '9 Bamboo', symbol: '🀘', type: 'number', baseValue: 9 },

  { id: 'characters-1', label: '1 Character', symbol: '🀇', type: 'number', baseValue: 1 },
  { id: 'characters-2', label: '2 Character', symbol: '🀈', type: 'number', baseValue: 2 },
  { id: 'characters-3', label: '3 Character', symbol: '🀉', type: 'number', baseValue: 3 },
  { id: 'characters-4', label: '4 Character', symbol: '🀊', type: 'number', baseValue: 4 },
  { id: 'characters-5', label: '5 Character', symbol: '🀋', type: 'number', baseValue: 5 },
  { id: 'characters-6', label: '6 Character', symbol: '🀌', type: 'number', baseValue: 6 },
  { id: 'characters-7', label: '7 Character', symbol: '🀍', type: 'number', baseValue: 7 },
  { id: 'characters-8', label: '8 Character', symbol: '🀎', type: 'number', baseValue: 8 },
  { id: 'characters-9', label: '9 Character', symbol: '🀏', type: 'number', baseValue: 9 },
];

const HONOR_TILES: TileDefinition[] = [
  { id: 'wind-east', label: 'East Wind', symbol: '🀀', type: 'honor', baseValue: 5 },
  { id: 'wind-south', label: 'South Wind', symbol: '🀁', type: 'honor', baseValue: 5 },
  { id: 'wind-west', label: 'West Wind', symbol: '🀂', type: 'honor', baseValue: 5 },
  { id: 'wind-north', label: 'North Wind', symbol: '🀃', type: 'honor', baseValue: 5 },
  { id: 'dragon-red', label: 'Red Dragon', symbol: '🀄', type: 'honor', baseValue: 5 },
  { id: 'dragon-green', label: 'Green Dragon', symbol: '🀅', type: 'honor', baseValue: 5 },
  { id: 'dragon-white', label: 'White Dragon', symbol: '🀆', type: 'honor', baseValue: 5 },
];

export const TILE_DEFINITIONS: TileDefinition[] = [...NUMBER_TILES, ...HONOR_TILES];

export function createInitialHonorValues(): Record<string, number> {
  return HONOR_TILES.reduce<Record<string, number>>((values, tile) => {
    values[tile.id] = 5;
    return values;
  }, {});
}

export function createDeck(honorValues: Record<string, number>): TileInstance[] {
  const deck: TileInstance[] = [];

  for (const tile of TILE_DEFINITIONS) {
    for (let copy = 0; copy < 4; copy++) {
      deck.push({
        ...tile,
        instanceId: `${tile.id}-${copy}-${crypto.randomUUID()}`,
        value: tile.type === 'number' ? tile.baseValue : honorValues[tile.id],
      });
    }
  }

  return shuffle(deck);
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[randomIndex]] = [copy[randomIndex], copy[i]];
  }

  return copy;
}