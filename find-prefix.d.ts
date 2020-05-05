/**
 * This computes the npm prefix, that is, the directory that npm adds and
 * removes modules from for a given path. 
 * It takes a directory as an argument and returns a promise of the associated
 * prefix directory.
 */
export declare function findPrefix(dir: string): Promise<string>;

/**
 * Sync version
 */
export declare function findPrefixSync(dir: string): string;
