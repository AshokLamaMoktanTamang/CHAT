import {
  AnyKeys,
  CreateOptions,
  Document,
  Model,
  ProjectionType,
  QueryOptions,
  RootFilterQuery,
  UpdateQuery,
} from 'mongoose';

type CreateDocumentPayload<T, DocContents = AnyKeys<T>> = {
  data: T | DocContents;
};

type CreateMultiDocumentPayload<T, DocContents = AnyKeys<T>> = {
  data: Array<T | DocContents>;
  options?: CreateOptions;
};

type FindDocumentPayload<T> = {
  filter?: RootFilterQuery<T>;
  projection?: ProjectionType<T>;
  options?: QueryOptions<T>;
};

type UpdateDocumentPayload<T> = Omit<FindDocumentPayload<T>, 'projection'> & {
  update: UpdateQuery<T>;
};

export class BaseRepository<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  async create({ data }: CreateDocumentPayload<T>) {
    return await this.model.create(data);
  }

  async createMany({ data, options }: CreateMultiDocumentPayload<T>) {
    return await this.model.create(data, options);
  }

  async findAll({
    filter,
    options,
    projection,
  }: FindDocumentPayload<T>): Promise<Array<T>> {
    return await this.model.find(filter, projection, options);
  }

  async findOne({
    filter,
    options,
    projection,
  }: FindDocumentPayload<T>): Promise<T> {
    return await this.model.findOne(filter, projection, options);
  }

  async update({
    filter,
    options,
    update,
  }: UpdateDocumentPayload<T>): Promise<T> {
    return await this.model.findOneAndUpdate(filter, update, options);
  }
}
