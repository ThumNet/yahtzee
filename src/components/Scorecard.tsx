import React, { useState } from 'react';
import { ScoreCategory, Scorecard as ScorecardType, UPPER_CATEGORIES, LOWER_CATEGORIES } from '../types';
import { Colors, BorderRadius, Spacing, FontSize } from '../utils/constants';
import { calculateUpperTotal, calculateUpperBonus, calculateLowerTotal } from '../utils/scoring';
import { UPPER_BONUS_THRESHOLD } from '../utils/constants';
import { useWindowDimensions } from '../hooks/useWindowDimensions';

interface ScorecardProps {
  scorecard: ScorecardType;
  onScoreCategory: (category: ScoreCategory) => void;
  getPotentialScore: (category: ScoreCategory) => number | null;
  yahtzeeBonus: number;
  totalScore: number;
  selectedCategory?: ScoreCategory | null;
}

interface ScoreRowProps {
  label: string;
  score: number | null;
  potentialScore: number | null;
  onPress?: () => void;
  isTotal?: boolean;
  isBonus?: boolean;
  compact?: boolean;
  isSelected?: boolean;
}

const WIDE_SCREEN_BREAKPOINT = 768;

function ScoreRow({ label, score, potentialScore, onPress, isTotal = false, isBonus = false, compact = false, isSelected = false }: ScoreRowProps) {
  const isScored = score !== null;
  const canScore = !isScored && potentialScore !== null && onPress;
  const [hovered, setHovered] = useState(false);

  const getBg = () => {
    if (isTotal) return Colors.surfaceLight;
    if (isBonus) return Colors.rowBonus;
    if (isSelected) return Colors.primary + '30';
    if (hovered && canScore) return Colors.primary + '25';
    if (canScore) return Colors.rowSelectable;
    return 'transparent';
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: compact ? 4 : Spacing.sm,
    paddingBottom: compact ? 4 : Spacing.sm,
    paddingLeft: compact ? Spacing.sm : Spacing.md,
    paddingRight: compact ? Spacing.sm : Spacing.md,
    borderBottom: `1px solid ${Colors.border}`,
    borderLeft: isSelected ? `3px solid ${Colors.primary}` : (isBonus ? `2px solid ${Colors.warning}` : canScore ? `2px solid ${Colors.primary}` : 'none'),
    backgroundColor: getBg(),
    cursor: canScore ? 'pointer' : 'default',
    transition: 'background-color 0.1s',
  };

  const labelColor = isTotal ? Colors.primary : isSelected ? Colors.primary : hovered && canScore ? Colors.primary : Colors.text;
  const labelStyle: React.CSSProperties = {
    fontSize: compact ? FontSize.xs : FontSize.sm,
    color: labelColor,
    fontWeight: isTotal ? 'bold' : 'normal',
  };

  const renderScore = () => {
    if (isScored) {
      return (
        <span style={{
          fontSize: compact ? FontSize.sm : FontSize.md,
          fontWeight: isTotal ? 'bold' : '600',
          color: isTotal ? Colors.primary : Colors.text,
          textShadow: isTotal ? `0 0 4px ${Colors.primary}` : 'none',
        }}>
          {score}
        </span>
      );
    }
    if (potentialScore !== null) {
      return (
        <span style={{
          fontSize: compact ? FontSize.sm : FontSize.md,
          fontWeight: '600',
          color: isSelected ? Colors.primary : hovered ? Colors.primary : Colors.success,
          textShadow: `0 0 6px ${isSelected || hovered ? Colors.primary : Colors.success}`,
        }}>
          {potentialScore}
        </span>
      );
    }
    return (
      <span style={{ fontSize: compact ? FontSize.sm : FontSize.md, color: Colors.textSecondary }}>-</span>
    );
  };

  return (
    <div
      style={rowStyle}
      onClick={canScore ? onPress : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={labelStyle}>{label}</span>
      <div style={{ minWidth: 40, display: 'flex', justifyContent: 'flex-end' }}>
        {renderScore()}
      </div>
    </div>
  );
}

export function Scorecard({
  scorecard,
  onScoreCategory,
  getPotentialScore,
  yahtzeeBonus,
  totalScore,
  selectedCategory,
}: ScorecardProps) {
  const { width } = useWindowDimensions();
  const isWideScreen = width >= WIDE_SCREEN_BREAKPOINT;
  const compact = isWideScreen;

  const upperTotal = calculateUpperTotal(scorecard);
  const upperBonus = calculateUpperBonus(scorecard);
  const lowerTotal = calculateLowerTotal(scorecard);

  const sectionStyle: React.CSSProperties = {
    backgroundColor: Colors.surface,
    borderRadius: compact ? BorderRadius.md : BorderRadius.lg,
    marginBottom: compact ? Spacing.xs : Spacing.md,
    overflow: 'hidden',
    border: `1px solid ${Colors.border}`,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: compact ? FontSize.xs : FontSize.sm,
    fontWeight: 'bold',
    color: Colors.primary,
    backgroundColor: Colors.surfaceLight,
    paddingTop: compact ? Spacing.xs : Spacing.sm,
    paddingBottom: compact ? Spacing.xs : Spacing.sm,
    paddingLeft: compact ? Spacing.sm : Spacing.md,
    paddingRight: compact ? Spacing.sm : Spacing.md,
    letterSpacing: 2,
    textShadow: `0 0 6px ${Colors.primary}`,
    display: 'block',
  };

  const grandTotalStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: compact ? BorderRadius.md : BorderRadius.lg,
    padding: compact ? Spacing.sm : Spacing.md,
    marginBottom: compact ? Spacing.sm : Spacing.xl,
    marginTop: compact ? Spacing.xs : 0,
    border: `2px solid ${Colors.primary}`,
    boxShadow: `0 0 12px ${Colors.primary}80`,
  };

  const upperSection = (
    <div style={sectionStyle}>
      <span style={sectionTitleStyle}>{isWideScreen ? 'UPPER' : 'UPPER SECTION'}</span>
      {UPPER_CATEGORIES.map((cat) => (
        <ScoreRow
          key={cat.key}
          label={cat.label}
          score={scorecard[cat.key]}
          potentialScore={getPotentialScore(cat.key)}
          onPress={() => onScoreCategory(cat.key)}
          compact={compact}
          isSelected={cat.key === selectedCategory}
        />
      ))}
      <ScoreRow
        label={`${isWideScreen ? '' : 'Upper '}Bonus (${upperTotal}/${UPPER_BONUS_THRESHOLD})`}
        score={upperBonus}
        potentialScore={null}
        isBonus
        compact={compact}
      />
      <ScoreRow label={isWideScreen ? 'Total' : 'Upper Total'} score={upperTotal + upperBonus} potentialScore={null} isTotal compact={compact} />
    </div>
  );

  const lowerSection = (
    <div style={sectionStyle}>
      <span style={sectionTitleStyle}>{isWideScreen ? 'LOWER' : 'LOWER SECTION'}</span>
      {LOWER_CATEGORIES.map((cat) => (
        <ScoreRow
          key={cat.key}
          label={cat.label}
          score={scorecard[cat.key]}
          potentialScore={getPotentialScore(cat.key)}
          onPress={() => onScoreCategory(cat.key)}
          compact={compact}
          isSelected={cat.key === selectedCategory}
        />
      ))}
      {yahtzeeBonus > 0 && (
        <ScoreRow label="Yahtzee Bonus" score={yahtzeeBonus} potentialScore={null} isBonus compact={compact} />
      )}
      <ScoreRow label={isWideScreen ? 'Total' : 'Lower Total'} score={lowerTotal + yahtzeeBonus} potentialScore={null} isTotal compact={compact} />
    </div>
  );

  const grandTotal = (
    <div style={grandTotalStyle}>
      <span style={{
        fontSize: compact ? FontSize.md : FontSize.lg,
        fontWeight: 'bold',
        color: Colors.primary,
        letterSpacing: 2,
        textShadow: `0 0 8px ${Colors.primary}`,
      }}>
        GRAND TOTAL
      </span>
      <span style={{
        fontSize: compact ? FontSize.xl : FontSize.xxl,
        fontWeight: 'bold',
        color: Colors.text,
        textShadow: `0 0 10px ${Colors.primary}`,
      }}>
        {totalScore}
      </span>
    </div>
  );

  if (isWideScreen) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: Spacing.sm, flex: 1 }}>
          <div style={{ flex: 1 }}>{upperSection}</div>
          <div style={{ flex: 1 }}>{lowerSection}</div>
        </div>
        {grandTotal}
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {upperSection}
      {lowerSection}
      {grandTotal}
    </div>
  );
}
