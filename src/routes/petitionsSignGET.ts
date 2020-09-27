import { View } from '../view'
import { PetitionsModel } from '../models/PetitionsModel'

const AppView = new View()
const Petitions = new PetitionsModel()

export default async function(request:Request, requestParameters:any) {

	// Make sure we have a petition ID.
	if (!requestParameters.petitionId) return new Response('Error.', {headers: {'Content-Type': 'text/html'}})

	// Load the petition.
	let petition = await Petitions.get(requestParameters.petitionId)

	// Build the view.
	const body = AppView.render(`
		<h2>Sign - ${petition.title}</h2>
		<form method="POST">
			<label>Your Email</label>
			<input type="email" name="signature_email" required="required" />
			<p style="margin-bottom: 0;">
				<input type="submit" class="btn" value="Sign Petition" />
			</p>
		</form>
	`, `EdgePetitions - ${petition.title}`)

	// Return the view.
	return new Response(body, {headers: {'Content-Type': 'text/html'}})
}
