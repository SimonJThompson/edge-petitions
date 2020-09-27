export class WorkersKV {

	localCache:any = {}

	config:any = {
		ACCOUNT_ID: '',
		NAMESPACE_ID: '',
		API_EMAIL: '',
		API_KEY: '',
	}

	constructor(accountId:string, namespaceId:string, apiEmail:string, apiKey:string) {
		this.config.ACCOUNT_ID = accountId
		this.config.NAMESPACE_ID = namespaceId
		this.config.API_EMAIL = apiEmail
		this.config.API_KEY = apiKey
	}

	/**
	 * Get an individual key from the KV store.
	 * @param key
	 */
	async get(key:string, allowLocalCache:boolean=false, forceFresh:boolean=false) {

		let requestUrl = `https://api.cloudflare.com/client/v4/accounts/${this.config.ACCOUNT_ID}/storage/kv/namespaces/${this.config.NAMESPACE_ID}/values/${key}`
		
		// If we have a cached result, use that.
		let result = (this.localCache[key]) || false
		if (!result || forceFresh) {

			// Send the API request.
			let response:any = await this.__request(requestUrl, null, 'GET')

			// If we have a response, potentially cache it.
			if (response) {
				let responseBody = await response.text()
				if (allowLocalCache) this.localCache[key] = responseBody
				result = responseBody
			}
		}

		return result
	}

	/**
	 * Set an individual key in the KV store.
	 * @param key
	 */
	async put(key:string, value:string, expirationTTL:string='') {
		let requestUrl = `https://api.cloudflare.com/client/v4/accounts/${this.config.ACCOUNT_ID}/storage/kv/namespaces/${this.config.NAMESPACE_ID}/values/${key}?expiration_ttl=${expirationTTL}`
		if (this.localCache[key]) delete this.localCache[key]
		return this.__request(requestUrl, value, 'PUT', true)
	}

	/**
	 * Delete an individual key from the KV store.
	 * @param key
	 */
	async delete(key:string) {
		let requestUrl = `https://api.cloudflare.com/client/v4/accounts/${this.config.ACCOUNT_ID}/storage/kv/namespaces/${this.config.NAMESPACE_ID}/values/${key}`
		return this.__request(requestUrl, null, 'DELETE', true)
	}

	/**
	 * List all keys in a KV store namespace.
	 * @param key
	 */
	async listKeys(limit:number=1000, cursor:string=null) {

		let requestParams = []
		if (limit) requestParams.push('limit=' + encodeURIComponent(limit.toString()))
		if (cursor) requestParams.push('cursor=' + encodeURIComponent(cursor.toString()))

		let requestParamsString = (requestParams.length) ? '?' + requestParams.join('&') : ''

		let requestUrl = `https://api.cloudflare.com/client/v4/accounts/${this.config.ACCOUNT_ID}/storage/kv/namespaces/${this.config.NAMESPACE_ID}/keys${requestParamsString}`
		return this.__request(requestUrl, null, 'GET', true)
	}

	/**
	 * List all KV Store namespaces in the account.
	 */
	async listNamespaces() {
		let requestUrl = `https://api.cloudflare.com/client/v4/accounts/${this.config.ACCOUNT_ID}/storage/kv/namespaces`
		return this.__request(requestUrl, null, 'GET', true)
	}

	/**
	 * Helper method to send HTTP requests.
	 * @param requestUrl
	 * @param requestBody 
	 * @param requestMethod 
	 * @param isJSON 
	 */
	async __request(requestUrl:string, requestBody:string, requestMethod:string='GET', isJSON:boolean=false) {

		// Send the request.
		let response = await fetch(requestUrl, {
			method: requestMethod,
			body: requestBody,
			headers: {
				'X-Auth-Email': this.config.API_EMAIL,
				'X-Auth-Key': this.config.API_KEY
			}
		})

		// Return the response.
		return (response.status === 200) ? response : false
	}
}