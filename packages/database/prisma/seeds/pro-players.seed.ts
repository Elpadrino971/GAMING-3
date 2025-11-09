import { PrismaClient, ProPlayStyle, TipCategory } from '@prisma/client';
import { PRO_PLAYERS_DATABASE } from '../../../pro-knowledge/src/pro-data';

const prisma = new PrismaClient();

/**
 * Seed la database avec tous les pros et leurs conseils
 */
async function seedProPlayers() {
  console.log('🏆 Seeding Pro Players...');

  for (const proData of PRO_PLAYERS_DATABASE) {
    console.log(`  → Creating ${proData.name}...`);

    // Créer ou mettre à jour le pro
    const pro = await prisma.proPlayer.upsert({
      where: { id: proData.id },
      update: {},
      create: {
        id: proData.id,
        name: proData.name,
        nickname: proData.nickname,
        country: proData.country,
        totalWinnings: proData.totalWinnings,
        braceletCount: proData.braceletCount,
        playStyle: proData.playStyle as ProPlayStyle,
        specialty: proData.specialty,
        bio: proData.bio,
        photoUrl: proData.photoUrl,
        vpipAvg: proData.stats.vpipAvg,
        pfrAvg: proData.stats.pfrAvg,
        aggressionFactor: proData.stats.aggressionFactor,
        threebet: proData.stats.threebet,
        cbet: proData.stats.cbet,
        price: proData.price,
        personality: proData.personality,
        famousQuote: proData.famousQuote
      }
    });

    // Créer les tips
    console.log(`    → Creating ${proData.tips.length} tips...`);
    for (const tip of proData.tips) {
      await prisma.proTip.upsert({
        where: {
          proPlayerId_title: {
            proPlayerId: pro.id,
            title: tip.title
          }
        },
        update: {},
        create: {
          proPlayerId: pro.id,
          title: tip.title,
          content: tip.content,
          category: tip.category as TipCategory,
          situation: tip.situation,
          source: tip.source,
          difficulty: tip.difficulty,
          popularity: Math.floor(Math.random() * 1000) // Random initial popularity
        }
      });
    }

    console.log(`  ✅ ${proData.name} created with ${proData.tips.length} tips`);
  }

  // Statistiques finales
  const totalPros = await prisma.proPlayer.count();
  const totalTips = await prisma.proTip.count();

  console.log('\n📊 Seeding Complete:');
  console.log(`  → ${totalPros} Professional Players`);
  console.log(`  → ${totalTips} Total Tips`);
  console.log('  → Categories: PRE_FLOP, POST_FLOP, BLUFFING, VALUE_BETTING, POSITION, RANGE_READING, BANKROLL, TOURNAMENT, CASH_GAME, MENTAL_GAME, PHYSICAL_TELLS, ICM');
}

/**
 * Seed des stratégies complètes pour quelques pros
 */
async function seedProStrategies() {
  console.log('\n📚 Seeding Pro Strategies...');

  // Stratégie GTO de Fedor Holz
  await prisma.proStrategy.upsert({
    where: {
      proPlayerId_title: {
        proPlayerId: 'fedor-holz',
        title: 'GTO Foundation - 30 Day Plan'
      }
    },
    update: {},
    create: {
      proPlayerId: 'fedor-holz',
      title: 'GTO Foundation - 30 Day Plan',
      description: 'Learn Game Theory Optimal poker from scratch with Fedor Holz',
      content: `
# GTO Foundation - 30 Day Plan by Fedor Holz

## Week 1: Understanding Ranges
- Study pre-calculated ranges for all positions
- Learn the concept of balanced play
- Practice range vs range thinking
- Quiz: 10 GTO situations

## Week 2: Mental Game Mastery
- Daily meditation (10 minutes)
- Emotional tracking after each session
- Tilt management techniques
- Breathing exercises before big decisions

## Week 3: ICM Understanding
- Learn ICM pressure dynamics
- Study bubble situations
- Practice final table scenarios
- Quiz: 15 ICM spots

## Week 4: Advanced Multi-Street Planning
- Plan all 3 streets before acting
- Practice exploits based on GTO foundation
- Daily hand reviews
- Tournament simulation

## Week 5+: Performance Optimization
- Track your IDI (Ivey Decision Index)
- Compare your stats with mine
- Continuous adjustments based on data
`,
      category: 'GTO',
      difficulty: 3,
      estimatedHours: 40
    }
  });

  // Stratégie Reading de Negreanu
  await prisma.proStrategy.upsert({
    where: {
      proPlayerId_title: {
        proPlayerId: 'daniel-negreanu',
        title: 'Small Ball & Player Reading'
      }
    },
    update: {},
    create: {
      proPlayerId: 'daniel-negreanu',
      title: 'Small Ball & Player Reading',
      description: 'Master the art of reading players and playing small ball poker',
      content: `
# Small Ball & Player Reading by Daniel Negreanu

## Phase 1: Observation Skills
- Watch betting patterns for 30 minutes before playing
- Note timing tells
- Identify bet sizing patterns
- Create mental profiles

## Phase 2: Small Ball Theory
- Keep pots small with marginal hands
- Use position aggressively
- Apply pressure with small bets
- Avoid big confrontations without the nuts

## Phase 3: Advanced Reads
- Physical tells in live poker
- Betting patterns in online poker
- Range narrowing techniques
- Putting opponents on exact hands

## Phase 4: Integration
- Combine reads with GTO foundation
- Know when to exploit vs when to balance
- Practice in low-stakes first
- Review key hands daily
`,
      category: 'EXPLOITATIVE',
      difficulty: 2,
      estimatedHours: 30
    }
  });

  // Stratégie Aggression de Phil Ivey
  await prisma.proStrategy.upsert({
    where: {
      proPlayerId_title: {
        proPlayerId: 'phil-ivey',
        title: 'Fearless Aggression'
      }
    },
    update: {},
    create: {
      proPlayerId: 'phil-ivey',
      title: 'Fearless Aggression',
      description: 'Learn to apply relentless pressure like Phil Ivey',
      content: `
# Fearless Aggression by Phil Ivey

## Principle 1: Aggression Wins
- Never check when you can bet
- Apply maximum pressure
- Make opponents make tough decisions
- Own the table

## Principle 2: Trust Your Read
- When you feel weakness, attack
- Don't second-guess yourself
- Commit to your decisions
- Learn from mistakes, don't fear them

## Principle 3: Bet Sizing for Maximum Pressure
- Size your bets to put maximum pressure
- Use psychology, not just math
- Mix up your sizing to stay unpredictable
- Always have a plan for all streets

## Principle 4: Cash Game Mastery
- Deep stack strategy
- Implied odds calculations
- Level thinking (what do they think I have?)
- Table image management
`,
      category: 'AGGRESSIVE',
      difficulty: 4,
      estimatedHours: 50
    }
  });

  console.log('  ✅ 3 Complete Strategies Created');
}

/**
 * Main seed function
 */
async function main() {
  try {
    await seedProPlayers();
    await seedProStrategies();
    console.log('\n✨ All Pro Knowledge Seeded Successfully!\n');
  } catch (error) {
    console.error('❌ Error seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
