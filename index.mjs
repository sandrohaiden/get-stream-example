//import { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { StreamChat } from 'stream-chat'

export function messageResponse(status, message) {
	return {
		statusCode: status,
		body: JSON.stringify({ message }),
		headers: { 'Content-Type': 'application/json' }
	}
}

export function bodyResponse(status, body) {
	return {
		statusCode: status,
		body: JSON.stringify(body),
		headers: { 'Content-Type': 'application/json' }
	}
}

export const handler = async (event, context) => {
	try {
		context.callbackWaitsForEmptyEventLoop = false
		const body = event.body ? JSON.parse(event.body) : event.body
		const headers = event.headers

		// headers props are always lowercase
		// We can receive userId first by header or by body. ex: {userId: 2}
		const userId = headers.userid || body.userId + ''
		const api_key = 'KEY'
		const api_secret = 'SECRET'

		const client = new StreamChat(api_key, api_secret, { timeout: 6000 })

		if (userId) {
			const token = client.createToken(userId)
			return bodyResponse(200, { token })
		} else {
			const errorMsg = 'Could not generate token. Missing userId'
			console.error(errorMsg)
			return messageResponse(400, errorMsg)
		}
	} catch (error) {
		console.error(JSON.stringify(error))
		return messageResponse(500, 'Error on server side, see the logs')
	}
}
