'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface NFTCard {
  id: string;
  tokenId: number;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  type: 'card-skin' | 'avatar' | 'table-theme' | 'chip-set' | 'emote';
  image: string;
  attributes: { trait: string; value: string }[];
  price: number; // in crypto
  owner: string;
  onSale: boolean;
  mintDate: Date;
  edition: string;
  creator: string;
}

export interface CryptoWallet {
  address: string;
  balance: {
    ETH: number;
    POKER: number; // PokerMind token
    USDC: number;
  };
  nfts: NFTCard[];
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'mint' | 'transfer' | 'stake';
  amount: number;
  currency: 'ETH' | 'POKER' | 'USDC';
  from: string;
  to: string;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
}

// Blockchain Manager (simplified for demo)
export class BlockchainManager {
  private static instance: BlockchainManager;

  private constructor() {}

  static getInstance(): BlockchainManager {
    if (!BlockchainManager.instance) {
      BlockchainManager.instance = new BlockchainManager();
    }
    return BlockchainManager.instance;
  }

  async connectWallet(): Promise<CryptoWallet> {
    // Simulate wallet connection (in production: use ethers.js or web3.js)
    return {
      address: '0x' + Math.random().toString(16).substring(2, 42),
      balance: {
        ETH: 2.5 + Math.random() * 5,
        POKER: 10000 + Math.random() * 50000,
        USDC: 1000 + Math.random() * 10000,
      },
      nfts: [],
      transactions: [],
    };
  }

  async mintNFT(type: string, rarity: string): Promise<NFTCard> {
    // Simulate NFT minting
    return {
      id: 'nft-' + Date.now(),
      tokenId: Math.floor(Math.random() * 10000),
      name: `${type} #${Math.floor(Math.random() * 1000)}`,
      rarity: rarity as any,
      type: type as any,
      image: `https://placeholder.com/nft/${type}`,
      attributes: [
        { trait: 'Rarity', value: rarity },
        { trait: 'Edition', value: 'Genesis' },
      ],
      price: Math.random() * 5,
      owner: '0x...',
      onSale: false,
      mintDate: new Date(),
      edition: 'Genesis',
      creator: 'PokerMind',
    };
  }

  async buyNFT(nft: NFTCard, currency: string): Promise<Transaction> {
    return {
      id: 'tx-' + Date.now(),
      type: 'buy',
      amount: nft.price,
      currency: currency as any,
      from: '0x...',
      to: nft.owner,
      timestamp: new Date(),
      status: 'pending',
    };
  }
}

