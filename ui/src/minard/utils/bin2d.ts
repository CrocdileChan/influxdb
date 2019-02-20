import {extent, range} from 'd3-array'

import {Table, ColumnType, AestheticDataMappings} from 'src/minard'

const MAPPINGS = {
  xMin: 'xMin',
  xMax: 'xMax',
  yMin: 'yMin',
  yMax: 'yMax',
  fill: 'count',
}

export const bin2d = (
  table: Table,
  xColName: string,
  xDomain: [number, number],
  yColName: string,
  yDomain: [number, number],
  width: number,
  height: number,
  binSize: number
): [Table, AestheticDataMappings] => {
  if (!xDomain) {
    xDomain = extent(table.columns[xColName])
  }

  if (!yDomain) {
    yDomain = extent(table.columns[yColName])
  }

  const xBinCount = Math.floor(width / binSize)
  const yBinCount = Math.floor(height / binSize)

  // Count occurences in each bin in a `xBinCount` by `yBinCount` matrix
  //
  //                 4th y bin
  //
  //                     │
  //                     │
  //                     v
  //       [
  //           [0, 1, 2, 0, 0],
  //           [0, 1, 0, 2, 0],  <──── 2nd x bin
  //           [1, 0, 5, 7, 3]
  //       ]
  //
  const bins = range(xBinCount).map(__ => new Array(yBinCount).fill(0))
  const n = table.columns[xColName].length

  for (let i = 0; i < n; i++) {
    const x = table.columns[xColName][i]
    const y = table.columns[yColName][i]

    const shouldSkipPoint =
      !x ||
      !y ||
      x < xDomain[0] ||
      x > xDomain[1] ||
      y < yDomain[0] ||
      y > yDomain[1]

    if (shouldSkipPoint) {
      continue
    }

    const xBinIndex = getBinIndex(x, xDomain, xBinCount)
    const yBinIndex = getBinIndex(y, yDomain, yBinCount)

    bins[xBinIndex][yBinIndex] += 1
  }

  // Now build a `Table` from that matrix
  const statTable = createEmptyStatTable()
  const xBinWidth = (xDomain[1] - xDomain[0]) / xBinCount
  const yBinWidth = (yDomain[1] - yDomain[0]) / yBinCount

  for (let i = 0; i < xBinCount; i++) {
    for (let j = 0; j < yBinCount; j++) {
      statTable.columns.xMin.push(xDomain[0] + i * xBinWidth)
      statTable.columns.xMax.push(xDomain[0] + (i + 1) * xBinWidth)
      statTable.columns.yMin.push(yDomain[0] + j * yBinWidth)
      statTable.columns.yMax.push(yDomain[0] + (j + 1) * yBinWidth)
      statTable.columns.count.push(bins[i][j])
    }
  }

  return [statTable, MAPPINGS]
}

const getBinIndex = (
  val: number,
  domain: [number, number],
  binCount: number
) => {
  const domainWidth = domain[1] - domain[0]
  const percentage = (val - domain[0]) / domainWidth

  let binIndex = Math.floor(percentage * binCount)

  if (binIndex === binCount) {
    // Special case: last bin is inclusive
    binIndex = binCount - 1
  }

  return binIndex
}

const createEmptyStatTable = () => ({
  columns: {
    xMin: [],
    xMax: [],
    yMin: [],
    yMax: [],
    count: [],
  },
  columnTypes: {
    xMin: ColumnType.Numeric,
    xMax: ColumnType.Numeric,
    yMin: ColumnType.Numeric,
    yMax: ColumnType.Numeric,
    count: ColumnType.Numeric,
  },
})
