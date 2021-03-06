import { IQnAMakerService, Service } from "./service";
import { QnAMakerOptions } from "botbuilder-ai";

/**
 * @module botbuilder-config
 */

export class QnAMakerService extends Service implements IQnAMakerService {
    public subscriptionKey: string;
    public endpointKey: string;
    public kbId: string;
    public hostname: string;
    constructor() {
        super();
    }
    public getOptions(): QnAMakerOptions {
        return null;
    }
}
