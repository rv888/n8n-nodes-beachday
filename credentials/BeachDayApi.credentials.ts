import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BeachDayApi implements ICredentialType {
	name = 'beachDayApi';

	displayName = 'Beach Day API';

	documentationUrl = 'https://beachdayapi.com/docs';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Beach Day API key from the dashboard at beachdayapi.com',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://beachdayapi.com',
			url: '/v1/countries/',
			method: 'GET',
		},
	};
}
