import * as pathToRegExp from 'path-to-regexp'

/**
 * Define an interface for the RouteMap, which maintains
 * a map of request paths to handler methods.
 */
interface RouteMap {
	[key: string]: any,
}

/**
 * Define an interface for the ParameterMap, which maintains
 * a map of parameters extracted from a request path.
 */
interface ParameterMap {
	[key: string]: any,
}

/**
 * Class to handle routing of requests to their appropriate
 * handler methods.
 */
export class Router {

	// Initiate the RouteMap.
	_routes:RouteMap = {
		GET: {},
		POST: {},
	}

	/**
	 * Route a HTTP request through to a handler.
	 * @param request
	 */
	public async route(request:Request) {

		// Get the URL components.
		let requestUrl = new URL(request.url)
		
		// Fetch RouteMap for this HTTP verb.
		let methodRoutes = this._routes[request.method]

		// Iterate over the RouteMap.
		for(let methodRoutePath in methodRoutes) {
			
			// Create a RegExp for this route.
			let routeParameterKeys: any[] | pathToRegExp.Key[] = []
			let	methodRouteRegexp = pathToRegExp(methodRoutePath, routeParameterKeys)

			// Check whether the request path matches this route.
			let checkRoute = methodRouteRegexp.exec(requestUrl.pathname)
			if (!checkRoute) continue

			// Build a map of request parameters.
			let requestParameters:ParameterMap = {};
			for(let routeParameterKeyIndex in routeParameterKeys) {
				requestParameters[routeParameterKeys[routeParameterKeyIndex].name] = checkRoute[parseInt(routeParameterKeyIndex) + 1]
			}

			// Run the route handler.
			return methodRoutes[methodRoutePath](request, requestParameters)
		}

		// If all else fails, return with a 404.
		return new Response('Page not found.', {headers: {'Content-Type':'text/html'}})
	}

	/**
	 * Register a new GET route.
	 * @param path 
	 * @param callback 
	 */
	public get(path:string, callback:Function) {
		this._routes.GET[path] = callback
	}

	/**
	 * Register a new POST route.
	 * @param path 
	 * @param callback 
	 */
	public post(path:string, callback:Function) {
		this._routes.POST[path] = callback
	}
}
