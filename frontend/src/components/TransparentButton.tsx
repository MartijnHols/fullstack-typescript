import styled from '@emotion/styled'

import * as colors from '../theme/colors'
import Button from './Button'

const TransparentButton = styled(Button)`
  background: transparent;
  color: ${colors.primary};
  font-size: 16px;
  padding: 0.4em;

  &:hover {
    filter: brightness(150%);
    cursor: pointer;
  }
`

export default TransparentButton