// Crypto Wallet Panel
export function CryptoWalletPanel() {
  const [wallet, setWallet] = useState<CryptoWallet | null>(null);
  const [connecting, setConnecting] = useState(false);
  const blockchain = BlockchainManager.getInstance();

  const connectWallet = async () => {
    setConnecting(true);
    try {
      const connectedWallet = await blockchain.connectWallet();
      setWallet(connectedWallet);
    } catch (error) {
      alert('Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  if (!wallet) {
    return (
      <div className="fixed top-4 right-4 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 border-4 border-purple-400 z-30">
        <h3 className="text-purple-300 font-bold text-xl mb-4">🔗 Crypto Wallet</h3>
        <button
          onClick={connectWallet}
          disabled={connecting}
          className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-bold transition ${
            connecting ? 'opacity-50' : ''
          }`}
        >
          {connecting ? '⏳ Connexion...' : '🔓 Connecter Wallet'}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 border-4 border-purple-400 z-30 min-w-80">
      <h3 className="text-purple-300 font-bold text-xl mb-4">💎 Mon Wallet</h3>

      {/* Address */}
      <div className="bg-purple-950/50 rounded-lg p-3 mb-4">
        <div className="text-purple-300 text-xs mb-1">Adresse:</div>
        <div className="text-white text-sm font-mono">
          {wallet.address.substring(0, 10)}...{wallet.address.substring(wallet.address.length - 8)}
        </div>
      </div>

      {/* Balances */}
      <div className="space-y-2 mb-4">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <div className="text-white text-sm">Ξ ETH</div>
            <div className="text-white text-xl font-bold">{wallet.balance.ETH.toFixed(4)}</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <div className="text-white text-sm">🎰 POKER</div>
            <div className="text-white text-xl font-bold">{wallet.balance.POKER.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <div className="text-white text-sm">💵 USDC</div>
            <div className="text-white text-xl font-bold">${wallet.balance.USDC.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* NFTs Count */}
      <div className="bg-purple-950/50 rounded-lg p-3 mb-4">
        <div className="text-purple-300 text-sm">Mes NFTs:</div>
        <div className="text-white text-2xl font-bold">{wallet.nfts.length}</div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <button className="flex-1 bg-purple-700 hover:bg-purple-600 text-white py-2 rounded-lg font-semibold text-sm">
          📥 Dépôt
        </button>
        <button className="flex-1 bg-purple-700 hover:bg-purple-600 text-white py-2 rounded-lg font-semibold text-sm">
          📤 Retrait
        </button>
      </div>
    </div>
  );
}

// NFT Marketplace
export function NFTMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'card-skin' | 'avatar' | 'table-theme'>('all');
  const [sortBy, setSortBy] = useState<'price' | 'rarity' | 'recent'>('recent');

  const sampleNFTs: NFTCard[] = [
    {
      id: '1',
      tokenId: 1234,
      name: 'Royal Flush Golden Card',
      rarity: 'mythic',
      type: 'card-skin',
      image: '👑',
      attributes: [
        { trait: 'Rarity', value: 'Mythic' },
        { trait: 'Edition', value: 'Genesis' },
        { trait: 'Creator', value: 'PokerMind' },
      ],
      price: 5.5,
      owner: '0xabcd...',
      onSale: true,
      mintDate: new Date('2024-01-01'),
      edition: 'Genesis Edition 1/10',
      creator: 'PokerMind Team',
    },
    {
      id: '2',
      tokenId: 2345,
      name: 'Cyberpunk Avatar #42',
      rarity: 'legendary',
      type: 'avatar',
      image: '🤖',
      attributes: [
        { trait: 'Rarity', value: 'Legendary' },
        { trait: 'Type', value: 'Animated' },
      ],
      price: 2.8,
      owner: '0xdef...',
      onSale: true,
      mintDate: new Date('2024-02-15'),
      edition: 'Cyber Series 42/100',
      creator: 'CryptoArtist',
    },
    {
      id: '3',
      tokenId: 3456,
      name: 'Galaxy Table Theme',
      rarity: 'epic',
      type: 'table-theme',
      image: '🌌',
      attributes: [
        { trait: 'Rarity', value: 'Epic' },
        { trait: 'Effect', value: 'Animated Stars' },
      ],
      price: 1.2,
      owner: '0x1234...',
      onSale: true,
      mintDate: new Date('2024-03-20'),
      edition: 'Space Collection',
      creator: 'SpaceDesigner',
    },
  ];

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'mythic':
        return 'from-red-500 via-purple-500 to-yellow-500';
      case 'legendary':
        return 'from-yellow-500 to-orange-500';
      case 'epic':
        return 'from-purple-500 to-pink-500';
      case 'rare':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-white font-bold text-5xl mb-2">🎨 NFT Marketplace</h1>
        <div className="text-purple-300 text-xl">Collectionnez des NFTs exclusifs PokerMind</div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-8">
        <div className="flex gap-2">
          {(['all', 'card-skin', 'avatar', 'table-theme'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {cat === 'all' && '🎯 Tous'}
              {cat === 'card-skin' && '🃏 Cartes'}
              {cat === 'avatar' && '👤 Avatars'}
              {cat === 'table-theme' && '🎨 Thèmes'}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-600"
        >
          <option value="recent">Plus récents</option>
          <option value="price">Prix croissant</option>
          <option value="rarity">Rareté</option>
        </select>
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sampleNFTs.map((nft) => (
          <NFTCard key={nft.id} nft={nft} />
        ))}
      </div>
    </div>
  );
}

// NFT Card Component
function NFTCard({ nft }: { nft: NFTCard }) {
  const [showDetails, setShowDetails] = useState(false);

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'mythic':
        return 'from-red-500 via-purple-500 to-yellow-500';
      case 'legendary':
        return 'from-yellow-500 to-orange-500';
      case 'epic':
        return 'from-purple-500 to-pink-500';
      case 'rare':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`bg-gradient-to-br ${getRarityGradient(nft.rarity)} rounded-2xl p-1`}
    >
      <div className="bg-gray-900 rounded-xl overflow-hidden">
        {/* Image */}
        <div className="relative h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-9xl">{nft.image}</div>
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
            <div className="text-white text-xs font-bold">#{nft.tokenId}</div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          {/* Name & Rarity */}
          <div className="mb-3">
            <div className="text-white font-bold text-lg mb-1">{nft.name}</div>
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRarityGradient(nft.rarity)} text-white`}>
              {nft.rarity.toUpperCase()}
            </div>
          </div>

          {/* Edition */}
          <div className="text-gray-400 text-sm mb-3">{nft.edition}</div>

          {/* Price */}
          <div className="bg-gray-800 rounded-lg p-3 mb-3">
            <div className="text-gray-400 text-xs mb-1">Prix:</div>
            <div className="text-white text-2xl font-bold">Ξ {nft.price.toFixed(2)}</div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 rounded-lg font-bold transition">
              💰 Acheter
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 rounded-lg font-bold"
            >
              ℹ️
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-2xl p-8 max-w-2xl border-4 border-purple-500"
            >
              <h3 className="text-white font-bold text-2xl mb-4">{nft.name}</h3>

              <div className="space-y-3">
                {nft.attributes.map((attr, i) => (
                  <div key={i} className="flex justify-between bg-gray-800 rounded-lg p-3">
                    <div className="text-gray-400">{attr.trait}:</div>
                    <div className="text-white font-bold">{attr.value}</div>
                  </div>
                ))}

                <div className="flex justify-between bg-gray-800 rounded-lg p-3">
                  <div className="text-gray-400">Créateur:</div>
                  <div className="text-purple-400 font-bold">{nft.creator}</div>
                </div>

                <div className="flex justify-between bg-gray-800 rounded-lg p-3">
                  <div className="text-gray-400">Mint Date:</div>
                  <div className="text-white">{nft.mintDate.toLocaleDateString()}</div>
                </div>
              </div>

              <button
                onClick={() => setShowDetails(false)}
                className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold"
              >
                Fermer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Staking Panel
export function StakingPanel() {
  const [staked, setStaked] = useState(50000);
  const [rewards, setRewards] = useState(2450);

  useEffect(() => {
    const interval = setInterval(() => {
      setRewards((prev) => prev + 0.1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-green-900 to-emerald-900 rounded-2xl p-6 border-4 border-green-400">
      <h3 className="text-green-300 font-bold text-2xl mb-6">🌱 Staking POKER</h3>

      {/* Staked Amount */}
      <div className="bg-green-950/50 rounded-xl p-4 mb-4">
        <div className="text-green-300 text-sm mb-2">Tokens Stakés:</div>
        <div className="text-white text-4xl font-bold">{staked.toLocaleString()} POKER</div>
      </div>

      {/* Rewards */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-4 mb-4">
        <div className="text-yellow-900 text-sm mb-2">Récompenses Accumulées:</div>
        <div className="text-white text-3xl font-bold">{rewards.toFixed(2)} POKER</div>
        <div className="text-yellow-100 text-xs mt-1">~${(rewards * 1.5).toFixed(2)} USD</div>
      </div>

      {/* APY */}
      <div className="bg-green-950/50 rounded-xl p-4 mb-4">
        <div className="flex justify-between">
          <div className="text-green-300">APY:</div>
          <div className="text-green-400 text-xl font-bold">18.5%</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold">
          ➕ Staker Plus
        </button>
        <button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-xl font-bold">
          💰 Claim
        </button>
      </div>
    </div>
  );
}
