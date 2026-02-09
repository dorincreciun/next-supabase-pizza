import {DBEntity, DBEnum, DBInsert, DBUpdate} from "@/shared/types/supabase/types";

export type UserRole = DBEnum<'user_role'>

export type UserProfile = DBEntity<'profiles'>

export type UserProfileInsert = DBInsert<'profiles'>

export type UserProfileUpdate = DBUpdate<'profiles'>