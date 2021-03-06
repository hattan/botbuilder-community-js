import { ActivityTypes, Middleware, TurnContext } from 'botbuilder';
import * as WebRequest from 'web-request';
/**
 * @module botbuildercommunity/spellcheck
 */

export class SpellCheck implements Middleware {
    public text: string;
    public key: string;
    constructor(public serviceKey: string) {
        this.key = serviceKey;
    }
    public async onTurn(context: TurnContext, next: () => Promise<void>): Promise<void> {
        if (context.activity.type === ActivityTypes.Message) {
            this.text = context.activity.text;
            const url: string = `https://api.cognitive.microsoft.com/bing/v7.0/spellcheck/?text=${this.text}&mode=spell`;
            try {
                const re: WebRequest.Response<string> = await WebRequest.get(url, {
                    headers : {
                        'Content-Type' : 'application/x-www-form-urlencoded',
                        'Ocp-Apim-Subscription-Key' : this.key
                    }
                });
                const obj: any = JSON.parse(re.content);
                if (obj.flaggedTokens && obj.flaggedTokens.length > 0) {
                    try {
                        if (obj.flaggedTokens[0].suggestions[0].suggestion) {
                            const suggestion: any = obj.flaggedTokens[0].suggestions[0].suggestion;
                            const token: any = obj.flaggedTokens[0].token;
                            context.turnState.set('token', token);
                            context.turnState.set('suggestion', suggestion);
                        }
                    } catch (error) {
                        throw new Error(error);
                    }
                }
            } catch (e) {
                throw new Error(`Failed to process spellcheck on ${context.activity.text}. Error: ${e}`);
            }
        }
        await next();
    }
}
