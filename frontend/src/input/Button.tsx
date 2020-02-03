import { css } from '@emotion/core'
import styled from '@emotion/styled'
import React, { ButtonHTMLAttributes, ReactNode } from 'react'

import Loader from '../components/Loader'
import * as colors from '../theme/colors'

const StyledButton = styled.button`
  background: ${colors.primary};
  color: #fff;
  font-size: 16px;
  padding: 0.4em 1.2em;
  border-radius: 3px;
  border: 0;

  :hover {
    background: ${colors.primary400};
    cursor: pointer;
  }
`

const transparentTheme = css`
  background: transparent;
  color: ${colors.primary};
  font-size: 16px;
  padding: 0.4em;

  &:hover {
    filter: brightness(150%);
    cursor: pointer;
  }
`
const loadingCss = css`
  color: transparent;
  :before {
    content: '';
  }
`
const LoadingContainer = styled.div`
  display: inline-block;
  position: relative;
`
const LoaderPositioner = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  loading?: boolean
  variant?: 'primary' | 'transparent'
}

const Button = ({
  children,
  loading = false,
  disabled = false,
  variant = 'primary',
  ...others
}: Props) => {
  const button = (
    <StyledButton
      css={[
        loading && loadingCss,
        variant === 'transparent' && transparentTheme,
      ]}
      {...others}
    >
      {children}
    </StyledButton>
  )

  if (loading) {
    return (
      <LoadingContainer>
        <LoaderPositioner>
          <Loader color={colors.grey050} size={32} />
        </LoaderPositioner>
        {button}
      </LoadingContainer>
    )
  }

  return button
}

export default Button
