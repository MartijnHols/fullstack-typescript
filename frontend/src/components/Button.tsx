import styled from '@emotion/styled'

import * as colors from '../theme/colors'

const Button = styled.button`
  background: ${colors.primary};
  color: #fff;
  font-size: 16px;
  padding: 0.4em;
  border-radius: 3px;
  border: 1px solid transparent;

  :hover {
    filter: brightness(150%);
    cursor: pointer;
  }
`

export default Button
