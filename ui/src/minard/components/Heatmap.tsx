import React, {SFC} from 'react'

import {PlotEnv} from 'src/minard'
import {useLayer} from 'src/minard/utils/useLayer'
import {bin2d} from 'src/minard/utils/bin2d'
import HeatmapSquares from 'src/minard/components/HeatmapSquares'

interface Props {
  env: PlotEnv
  x: string
  y: string
  binSize?: number
  colors?: string[]
}

export const Heatmap: SFC<Props> = ({
  env,
  x,
  y,
  binSize = 20,
  colors = ['blue', 'red'],
}) => {
  const {
    width,
    height,
    innerWidth,
    innerHeight,
    xDomain,
    yDomain,
    baseLayer: {
      table: baseTable,
      scales: {x: xScale, y: yScale},
    },
  } = env

  const layer = useLayer(
    env,
    () => {
      const [table, aesthetics] = bin2d(
        baseTable,
        x,
        xDomain,
        y,
        yDomain,
        width,
        height,
        binSize
      )

      return {table, aesthetics, scales: {}, colors}
    },
    [baseTable, x, xDomain, y, yDomain, width, height, binSize]
  )

  if (!layer) {
    return null
  }

  return (
    <HeatmapSquares
      layer={layer}
      width={innerWidth}
      height={innerHeight}
      xScale={xScale}
      yScale={yScale}
    />
  )
}
