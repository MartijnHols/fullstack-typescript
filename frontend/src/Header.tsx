import styled from '@emotion/styled'
import React, { ComponentProps, ReactNode } from 'react'
import { useHistory } from 'react-router-dom'

import TransparentButton from './components/TransparentButton'
import Icon from './components/Icon'
import { ReactComponent as BackIcon } from './icons/todo.svg'
import * as colors from './theme/colors'

const Container = styled.header`
  background: ${colors.background};
  border-bottom: 1px solid ${colors.grey200};
  color: ${colors.onBackground};
  flex-grow: 0;
  display: flex;
  width: 100%;
  height: 49px;
  padding: 0 14px;
`
const Pane = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const BackButton = styled(TransparentButton)`
  flex: 0 0 auto;
  line-height: 1;
  padding: 0;
  font-size: 24px;
  margin-right: 14px;

  .secondary {
    fill: ${colors.primary};
  }
`
const TitlePane = styled(Pane)`
  flex: 1 1 auto;
`
const Title = styled.h2`
  font-size: 18px;
  margin: 0;
  font-weight: 800;
`
const ActionsPane = styled(Pane)`
  flex: 0 0 auto;
`

interface Props extends ComponentProps<typeof Container> {
  children: ReactNode
  back?: boolean
  leftPane?: ReactNode
  actions?: ReactNode
}

const Header = ({ children, back, leftPane, actions, ...others }: Props) => {
  const history = useHistory()

  return (
    <Container {...others}>
      {back && (
        <Pane>
          <BackButton onClick={history.goBack}>
            <Icon component={BackIcon} />
          </BackButton>
        </Pane>
      )}
      {leftPane && <Pane>{leftPane}</Pane>}
      <TitlePane>
        <Title>{children}</Title>
      </TitlePane>
      {actions && <ActionsPane>{actions}</ActionsPane>}
    </Container>
  )
}

export default Header
