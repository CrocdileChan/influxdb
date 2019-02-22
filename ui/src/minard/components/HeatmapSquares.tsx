import React, {useRef, useLayoutEffect, SFC} from 'react'

import {Scale, Layer} from 'src/minard'
import {clearCanvas} from 'src/minard/utils/clearCanvas'

interface Props {
  layer: Layer
  width: number
  height: number
  xScale: Scale<number, number>
  yScale: Scale<number, number>
}

const drawSquares = (
  canvas: HTMLCanvasElement,
  {layer, width, height, xScale, yScale}: Props
) => {
  clearCanvas(canvas, width, height)

  const {
    table,
    aesthetics,
    scales: {fill: fillScale},
  } = layer

  const context = canvas.getContext('2d')
  const n = table.columns[aesthetics.xMin].length

  for (let i = 0; i < n; i++) {
    const xMin = table.columns[aesthetics.xMin][i]
    const xMax = table.columns[aesthetics.xMax][i]
    const yMin = table.columns[aesthetics.yMin][i]
    const yMax = table.columns[aesthetics.yMax][i]
    const fill = table.columns[aesthetics.fill as string][i]

    const squareX = xScale(xMin)
    const squareY = yScale(yMax)
    const squareWidth = xScale(xMax) - squareX
    const squareHeight = yScale(yMin) - squareY

    context.beginPath()
    context.rect(squareX, squareY, squareWidth, squareHeight)
    context.globalAlpha = fill === 0 ? 0 : 1
    context.fillStyle = fillScale(fill)
    context.fill()
  }
}

const HeatmapSquares: SFC<Props> = props => {
  const canvas = useRef<HTMLCanvasElement>(null)

  useLayoutEffect(() => drawSquares(canvas.current, props))

  return <canvas className="minard-layer heatmap" ref={canvas} />
}

export default React.memo(HeatmapSquares)
