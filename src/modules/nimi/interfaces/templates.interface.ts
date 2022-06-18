export interface ITemplate {
  name: string;
  id: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  fields: ITemplateField[];
}

export interface ITemplateField {
  name: string;
  id: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  type: string;
}

