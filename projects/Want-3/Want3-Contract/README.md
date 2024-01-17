# Want3Protocol

This is a single-contract version of the Want3Protocol. Could be quickly deployed using remix editor.

Contract:

- WantToken: NFT token which proves the donation to goods.
- GoodsOracle: example Oracle which returns the goods price.
- Want3Protocol: main protocol:
    - addWant: host add goods to want list.
    - donateFund: user add fund. Protocol would buy it if available.