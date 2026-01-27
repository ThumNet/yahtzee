import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { ScoreCategory, Scorecard as ScorecardType, UPPER_CATEGORIES, LOWER_CATEGORIES } from '../types';
import { Colors, BorderRadius, Spacing, FontSize } from '../utils/constants';
import { calculateUpperTotal, calculateUpperBonus, calculateLowerTotal } from '../utils/scoring';
import { UPPER_BONUS_THRESHOLD } from '../utils/constants';

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

  return (
    <TouchableOpacity
      onPress={canScore ? onPress : undefined}
      disabled={!canScore}
      style={[
        styles.row,
        compact && styles.rowCompact,
        isTotal && styles.rowTotal,
        isBonus && styles.rowBonus,
        canScore && styles.rowSelectable,
        isSelected && styles.rowSelected,
      ]}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, isTotal && styles.labelTotal, compact && styles.labelCompact, isSelected && styles.labelSelected]}>{label}</Text>
      <View style={styles.scoreContainer}>
        {isScored ? (
          <Text style={[styles.score, isTotal && styles.scoreTotal, compact && styles.scoreCompact]}>{score}</Text>
        ) : potentialScore !== null ? (
          <Text style={[styles.potentialScore, compact && styles.scoreCompact, isSelected && styles.potentialScoreSelected]}>{potentialScore}</Text>
        ) : (
          <Text style={[styles.emptyScore, compact && styles.scoreCompact]}>-</Text>
        )}
      </View>
    </TouchableOpacity>
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

  const content = (
    <>
      {isWideScreen ? (
        // Wide screen: two columns side by side
        <View style={styles.columnsContainer}>
          {/* Upper Section Column */}
          <View style={styles.column}>
            <View style={[styles.section, styles.sectionCompact]}>
              <Text style={[styles.sectionTitle, styles.sectionTitleCompact]}>UPPER</Text>
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
                label={`Bonus (${upperTotal}/${UPPER_BONUS_THRESHOLD})`}
                score={upperBonus}
                potentialScore={null}
                isBonus
                compact={compact}
              />
              <ScoreRow label="Total" score={upperTotal + upperBonus} potentialScore={null} isTotal compact={compact} />
            </View>
          </View>

          {/* Lower Section Column */}
          <View style={styles.column}>
            <View style={[styles.section, styles.sectionCompact]}>
              <Text style={[styles.sectionTitle, styles.sectionTitleCompact]}>LOWER</Text>
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
              <ScoreRow label="Total" score={lowerTotal + yahtzeeBonus} potentialScore={null} isTotal compact={compact} />
            </View>
          </View>
        </View>
      ) : (
        // Mobile: stacked sections
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>UPPER SECTION</Text>
            {UPPER_CATEGORIES.map((cat) => (
              <ScoreRow
                key={cat.key}
                label={cat.label}
                score={scorecard[cat.key]}
                potentialScore={getPotentialScore(cat.key)}
                onPress={() => onScoreCategory(cat.key)}
                isSelected={cat.key === selectedCategory}
              />
            ))}
            <ScoreRow
              label={`Upper Bonus (${upperTotal}/${UPPER_BONUS_THRESHOLD})`}
              score={upperBonus}
              potentialScore={null}
              isBonus
            />
            <ScoreRow label="Upper Total" score={upperTotal + upperBonus} potentialScore={null} isTotal />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LOWER SECTION</Text>
            {LOWER_CATEGORIES.map((cat) => (
              <ScoreRow
                key={cat.key}
                label={cat.label}
                score={scorecard[cat.key]}
                potentialScore={getPotentialScore(cat.key)}
                onPress={() => onScoreCategory(cat.key)}
                isSelected={cat.key === selectedCategory}
              />
            ))}
            {yahtzeeBonus > 0 && (
              <ScoreRow label="Yahtzee Bonus" score={yahtzeeBonus} potentialScore={null} isBonus />
            )}
            <ScoreRow label="Lower Total" score={lowerTotal + yahtzeeBonus} potentialScore={null} isTotal />
          </View>
        </>
      )}

      {/* Grand Total */}
      <View style={[styles.grandTotalContainer, isWideScreen && styles.grandTotalCompact]}>
        <Text style={[styles.grandTotalLabel, isWideScreen && styles.grandTotalLabelCompact]}>GRAND TOTAL</Text>
        <Text style={[styles.grandTotalScore, isWideScreen && styles.grandTotalScoreCompact]}>{totalScore}</Text>
      </View>
    </>
  );

  // On wide screens, don't use ScrollView to avoid scrolling
  if (isWideScreen) {
    return <View style={styles.container}>{content}</View>;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {content}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Two-column layout for wide screens
  columnsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  column: {
    flex: 1,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionCompact: {
    marginBottom: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: 'bold',
    color: Colors.primary,
    backgroundColor: Colors.surfaceLight,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    letterSpacing: 2,
    textShadowColor: Colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  sectionTitleCompact: {
    fontSize: FontSize.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowCompact: {
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
  },
  rowTotal: {
    backgroundColor: Colors.surfaceLight,
  },
  rowBonus: {
    backgroundColor: Colors.rowBonus,
    borderLeftWidth: 2,
    borderLeftColor: Colors.warning,
  },
  rowSelectable: {
    backgroundColor: Colors.rowSelectable,
    borderLeftWidth: 2,
    borderLeftColor: Colors.primary,
  },
  rowSelected: {
    backgroundColor: Colors.primary + '30',
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  labelCompact: {
    fontSize: FontSize.xs,
  },
  labelTotal: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
  labelSelected: {
    color: Colors.primary,
  },
  scoreContainer: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
  score: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  scoreCompact: {
    fontSize: FontSize.sm,
  },
  scoreTotal: {
    fontWeight: 'bold',
    color: Colors.primary,
    textShadowColor: Colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  potentialScore: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.success,
    textShadowColor: Colors.success,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  potentialScoreSelected: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  emptyScore: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  grandTotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  grandTotalCompact: {
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  grandTotalLabel: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    color: Colors.primary,
    letterSpacing: 2,
    textShadowColor: Colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  grandTotalLabelCompact: {
    fontSize: FontSize.md,
  },
  grandTotalScore: {
    fontSize: FontSize.xxl,
    fontWeight: 'bold',
    color: Colors.text,
    textShadowColor: Colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  grandTotalScoreCompact: {
    fontSize: FontSize.xl,
  },
});
