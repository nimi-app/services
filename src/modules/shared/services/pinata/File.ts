export interface FileParams {
  stream: NodeJS.ReadableStream | Buffer;
  filename: string;
  filepath?: string;
  contentType: string;
}

export class File {
  stream: NodeJS.ReadableStream | Buffer;
  filename: string;
  contentType: string;
  filepath?: string;

  constructor({
    stream,
    filename,
    contentType = 'application/octet-stream',
    filepath,
  }: FileParams) {
    this.stream = stream;
    this.filename = filename;
    this.contentType = contentType;
    this.filepath = filepath;
  }
}

