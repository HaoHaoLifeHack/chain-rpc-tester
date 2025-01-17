import rlp from 'rlp';

// Helper function to convert hex strings to buffers
export const toBuffer = (value) => {
  if (typeof value === 'string' && value.startsWith('0x')) {
    return Buffer.from(value.slice(2), 'hex');
  }
  return value;
};

// RLP encode a block
export const encodeBlockToRLP = (block) => {
  const header = [
    toBuffer(block.parentHash),
    toBuffer(block.sha3Uncles),
    toBuffer(block.miner),
    toBuffer(block.stateRoot),
    toBuffer(block.transactionsRoot),
    toBuffer(block.receiptsRoot),
    toBuffer(block.logsBloom),
    toBuffer(block.difficulty),
    toBuffer(block.number),
    toBuffer(block.gasLimit),
    toBuffer(block.gasUsed),
    toBuffer(block.timestamp),
    toBuffer(block.extraData),
    toBuffer(block.mixHash),
    toBuffer(block.nonce),
    toBuffer(block.baseFeePerGas),
    toBuffer(block.withdrawalsRoot),
    toBuffer(block.blobGasUsed),
    toBuffer(block.excessBlobGas),
    toBuffer(block.parentBeaconBlockRoot)
  ];

  const transactions = block.transactions.map(tx => {
    if (tx.type) {
      const txType = toBuffer(tx.type);
      const txData = [
        toBuffer(tx.nonce),
        toBuffer(tx.gasPrice),
        toBuffer(tx.gas),
        toBuffer(tx.to),
        toBuffer(tx.value),
        toBuffer(tx.input),
        toBuffer(tx.v),
        toBuffer(tx.r),
        toBuffer(tx.s)
      ];

      if (tx.type === '0x7e') {
        txData.push(
          toBuffer(tx.mint || '0x0'),
          toBuffer(tx.sourceHash || '0x'),
          toBuffer(tx.depositReceiptVersion || '0x0')
        );
      }

      const encodedTx = rlp.encode(txData);
      return Buffer.concat([txType, encodedTx]);
    } else {
      const txData = [
        toBuffer(tx.nonce),
        toBuffer(tx.gasPrice),
        toBuffer(tx.gas),
        toBuffer(tx.to),
        toBuffer(tx.value),
        toBuffer(tx.input),
        toBuffer(tx.v),
        toBuffer(tx.r),
        toBuffer(tx.s)
      ];
      return rlp.encode(txData);
    }
  });

  const uncles = block.uncles || [];
  const withdrawals = block.withdrawals || [];

  const encodedBlock = rlp.encode([
    header,
    transactions,
    uncles,
    withdrawals
  ]);

  return '0x' + Buffer.from(encodedBlock).toString('hex');
}; 