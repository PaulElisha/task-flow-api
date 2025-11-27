/** @format */

class Validator {
  public schema: Record<string, any>;
  [key: string]: any;

  constructor(schemas: Record<string, any> = {}) {
    this.schema = schemas;

    Object.keys(schemas).forEach((key) => {
      this[key] = async (body: Record<string, unknown>) => {
        try {
          const { value } = await this.schema[key].validateAsync(body);
          return value;
        } catch (error) {
          if (error instanceof Error)
            throw error;
        }
      };
    });
  }

  static withSchemas(schemas: Record<string, any>) {
    return new Validator(schemas);
  }
}

export { Validator };
