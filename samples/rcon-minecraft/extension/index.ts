import { NodeCG } from "nodecg/types/server";
import { requireService } from "nodecg-io-core/extension/serviceClientWrapper";
import { RconServiceClient } from "nodecg-io-rcon";

module.exports = function (nodecg: NodeCG) {
    nodecg.log.info("Sample bundle for sACN started");

    const rcon = requireService<RconServiceClient>(nodecg, "rcon");

    rcon?.onAvailable(async (client) => {
        nodecg.log.info("RCON sample has been updated, performing /list and a /say command.");
        const response = await client.sendMessage("list");
        nodecg.log.info(response);
        client.sendMessage("say nodecg-io speaking here!");
    });

    rcon?.onUnavailable(() => nodecg.log.info("RCON sample has been unset."));
};
