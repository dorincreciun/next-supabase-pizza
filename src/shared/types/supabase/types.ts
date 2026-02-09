import { Database } from "./database";

type PublicSchema = Database['public'];

export type DBEntity<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Row'];
export type DBInsert<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Insert'];
export type DBUpdate<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Update'];
export type DBEnum<T extends keyof PublicSchema['Enums']> = PublicSchema['Enums'][T];