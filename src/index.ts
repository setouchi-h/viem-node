import { createPublicClient, http, parseEther } from "viem";
import { mainnet } from "viem/chains";

const client = createPublicClient({
  chain: mainnet,
  transport: http("https://eth-pokt.nodies.app"),
});

async function main() {
  console.log("Watching for pending transactions...");
  const startTime = Date.now();
  let firstTransactionReceived = false;

  const unwatch = await client.watchPendingTransactions({
    onTransactions: (transactions) => {
      if (!firstTransactionReceived) {
        const elapsedTime = Date.now() - startTime;
        console.log(
          `最初のトランザクションを受信するまでの時間: ${elapsedTime}ms`
        );
        firstTransactionReceived = true;
      }
      console.log(transactions);
      //   transactions.forEach((transaction) => {
      //     console.log("New pending transaction:");
      //     console.log("- Hash:", transaction.hash);
      //     console.log("- From:", transaction.from);
      //     console.log("- To:", transaction.to);
      //     console.log(
      //       "- Value:",
      //       transaction.value ? parseEther(transaction.value.toString()) : "N/A"
      //     );
      //     console.log(
      //       "- Gas Price:",
      //       transaction.gasPrice ? transaction.gasPrice.toString() : "N/A"
      //     );
      //     console.log("---");
      //   });
    },
    batch: true,
    pollingInterval: 1000, // Poll every 1 second
  });

  // Stop watching after 5 minutes
  setTimeout(() => {
    unwatch();
    console.log("Stopped watching for pending transactions.");
    process.exit(0);
  }, 2 * 60 * 1000);
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
