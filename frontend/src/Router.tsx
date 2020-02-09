import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import routes from './routes'
import About from './About'
import Content from './Content'
import Login from './Login'
import Registration from './Registration'

const Router = () => {
  return (
    <Switch>
      <Route path={routes.home} exact>
        <Redirect to={routes.login} />
      </Route>
      <Route path={routes.login} exact>
        <Login />
      </Route>
      <Route path={routes.register} exact>
        <Registration />
      </Route>
      <Route path={routes.content} exact>
        <Content />
      </Route>
      <Route path={routes.about} exact>
        <About />
      </Route>
      {/*<Route*/}
      {/*  path={routes.user}*/}
      {/*  render={({ match }) => <UserPage id={match.params.id} />}*/}
      {/*/>*/}
    </Switch>
  )
}

export default Router
