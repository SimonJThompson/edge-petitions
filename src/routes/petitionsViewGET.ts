import { View } from '../view'
import { PetitionsModel } from '../models/PetitionsModel'

const AppView = new View()
const Petitions = new PetitionsModel()

export default async function(request:Request, requestParameters:any) {

	let petition:any = false
	if (requestParameters.petitionId) petition = await Petitions.get(requestParameters.petitionId)

	const body = AppView.render(`
		<h2>${petition.title}</h2>
		<p>${petition.description}</p>
		<p><a class="btn" href="/petitions/${petition.id}/sign">Sign this petition</a></p>
		<figure>
			<strong>${petition.signatures}</strong>
			signatures
		</figure>
	`, `EdgePetitions - ${petition.title}`)

	return new Response(body, {headers: {'Content-Type': 'text/html'}})
}
