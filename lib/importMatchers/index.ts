import type { MatchResult, NormalizedImportRow } from '../importTypes';
import type { MatchContext } from '../importMatcher';
import { matchAccessoryRow } from './matchAccessoryRow';
import { matchEpsPlateRow } from './matchEpsPlateRow';
import { matchFastenerProfileRow } from './matchFastenerProfileRow';
import { matchTasyunuPlateRow } from './matchTasyunuPlateRow';

export function dispatchMatchImportRow(
    row: NormalizedImportRow,
    ctx: MatchContext,
): MatchResult {
    switch (row.productClass) {
        case 'eps_plate':
            return matchEpsPlateRow(row, ctx.plates, ctx.platePrices, ctx.brands, ctx.materialTypes);
        case 'tasyunu_plate':
            return matchTasyunuPlateRow(row, ctx.plates, ctx.platePrices, ctx.brands, ctx.materialTypes);
        case 'adhesive':
        case 'render':
        case 'mesh':
        case 'coating':
        case 'primer':
            return matchAccessoryRow(row, ctx.accessories, ctx.brands, ctx.accessoryTypes);
        case 'dowel':
        case 'corner_profile':
        case 'fuga_profile':
        case 'pvc_profile':
            return matchFastenerProfileRow(row, ctx.accessories, ctx.brands, ctx.accessoryTypes);
        default:
            if (row.productType === 'plate') {
                return row.materialType === 'tasyunu'
                    ? matchTasyunuPlateRow(row, ctx.plates, ctx.platePrices, ctx.brands, ctx.materialTypes)
                    : matchEpsPlateRow(row, ctx.plates, ctx.platePrices, ctx.brands, ctx.materialTypes);
            }
            return matchAccessoryRow(row, ctx.accessories, ctx.brands, ctx.accessoryTypes);
    }
}

export {
    matchAccessoryRow,
    matchEpsPlateRow,
    matchFastenerProfileRow,
    matchTasyunuPlateRow,
};
