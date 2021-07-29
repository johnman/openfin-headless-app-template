import { ILog } from "../common/ILog.js";
import { IPayload } from "../common/IPayload.js";
export declare function isClientConnected(): boolean;
export declare function init(payload: IPayload, onDisconnect: () => void, logger?: ILog): Promise<{
    dispose: () => Promise<void>;
    isConnected: boolean;
} | {
    isConnected: boolean;
    dispose?: undefined;
}>;
export declare function executeAction(message: any): Promise<any>;
