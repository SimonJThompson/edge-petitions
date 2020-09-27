// Import Router class.
import { Router } from './router'
const AppRouter = new Router()

// Load routes.
import routeIndex from './routes/index'
import routePetitionsView from './routes/petitionsViewGET'
import routePetitionsSign from './routes/petitionsSignGET'
import routePetitionsSignPost from './routes/petitionsSignPOST'

// Register routes.
AppRouter.get('/', routeIndex)
AppRouter.get('/petitions/:petitionId', routePetitionsView)
AppRouter.get('/petitions/:petitionId/sign', routePetitionsSign)
AppRouter.post('/petitions/:petitionId/sign', routePetitionsSignPost)

// Pass requests off to the router.
addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(AppRouter.route(event.request))
})
