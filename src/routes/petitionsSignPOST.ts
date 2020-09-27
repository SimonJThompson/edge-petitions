import querystring = require('querystring')

import { View } from '../view'
import { PetitionsModel } from '../models/PetitionsModel'

const AppView = new View()
const Petitions = new PetitionsModel()

function hashCode(str:string) {
	var hash = 0;
	if (str.length == 0) return hash;
	for (let i=0; i < str.length; i++) {
		let char = str.charCodeAt(i);
		hash = ((hash<<5)-hash) + char;
		hash = hash & hash;
	}
	return hash;
}

export default async function(request:Request, requestParameters:any) {

	// If there's no petitionId, return with an error.
	if (!requestParameters.petitionId) return new Response('Error - Invalid Petition (#001).', {headers: {'Content-Type': 'text/html'}})

	// Check this is a valid petition.
	let petition = await Petitions.get(requestParameters.petitionId)
	if (!petition) return new Response('Error - Invalid Petition (#002).', {headers: {'Content-Type': 'text/html'}})

	// Get the petition email.
	let requestBody = (request.text) ? querystring.parse(await request.text()) : querystring.parse(request.body.toString())
	if (!requestBody.signature_email) return new Response('Error - Invalid Body (#003).', {headers: {'Content-Type': 'text/html'}})

	// Create a hash for the signature.
	let signatureEmail:string = requestBody.signature_email.toString()
	let signatureHash = hashCode(signatureEmail.toLowerCase())
	let signatureKey = ['signature', petition.id, signatureHash].join('-')

	// Check if the signature exists and, if not, save it.
	let checkSignatureExists = await Petitions.hasSignature(petition.id, signatureKey)
	if (!checkSignatureExists) {
		await Petitions.addSignature(petition.id, signatureKey)
		if (petition.lastCount < +new Date() - 30) await Petitions.countSignatures(petition.id, petition.lastCountCursor)
	}

	// Redirect back to the petition.
	return new Response('', {status: 302, headers: {'Location': `/petitions/${petition.id}`}})
}
