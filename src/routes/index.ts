import { View } from '../view'
import { PetitionsModel } from '../models/PetitionsModel'

const AppView = new View()
const Petitions = new PetitionsModel()

export default async function(request:Request) {

	let petitions:any = await Petitions.list(true)
	let petitionsList = petitions.map((petition: any) => `
		<li>
			<strong><a href="/petitions/${petition.id}">${petition.title}</a></strong>
			<p>${petition.signatures} signatures</p>
		</li>
	`).join('')

	const body = AppView.render(`
		<h2>Open Petitions</h2>
		<ul>${petitionsList}</ul>
	`, 'EdgePetitions - Serverless Petitions App')

	return new Response(body, {headers: {'Content-Type': 'text/html'}})
}
