import { captureException } from '@sentry/node';
import { Request } from '@hapi/hapi';
import Boom from '@hapi/boom';

// Constants
import { ITemplate } from '../interfaces/templates.interface';
import { TemplateModel } from '../models';

/**
 * Fetches Twitter information for a given username
 */
export async function getAllTemplates() {
  // Services
  try {
    // Placeholder
    const templates: ITemplate[] = [
      {
        name: 'Nimimal',
        id: 1,
        description: 'Template 1',
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01',
        fields: [
          {
            name: 'field 1',
            id: 1,
            description: 'field 1',
            createdAt: '2020-01-01',
            updatedAt: '2020-01-01',
            type: 'string',
          },
        ],
      },
    ];

    return {
      data: templates,
    };
  } catch (e) {
    captureException(e);
    throw Boom.badRequest(e);
  }
}

interface EVMAddress {
  network: string;
  address: string;
}

interface ICreateWebsiteFromTemplateRequest extends Request {
  params: {
    templateId: string;
  };
  payload: {
    twitterUsername: string;
    addresses: EVMAddress[];
  };
}

/**
 *
 */
export async function createWebsiteFromTemplate(
  req: ICreateWebsiteFromTemplateRequest
) {
  try {
    const template = await TemplateModel.findById(req.params.templateId);

    if (!template) {
      throw new Error('Template not found');
    }

    return {
      data: {},
    };
  } catch (error) {
    captureException(error);
    throw Boom.badRequest(error);
  }
}

