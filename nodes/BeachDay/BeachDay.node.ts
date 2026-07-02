import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

const BASE_URL = 'https://beachdayapi.com/v1';

export class BeachDay implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Beach Day API',
    name: 'beachDay',
    icon: 'file:beachday.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description:
      'Real-time beach conditions, tides, water quality, and Beach Day Scores™ across 11,500+ beaches in 22 countries',
    defaults: { name: 'Beach Day' },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [{ name: 'beachDayApi', required: true }],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Get Beach Detail', value: 'getBeach', description: 'Full beach detail with water quality, weather, rules, and amenities' },
          { name: 'Get Beach Conditions', value: 'getConditions', description: 'Historical daily condition snapshots with tides' },
          { name: 'Get Beach Rules', value: 'getRules', description: 'Allowed/prohibited/restricted activities for a beach' },
          { name: 'Get Beach Amenities', value: 'getAmenities', description: 'Lifeguards, restrooms, showers, parking, and more' },
          { name: 'Get Tide Predictions', value: 'getTides', description: 'Up to 7 days of high/low tide predictions' },
          { name: 'Get Top Scored Beaches', value: 'getScoredBeaches', description: 'Beaches ranked by Beach Day Score™ (0-100)' },
          { name: 'Search Beaches', value: 'searchBeaches', description: 'Find beaches by name, country, or state' },
          { name: 'List Countries', value: 'listCountries', description: 'All available countries with beach counts' },
        ],
        default: 'getBeach',
        required: true,
        description: 'What beach data to retrieve',
      },
      {
        displayName: 'Beach ID',
        name: 'beachId',
        type: 'number',
        default: 1,
        required: true,
        displayOptions: {
          show: { operation: ['getBeach', 'getConditions', 'getRules', 'getAmenities', 'getTides'] },
        },
        description: 'Beach ID (find IDs with the Search Beaches operation)',
      },
      {
        displayName: 'Search Query',
        name: 'search',
        type: 'string',
        default: '',
        placeholder: 'Malibu',
        displayOptions: { show: { operation: ['searchBeaches'] } },
        description: 'Search beaches by name (case-insensitive). Leave empty to list all.',
      },
      {
        displayName: 'Country',
        name: 'country',
        type: 'string',
        default: '',
        placeholder: 'United States',
        displayOptions: { show: { operation: ['searchBeaches'] } },
        description: 'Filter by country name',
      },
      {
        displayName: 'State',
        name: 'state',
        type: 'string',
        default: '',
        placeholder: 'CA',
        displayOptions: { show: { operation: ['searchBeaches'] } },
        description: 'Filter by state code (e.g., CA, FL, HI, AU-NSW)',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 10,
        typeOptions: { minValue: 1, maxValue: 500 },
        displayOptions: { show: { operation: ['searchBeaches', 'getConditions', 'getScoredBeaches'] } },
        description: 'Max results to return (1-500)',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = await this.getCredentials('beachDayApi');
    const apiKey = credentials.apiKey as string;

    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter('operation', i) as string;
      try {
        let url: string;
        switch (operation) {
          case 'getBeach':
            url = `${BASE_URL}/beaches/${this.getNodeParameter('beachId', i)}/`; break;
          case 'getConditions':
            url = `${BASE_URL}/beaches/${this.getNodeParameter('beachId', i)}/conditions/?limit=${this.getNodeParameter('limit', i)}`; break;
          case 'getRules':
            url = `${BASE_URL}/beaches/${this.getNodeParameter('beachId', i)}/rules/`; break;
          case 'getAmenities':
            url = `${BASE_URL}/beaches/${this.getNodeParameter('beachId', i)}/amenities/`; break;
          case 'getTides':
            url = `${BASE_URL}/tides/${this.getNodeParameter('beachId', i)}/`; break;
          case 'listCountries':
            url = `${BASE_URL}/countries/`; break;
          case 'searchBeaches': {
            const p = new URLSearchParams();
            const s = this.getNodeParameter('search', i, '') as string;
            const c = this.getNodeParameter('country', i, '') as string;
            const st = this.getNodeParameter('state', i, '') as string;
            if (s) p.append('search', s);
            if (c) p.append('country', c);
            if (st) p.append('state', st);
            p.append('limit', String(this.getNodeParameter('limit', i)));
            url = `${BASE_URL}/beaches/?${p.toString()}`;
            break;
          }
          case 'getScoredBeaches':
            url = `${BASE_URL}/beaches/scored/?limit=${this.getNodeParameter('limit', i)}`; break;
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }

        const response = await this.helpers.request({
          method: 'GET', url,
          headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' },
          json: true,
        });
        returnData.push({ json: response });
      } catch (error: any) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: error.message || String(error) } });
          continue;
        }
        throw error;
      }
    }
    return [returnData];
  }
}