import { PrismaClient } from '@prisma/client';
export declare const SAMPLE_MENTORS: {
    name: string;
    email: string;
}[];
export declare const SAMPLE_PARENTS: {
    name: string;
    email: string;
    timezone: string;
}[];
export declare function seed(client?: PrismaClient): Promise<void>;
