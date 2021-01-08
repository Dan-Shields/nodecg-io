import { NodeCG } from "nodecg/types/server";
import { StreamdeckServiceClient } from "nodecg-io-streamdeck";
import { requireService } from "nodecg-io-core";

module.exports = function (nodecg: NodeCG) {
    nodecg.log.info("Sample bundle for streamdeck started");

    const streamdeck = requireService<StreamdeckServiceClient>(nodecg, "streamdeck");
    let timeout: NodeJS.Timeout | undefined;

    streamdeck?.onAvailable((client) => {
        nodecg.log.info("Streamdeck client has been updated, painting the streamdeck.");

        try {
            const deck = client.getNativeClient();
            const colors: Array<[number, number, number]> = [
                [231, 60, 60],
                [231, 128, 60],
                [231, 197, 60],
                [197, 231, 60],
                [128, 231, 60],
                [60, 231, 60],
                [60, 231, 128],
                [60, 231, 179],
                [60, 197, 231],
                [60, 128, 231],
                [60, 60, 231],
                [128, 60, 231],
                [197, 60, 179],
                [231, 60, 128],
            ];
            let i = 0;

            timeout = setInterval(() => {
                try {
                    deck.fillColor(
                        i % deck.NUM_KEYS,
                        colors[i % colors.length][0],
                        colors[i % colors.length][1],
                        colors[i % colors.length][2],
                    );
                    i += 1;
                } catch (err) {
                    nodecg.log.info("Streamdeck error: " + String(err));
                }
            }, 200);
        } catch (err) {
            nodecg.log.info("Streamdeck error: " + String(err));
        }
    });

    streamdeck?.onUnavailable(() => {
        nodecg.log.info("Streamdeck client has been unset.");
        if (timeout) {
            clearTimeout(timeout);
        }
    });
};
