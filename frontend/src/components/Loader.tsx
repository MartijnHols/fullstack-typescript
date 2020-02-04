import { keyframes } from '@emotion/core'
import styled from '@emotion/styled'
import React, { HTMLAttributes } from 'react'

import * as colors from '../theme/colors'

const heartColor = colors.primary500
const fadeInAnimation = keyframes`
  from { transform: scale(0) rotate(45deg) } 
  to { transform: scale(1) rotate(45deg) }
`
const heartBeatAnimation = keyframes`
  0% { transform: scale(0.95); }
  5% { transform: scale(1.1); }
  39% { transform: scale(0.85); }
  45% { transform: scale(1); }
  60% { transform: scale(0.95); }
  100% { transform: scale(0.9); }
`
const formatSize = (size: number | string) =>
  typeof size === 'number' ? `${size}px` : size
const Container = styled<'div', { color: string; size: number | string }>(
  'div',
  {
    shouldForwardProp: prop => prop !== 'color' && prop !== 'size',
  },
)`
  // Source: https://loading.io/css/
  display: inline-block;
  position: relative;
  width: ${props => formatSize(props.size)};
  height: ${props => formatSize(props.size)};
  transform: rotate(45deg);
  transform-origin: 50% 50%;
  animation: ${fadeInAnimation} 200ms both ease-out;

  div {
    top: calc(0.4 * ${props => formatSize(props.size)});
    left: calc(0.4 * ${props => formatSize(props.size)});
    position: absolute;
    width: calc(0.4 * ${props => formatSize(props.size)});
    height: calc(0.4 * ${props => formatSize(props.size)});
    background: ${props => props.color};
    animation: ${heartBeatAnimation} 1.2s infinite
      cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  div:after,
  div:before {
    content: ' ';
    position: absolute;
    display: block;
    width: calc(0.4 * ${props => formatSize(props.size)});
    height: calc(0.4 * ${props => formatSize(props.size)});
    background: ${props => props.color};
  }
  div:before {
    left: calc(-0.3 * ${props => formatSize(props.size)});
    border-radius: 50% 0 0 50%;
  }
  div:after {
    top: calc(-0.3 * ${props => formatSize(props.size)});
    border-radius: 50% 50% 0 0;
  }
`

interface Props extends HTMLAttributes<HTMLDivElement> {
  color?: string
  size?: number | string
}

const Loader = ({ color = heartColor, size = 80, ...others }: Props) => (
  <Container color={color} size={size} {...others}>
    <div />
  </Container>
)

export default Loader
