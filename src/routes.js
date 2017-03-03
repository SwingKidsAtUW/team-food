import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import App from './pages/App';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';


const Routes = (props) => (
	<Router {...props} >
		<Route path="/">
			<IndexRoute component={App} />
			<Route path="/Admin" component={Admin} />
			<Route path="*" component={NotFound} />
		</Route>
	</Router>
);

export default Routes;
