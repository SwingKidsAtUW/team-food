import React from 'react';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
 import { createHistory } from 'history'

import App from './pages/App';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';


const browserHistory = useRouterHistory(createHistory)({
  basename: process.env.PUBLIC_URL
})

const Routes = (props) => (
	<Router history={browserHistory} {...props} >
		<Route path="/">
			<IndexRoute component={App} />
			<Route path="/Admin" component={Admin} />
			<Route path="*" component={NotFound} />
		</Route>
	</Router>
);

export default Routes;
