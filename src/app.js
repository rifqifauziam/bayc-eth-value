const express = require('express');
const Moralis = require('moralis').default;
const { EvmChain } = require('@moralisweb3/common-evm-utils');

const app = express();
const port = 3000;

Moralis.start({
  apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6Ijk0MzI0YmYyLTVmZDgtNGJmNC1hYjg1LWFjYzhhZTA4MGViYSIsIm9yZ0lkIjoiMzU4NTc0IiwidXNlcklkIjoiMzY4NTEyIiwidHlwZUlkIjoiNTU1ODc0ZTEtNWUwYy00NGE4LWExZTktMjg1ODRjY2E5NTQyIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTU1NzI5NTksImV4cCI6NDg1MTMzMjk1OX0.a3JoLsLcimoLR9fnQ5laRVCaOMGJztIvLV5E0ikXztc',
});

app.get('/calculateEthValue', async (req, res) => {
  const address = '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d';
  const chain = EvmChain.ETHEREUM;

  const epochTime = parseInt(req.query.epochTime);

  try {
    const response = await Moralis.EvmApi.transaction.getWalletTransactions({
      address,
      chain,
    });

    const transactions = response.toJSON();

    let totalETHValue = 0;

    transactions.result.forEach((transaction) => {
      if (transaction.to === address && transaction.block_timestamp <= epochTime) {
        const ethValue = Moralis.Units.FromWei(transaction.value, 'ether');
        totalETHValue += parseFloat(ethValue);
      }
    });

    res.json({ totalETHValue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while calculating ETH value.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
