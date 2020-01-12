import React from 'react'
import { Route, Switch } from 'react-router-dom'

import routes from './routes'
import Content from './Content'
import Login from './Login'

const Router = () => {
  return (
    <Switch>
      <Route path={routes.home} exact>
        <Login />
      </Route>
      <Route path={routes.content} exact>
        <Content />
      </Route>
      {/*<Route*/}
      {/*  path={routes.user}*/}
      {/*  render={({ match }) => <UserPage id={match.params.id} />}*/}
      {/*/>*/}
    </Switch>
  )
}

export default Router
