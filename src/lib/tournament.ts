import { Batalha, MC } from './supabase';

export const PHASE_ORDER = ['final', 'semifinal', 'quartas', 'oitavas', '16-avos'];

export const PHASE_LABELS: Record<string, string> = {
  final: 'Final',
  semifinal: 'Semifinal',
  quartas: 'Quartas de Final',
  oitavas: 'Oitavas de Final',
  '16-avos': '16-avos de Final',
};

export function getPhaseLabel(phase?: string) {
  if (!phase) return 'Batalha';
  return PHASE_LABELS[phase] || phase;
}

export function getInitialPhaseBySize(size: number) {
  if (size >= 32) return '16-avos';
  if (size >= 16) return 'oitavas';
  if (size >= 8) return 'quartas';
  if (size >= 4) return 'semifinal';
  return 'final';
}

export function sortBattlesByBracketFlow(battles: Batalha[]) {
  return [...battles].sort((a, b) => {
    const phaseDiff = PHASE_ORDER.indexOf(a.fase || '') - PHASE_ORDER.indexOf(b.fase || '');
    if (phaseDiff !== 0) return phaseDiff;
    return (a.ordem_na_fase || 0) - (b.ordem_na_fase || 0);
  });
}

export function groupBattlesByPhase(battles: Batalha[]) {
  return sortBattlesByBracketFlow(battles).reduce<Record<string, Batalha[]>>((acc, battle) => {
    const phase = battle.fase || 'outros';
    if (!acc[phase]) acc[phase] = [];
    acc[phase].push(battle);
    return acc;
  }, {});
}

export function generateBracketMatches(participants: MC[], torneioId: string, date: string) {
  const shuffled = [...participants].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  const participantCount = shuffled.length;
  const rounds = Math.log2(participantCount);

  if (participantCount < 2 || !Number.isInteger(rounds)) {
    throw new Error('O torneio precisa ter uma quantidade de MCs em potência de 2 (4, 8, 16...).');
  }

  const phaseSequence = ['final', 'semifinal', 'quartas', 'oitavas', '16-avos'];
  const matchesByRound: Array<Array<Record<string, unknown>>> = [];

  for (let round = 0; round < rounds; round += 1) {
    const matchesInRound = participantCount / Math.pow(2, round + 1);
    const phase = phaseSequence[rounds - round - 1] || `fase-${round + 1}`;
    const roundMatches: Array<Record<string, unknown>> = [];

    for (let i = 0; i < matchesInRound; i += 1) {
      roundMatches.push({
        torneio_id: torneioId,
        data: date,
        fase: phase,
        ordem_na_fase: i + 1,
        mc1_id: round === 0 ? shuffled[i * 2].id : null,
        mc2_id: round === 0 ? shuffled[i * 2 + 1].id : null,
        vencedor_id: null,
        placar_mc1: null,
        placar_mc2: null,
        proxima_slot: null,
      });
    }

    matchesByRound.push(roundMatches);
  }

  return matchesByRound.flat();
}
