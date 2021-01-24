import { NodeCG } from "nodecg/types/server";
import { Result, emptySuccess, success, ServiceBundle } from "nodecg-io-core";
import { Sender } from "sacn";
import { SacnSenderServiceClient } from "./sacnSenderClient";

interface SacnSenderServiceConfig {
    universe: number;
    port?: number;
    reuseAddr?: boolean;
}

export { SacnSenderServiceClient } from "./sacnSenderClient";

module.exports = (nodecg: NodeCG) => {
    new SacnSenderService(nodecg, "sacn-sender", __dirname, "../sacn-sender-schema.json").register();
};

class SacnSenderService extends ServiceBundle<SacnSenderServiceConfig, SacnSenderServiceClient> {
    async validateConfig(): Promise<Result<void>> {
        return emptySuccess();
    }

    async createClient(config: SacnSenderServiceConfig): Promise<Result<SacnSenderServiceClient>> {
        const sacn = new Sender(config);
        return success(new SacnSenderServiceClient(sacn));
    }

    stopClient(client: SacnSenderServiceClient): void {
        client.getNativeClient().close();
        this.nodecg.log.info("Successfully stopped sACN Sender.");
    }
}
