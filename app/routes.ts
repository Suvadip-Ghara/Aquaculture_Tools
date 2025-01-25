import { RouteObject } from 'react-router-dom';
import Home from './routes/home';

const routes: RouteObject[] = [
	{
		path: '/',
		element: <Home />,
		index: true,
	}
];

export default routes;
