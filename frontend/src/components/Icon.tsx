import { css } from '@emotion/core'
import React, { ComponentType } from 'react'

const svg = css`
  width: auto;
  height: 1.4em;
  vertical-align: middle;
`

interface Props {
  component: ComponentType
}

const Icon = ({ component: Component, ...others }: Props) => (
  <Component css={svg} {...others} />
)

export default Icon
