import { registerAs } from '@nestjs/config';
import { join } from 'path';

export const graphqlConfig = registerAs('graphql', () => ({
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    sortSchema: true,
    playground: false,
    introspection: process.env.NODE_ENV === 'development',
}));
