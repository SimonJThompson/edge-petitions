// Import KV library.
import { WorkersKV } from '../storage';
const AppStorage = new WorkersKV(
	'', // Account ID
	'', // Namespace ID
	'', // Account Email
	'', // Account API Key
)

export class PetitionsModel {

	/**
	 * Return a list of all petitions.
	 * @param asArray
	 */
	async list(asArray:boolean=false, forceFresh:boolean=false) {

		// Default to an appropriate return value.
		let returnValue = (asArray) ? [] : {}

		// Fetch the petitions list from storage.
		let petitionsList:any = await AppStorage.get('petitions', true, forceFresh)

		// If we have a result, parse it and return.
		if (petitionsList) {
			petitionsList = JSON.parse(petitionsList)
			returnValue = (asArray) ? Object.keys(petitionsList).map(key => petitionsList[key]) : petitionsList
		}
	
		return returnValue
	}

	/**
	 * Return the object for a single petition.
	 * @param petitionId
	 */
	async get(petitionId:string) {

		// Fetch the petitions list.
		let petitionsList:any = await this.list()

		// Return the individual petition.
		return (petitionsList[petitionId]) ? petitionsList[petitionId] : false
	}

	/**
	 * Check for the presence of a signature in the data store.
	 * @param petitionId
	 * @param signatureEmail 
	 */
	async hasSignature(petitionId:number, signatureKey:string) {
		return await AppStorage.get(signatureKey)
	}

	/**
	 * Add a signature to the data store.
	 * @param petitionId 
	 * @param signatureEmail 
	 */
	async addSignature(petitionId:number, signatureKey:string) {
		return await AppStorage.put(signatureKey, signatureKey, (60 * 60 * 24).toString())
	}

	/**
	 * Recalculate the signature total for this petition.
	 * @param petitionId
	 */
	async countSignatures(petitionId:any, petitionCursor:string=null) {

		// Fetch all recent keys from the KV store.
		let keys:any = await AppStorage.listKeys(1000, petitionCursor)
		if (keys) keys = await keys.json()

		// Iterate over the keys, count them for this petition.
		let batchCount = keys.result.filter((key:any) => (key.name.indexOf('signature-' + petitionId) == 0)).length

		// Fetch the petitions.
		let petitionsList:any = await this.list()

		// Update the petition object.
		petitionsList[petitionId].signatures = (keys.result_info.cursor) ? (petitionsList[petitionId].signatures + batchCount) : batchCount
		petitionsList[petitionId].lastCount = +new Date()
		petitionsList[petitionId].lastCountCursor = keys.result_info.cursor

		// Save the petition object.
		return await AppStorage.put('petitions', JSON.stringify(petitionsList))
	}
}
