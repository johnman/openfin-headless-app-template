import { ILog } from "../common/ILog.js";
import { IStreamOptions } from "../common/IStreamOptions.js";
import { IPayload } from "../common/IPayload.js";
export declare function isClientConnected(): boolean;
export declare function init(payload: IPayload, onDisconnect: () => void, logger: ILog): Promise<{
    dispose: () => Promise<void>;
    isConnected: boolean;
} | {
    isConnected: boolean;
    dispose?: undefined;
}>;
export declare function executeAction(message: string): Promise<any>;
export declare function executeNewAction(message: string): Promise<any>;
export declare function startStream(callback: (data: string) => void, options: IStreamOptions): Promise<{
    dispose: () => Promise<void>;
}>;
