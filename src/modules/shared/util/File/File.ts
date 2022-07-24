export interface FileParams {
  stream: NodeJS.ReadableStream | Buffer;
  name: string;
  filename: string;
  filepath?: string;
  contentType: string;
}

export class File {
  /**
   * Returns a ReadableStream which upon reading returns the data contained
   * within the File.
   */
  readonly stream: NodeJS.ReadableStream | Buffer;

  /**
   * Name of the file. May include path information.
   */
  readonly filename: string;

  /**
   * Name of the file. May include path information.
   */
  readonly name: string;

  /**
   * Content type of the file.
   */
  readonly contentType: string;

  /**
   * Path to the file.
   */
  readonly filepath?: string;

  constructor({
    stream,
    filename,
    contentType = 'application/octet-stream',
    filepath,
  }: FileParams) {
    this.stream = stream;
    this.filename = filename;
    this.name = filename;
    this.contentType = contentType;
    this.filepath = filepath;
  }
}

