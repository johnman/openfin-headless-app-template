export declare type ILog = {
    info?: (message: string) => void;
    warn?: (message: string) => void;
    error?: (message: string, error?: Error) => void;
};
